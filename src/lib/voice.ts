// Browser side of the voice features: the CV chat's mic button (src/components/cv-chat.tsx) and the
// voice call (src/components/cv-call.tsx). Recordings go to Groq Whisper through /api/transcribe;
// answers are read aloud with Groq's voice through /api/speak, or the browser's own voice.

import type { Locale } from "@/lib/i18n/config";

// Same as TTS_MAX_CHARS in src/lib/groq.ts (server only)
const SENTENCE_MAX_CHARS = 200;
// Browser voice language per page language
const speechLang: Record<Locale, string> = { en: "en-US", ar: "ar-SA", fr: "fr-FR", de: "de-DE", es: "es-ES" };

export const voiceSupported = () =>
  typeof window !== "undefined" &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof MediaRecorder !== "undefined" &&
  typeof AudioContext !== "undefined";

// Thrown when /api/transcribe answers with an error status
export class VoiceError extends Error {
  constructor(public status: number) {
    super(`voice ${status}`);
  }
}

let context: AudioContext | null = null;

// One shared AudioContext. Call it straight from the visitor's tap: Safari only plays audio from a
// context that was started that way.
export function audioContext() {
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  return context;
}

export const openMic = () =>
  navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });

const recordingType = () =>
  ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find((type) => MediaRecorder.isTypeSupported(type)) ??
  "";

export interface Recording {
  // The recorded question, or null when nobody spoke (or it was cancelled)
  done: Promise<Blob | null>;
  // Stop now and keep what was said so far
  finish: () => void;
  cancel: () => void;
}

// A muted mic (in the OS or with a laptop's mute key) records pure digital silence, not quiet noise
const DEAD_MIC_MS = 2000;

// Records one spoken question: waits for the visitor to start talking, then stops after a pause.
// onLevel gets the input loudness (0-1) for the listening animation; onDeadMic fires once when the
// mic has sent nothing at all for a while, so the visitor can be told to unmute it.
export function recordUtterance(
  stream: MediaStream,
  { silenceMs = 1200, waitMs = 15_000, maxMs = 20_000, onLevel, onDeadMic }: {
    silenceMs?: number;
    waitMs?: number;
    maxMs?: number;
    onLevel?: (level: number) => void;
    onDeadMic?: () => void;
  } = {},
): Recording {
  const ctx = audioContext();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);
  const samples = new Float32Array(analyser.fftSize);

  const type = recordingType();
  const recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  let resolve: (audio: Blob | null) => void = () => {};
  const done = new Promise<Blob | null>((r) => (resolve = r));
  const started = Date.now();
  // Background noise level, so a noisy room doesn't count as speech
  let noise = 0.01;
  let loudFrames = 0;
  let spokeAt = 0;
  let quietSince = 0;
  let keep = false;
  let heardAnything = false;

  const stop = (keepAudio: boolean) => {
    if (recorder.state === "inactive") return;
    keep = keepAudio && spokeAt > 0;
    clearInterval(timer);
    source.disconnect();
    onLevel?.(0);
    recorder.stop();
  };
  recorder.onstop = () => resolve(keep && chunks.length ? new Blob(chunks, { type: recorder.mimeType || type }) : null);

  // A timer rather than requestAnimationFrame, which stops in background tabs
  const timer = window.setInterval(() => {
    analyser.getFloatTimeDomainData(samples);
    let sum = 0;
    for (const s of samples) sum += s * s;
    const rms = Math.sqrt(sum / samples.length);
    onLevel?.(Math.min(1, rms * 12));

    const now = Date.now();
    if (rms > 0) heardAnything = true;
    else if (!heardAnything && now - started > DEAD_MIC_MS) {
      heardAnything = true;
      onDeadMic?.();
    }
    if (rms > Math.max(0.015, noise * 2.5)) {
      loudFrames++;
      quietSince = 0;
      // 150 ms of sound before it counts as speech, so a click or a cough doesn't
      if (loudFrames >= 3 && !spokeAt) spokeAt = now;
    } else {
      loudFrames = 0;
      noise = noise * 0.95 + rms * 0.05;
      quietSince ||= now;
    }
    if (spokeAt && ((quietSince && now - quietSince > silenceMs) || now - spokeAt > maxMs)) stop(true);
    else if (!spokeAt && now - started > waitMs) stop(false);
  }, 50);
  recorder.start();

  return { done, finish: () => stop(true), cancel: () => stop(false) };
}

export async function transcribe(audio: Blob, locale: Locale): Promise<string> {
  const form = new FormData();
  form.append("audio", audio);
  form.append("locale", locale);
  const res = await fetch("/api/transcribe", { method: "POST", body: form });
  if (!res.ok) throw new VoiceError(res.status);
  const data: { text?: unknown } = await res.json();
  return typeof data.text === "string" ? data.text.trim() : "";
}

// Text as it should be spoken: no markdown or list markers
const spoken = (text: string) =>
  text
    .replace(/\*\*|__|`/g, "")
    .replace(/^\s*(?:[-*•]|\d+\.)\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();

// Where the first sentence of the text ends (0 if none has ended yet). Only a stop followed by a
// space counts, so "Next.js" and a half-streamed "3." followed by "5 years" stay whole.
function sentenceEnd(text: string): number {
  const match = /[.!?؟\n](?=\s)/.exec(text);
  if (match && match.index < SENTENCE_MAX_CHARS) return match.index + 1;
  if (text.length <= SENTENCE_MAX_CHARS) return 0;
  // A very long sentence: cut it at a comma or space
  const head = text.slice(0, SENTENCE_MAX_CHARS);
  const cut = Math.max(head.lastIndexOf(", "), head.lastIndexOf("، "));
  return cut > 40 ? cut + 1 : head.lastIndexOf(" ") > 0 ? head.lastIndexOf(" ") : SENTENCE_MAX_CHARS;
}

// Cuts a streaming answer into sentences, so the first one is spoken while the rest is still arriving
export function sentenceSplitter(onSentence: (sentence: string) => void) {
  let buffer = "";
  const emit = (text: string) => {
    const sentence = spoken(text);
    if (sentence) onSentence(sentence);
  };
  return {
    push(chunk: string) {
      buffer += chunk;
      for (let end = sentenceEnd(buffer); end > 0; end = sentenceEnd(buffer)) {
        emit(buffer.slice(0, end));
        buffer = buffer.slice(end);
      }
    },
    flush() {
      while (buffer.trim()) {
        const end = sentenceEnd(buffer) || buffer.length;
        emit(buffer.slice(0, end));
        buffer = buffer.slice(end);
      }
    },
  };
}

// Reads sentences aloud one after another: Groq's voice where /api/speak has one for the language,
// otherwise the browser's. Each sentence's audio is fetched as soon as it is queued, so the next one
// is usually ready by the time the current one ends.
export function createSpeaker(locale: Locale, onSpeaking: () => void) {
  let queue = Promise.resolve();
  let silenced = false;
  // Off for the rest of the call once /api/speak says there is no Groq voice (or it failed)
  let groqVoice = true;
  let playing: AudioBufferSourceNode | null = null;

  const fetchAudio = async (text: string): Promise<AudioBuffer | null> => {
    if (!groqVoice) return null;
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, locale }),
      });
      if (res.status !== 200) {
        groqVoice = false;
        return null;
      }
      return await audioContext().decodeAudioData(await res.arrayBuffer());
    } catch {
      return null;
    }
  };

  const playAudio = (buffer: AudioBuffer) =>
    new Promise<void>((resolve) => {
      const ctx = audioContext();
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(ctx.destination);
      node.onended = () => {
        playing = null;
        resolve();
      };
      playing = node;
      node.start();
    });

  const playBrowserVoice = (text: string) =>
    new Promise<void>((resolve) => {
      if (!("speechSynthesis" in window)) return resolve();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = speechLang[locale];
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      speechSynthesis.speak(utterance);
    });

  return {
    say(text: string) {
      if (silenced) return;
      const audio = fetchAudio(text);
      queue = queue.then(async () => {
        const buffer = await audio;
        if (silenced) return;
        onSpeaking();
        await (buffer ? playAudio(buffer) : playBrowserVoice(text));
      });
    },
    // Resolves once everything queued has been spoken (or stopped)
    idle: () => queue,
    // Stops talking and ignores the rest of this answer, until reset() for the next one
    stop() {
      silenced = true;
      playing?.stop();
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    reset() {
      silenced = false;
    },
  };
}
