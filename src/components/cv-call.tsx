"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Bot, Mic, MicOff, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatError, MAX_CHARS, streamAnswer, track, type ChatMessage } from "@/lib/chat-client";
import { VoiceError, createSpeaker, openMic, recordUtterance, sentenceSplitter, transcribe, type Recording } from "@/lib/voice";
import type { ChatModelId } from "@/lib/chat-models";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";
import type { Locale } from "@/lib/i18n/config";

type Status = "connecting" | "listening" | "thinking" | "speaking";

// Keeps one visitor from holding the free Groq quota for long
const CALL_LIMIT_S = 5 * 60;

const plain = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1");
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Hands-free voice call inside the CV chat panel (src/components/cv-chat.tsx): listen, transcribe
// (Groq Whisper), answer (/api/chat in voice mode), read the answer aloud, listen again.
// Each finished question and answer is added to the chat, so the transcript stays after hanging up.
export default function CvCall({
  t,
  locale,
  model,
  history,
  onMessages,
  onEnd,
}: {
  t: Dictionary["chat"];
  locale: Locale;
  model: ChatModelId;
  history: ChatMessage[];
  onMessages: (messages: ChatMessage[]) => void;
  // error: a message to show in the chat after the call
  onEnd: (error?: string) => void;
}) {
  const [status, setStatus] = useState<Status>("connecting");
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("");
  // The mic sends no sound at all (muted in the OS or with a mute key), not just a quiet room
  const [deadMic, setDeadMic] = useState(false);
  const mutedRef = useRef(false);
  const ringRef = useRef<HTMLSpanElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const speakerRef = useRef<ReturnType<typeof createSpeaker> | null>(null);

  // The listening ring follows the visitor's voice; set directly so it doesn't re-render 20 times a second
  const showLevel = (level: number) => {
    if (ringRef.current) ringRef.current.style.transform = `scale(${1 + level * 0.5})`;
    if (level > 0) setDeadMic(false);
  };
  // Our own mute button also silences the mic; that's expected, not a problem to report
  const onDeadMic = () => setDeadMic(!mutedRef.current);

  const run = useEffectEvent(async (signal: AbortSignal) => {
    let stream: MediaStream;
    try {
      stream = await openMic();
    } catch {
      onEnd(t.micDenied);
      return;
    }
    const speaker = createSpeaker(locale, () => setStatus("speaking"));
    let recording: Recording | null = null;
    const hangUp = () => {
      recording?.cancel();
      speaker.stop();
      stream.getTracks().forEach((track) => track.stop());
    };
    if (signal.aborted) return hangUp();
    signal.addEventListener("abort", hangUp);
    streamRef.current = stream;
    speakerRef.current = speaker;

    const startedAt = Date.now();
    let messages = history;
    let turns = 0;
    track("call_start", { locale });
    try {
      while (!signal.aborted) {
        setStatus("listening");
        recording = recordUtterance(stream, { onLevel: showLevel, onDeadMic });
        const audio = await recording.done;
        if (!audio || signal.aborted) continue;

        setStatus("thinking");
        const question = (await transcribe(audio, locale)).slice(0, MAX_CHARS);
        // Nothing recognisable was said: keep listening
        if (!question || signal.aborted) continue;
        setHeard(question);
        setReply("");

        const asked = [...messages, { role: "user" as const, text: question }];
        speaker.reset();
        const sentences = sentenceSplitter(speaker.say);
        const answer = await streamAnswer(asked, { locale, model, voice: true, signal }, (text, chunk) => {
          setReply(plain(text));
          sentences.push(chunk);
        });
        sentences.flush();
        if (!answer.trim()) throw new ChatError(502);
        messages = [...asked, { role: "model", text: answer }];
        onMessages(messages);
        turns++;
        await speaker.idle();
      }
    } catch (e) {
      if (signal.aborted) return;
      const status = e instanceof ChatError || e instanceof VoiceError ? e.status : 0;
      track("call_error", { status });
      hangUp();
      onEnd(status === 429 ? t.rateLimited : e instanceof ChatError ? t.error : t.voiceBusy);
    } finally {
      track("call_end", { seconds: Math.round((Date.now() - startedAt) / 1000), turns });
    }
  });

  useEffect(() => {
    // Started on the next tick, so React's dev double-mount doesn't open the mic twice
    const controller = new AbortController();
    const start = window.setTimeout(() => run(controller.signal));
    return () => {
      window.clearTimeout(start);
      controller.abort();
    };
  }, []);

  const timeUp = useEffectEvent(() => onEnd());
  useEffect(() => {
    if (seconds >= CALL_LIMIT_S) timeUp();
  }, [seconds]);
  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleMute = () => {
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((track) => (track.enabled = !next));
    mutedRef.current = next;
    setMuted(next);
    if (next) setDeadMic(false);
  };

  const label = {
    connecting: t.connecting,
    listening: muted ? t.muted : t.listening,
    thinking: t.thinking,
    speaking: t.speaking,
  }[status];

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-6 py-6 text-center text-sm">
        <button
          type="button"
          // Tap while it talks to cut the answer short and ask the next question
          onClick={() => speakerRef.current?.stop()}
          disabled={status !== "speaking"}
          aria-label={status === "speaking" ? t.speaking : label}
          className="relative grid place-items-center size-28 shrink-0 rounded-full"
        >
          <span
            ref={ringRef}
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full bg-muted transition-transform duration-100",
              status === "speaking" && "animate-pulse",
            )}
          />
          <span className="relative grid place-items-center size-20 rounded-full bg-primary text-primary-foreground" aria-hidden="true">
            <Bot size={32} />
          </span>
        </button>

        <div aria-live="polite">
          <p className="font-medium">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums" dir="ltr">
            {clock(seconds)}
          </p>
        </div>

        {deadMic && status === "listening" && <p className="text-destructive">{t.micSilent}</p>}
        {heard && <p className="text-muted-foreground break-words">“{heard}”</p>}
        {reply && <p className="leading-relaxed break-words">{reply}</p>}
      </div>

      <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? t.unmute : t.mute}
            title={muted ? t.unmute : t.mute}
            className="grid place-items-center size-12 rounded-full border border-border hover:bg-muted transition-colors"
          >
            {muted ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => onEnd()}
            className="flex items-center gap-2 h-12 rounded-full bg-destructive px-5 text-sm font-medium text-white hover:bg-destructive/85 transition-colors"
          >
            <PhoneOff size={18} aria-hidden="true" />
            {t.endCall}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{t.callDisclaimer}</p>
      </div>
    </>
  );
}
