"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
// Read inside the call loop (an effect), never while rendering
const now = () => Date.now();
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  const outerRingRef = useRef<HTMLSpanElement>(null);
  const recordingRef = useRef<Recording | null>(null);
  const tappedRef = useRef("");

  // Asks an example question without speaking it (noisy room, or just quicker)
  const askTapped = (question: string) => {
    if (status !== "listening") return;
    track("call_suggestion");
    tappedRef.current = question;
    recordingRef.current?.cancel();
  };
  const streamRef = useRef<MediaStream | null>(null);
  const speakerRef = useRef<ReturnType<typeof createSpeaker> | null>(null);

  // The listening ring follows the visitor's voice; set directly so it doesn't re-render 20 times a second
  const showLevel = (level: number) => {
    if (!reducedMotion()) {
      if (ringRef.current) ringRef.current.style.transform = `scale(${1 + level * 0.35})`;
      if (outerRingRef.current) outerRingRef.current.style.transform = `scale(${1 + level * 0.6})`;
    }
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

    const startedAt = now();
    let messages = history;
    let turns = 0;
    track("call_start", { locale });
    try {
      // Callers can take the voice for Ashique himself, so the call opens by saying it's his AI assistant
      const intro = sentenceSplitter(speaker.say);
      intro.push(t.callGreeting);
      intro.flush();
      await speaker.idle();

      while (!signal.aborted) {
        setStatus("listening");
        recording = recordUtterance(stream, { onLevel: showLevel, onDeadMic });
        recordingRef.current = recording;
        const audio = await recording.done;
        recordingRef.current = null;
        // A tapped example question cancels the recording and is asked instead
        const tapped = tappedRef.current;
        tappedRef.current = "";
        if ((!audio && !tapped) || signal.aborted) continue;

        setStatus("thinking");
        const question = (tapped || (audio ? await transcribe(audio, locale) : "")).slice(0, MAX_CHARS);
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
      track("call_end", { seconds: Math.round((now() - startedAt) / 1000), turns });
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
      {/* Like a phone call's top bar: who you're talking to, and how long the call has run */}
      <div className="flex items-center justify-between gap-3 px-4 pt-3 text-xs text-muted-foreground">
        <p className="inline-flex min-w-0 items-center gap-1.5">
          <Bot size={13} className="shrink-0" aria-hidden="true" />
          <span className="truncate">{t.callWho}</span>
        </p>
        <p className="inline-flex shrink-0 items-center gap-1.5 tabular-nums" dir="ltr">
          <span className="size-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" aria-hidden="true" />
          {clock(seconds)}
        </p>
      </div>

      <div className="chat-scroll flex flex-1 flex-col items-center justify-center gap-3 overflow-y-auto px-6 pt-2 pb-5 text-center text-sm">
        <button
          type="button"
          // Tap while it talks to cut the answer short and ask the next question
          onClick={() => speakerRef.current?.stop()}
          disabled={status !== "speaking"}
          aria-label={status === "speaking" ? t.speaking : label}
          className="relative mt-3 grid place-items-center size-24 shrink-0 rounded-full"
        >
          {/* Listening: two rings swell with the caller's voice (set in showLevel) */}
          <span ref={outerRingRef} aria-hidden="true" className="absolute -inset-2 rounded-full bg-primary/10 transition-transform duration-150" />
          <span ref={ringRef} aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/20 transition-transform duration-100" />
          {/* Speaking: soft waves ripple out from the avatar */}
          {status === "speaking" &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="absolute inset-2 rounded-full border-2 border-primary/60"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
              />
            ))}
          <span
            className={cn(
              "relative grid place-items-center size-20 rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-raised)] transition-opacity",
              (status === "thinking" || status === "connecting") && "opacity-70 motion-safe:animate-pulse",
            )}
            aria-hidden="true"
          >
            <Bot size={32} />
          </span>
        </button>

        <div className="mt-1">
          <div className="relative h-6" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="font-medium"
              >
                {label}
              </motion.p>
            </AnimatePresence>
          </div>
          {/* One message per line: the status above, what you can do right now below */}
          <p className="h-4 text-xs text-muted-foreground">{status === "speaking" ? t.interruptHint : ""}</p>
        </div>

        {deadMic && status === "listening" && (
          <p role="alert" className="text-destructive">
            {t.micSilent}
          </p>
        )}
        {/* Before the first question, once it's listening: what to ask. Tap one to ask it without speaking */}
        {!heard && !deadMic && status === "listening" && (
          <div className="text-muted-foreground">
            <p className="text-xs">{t.tryAsking}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {t.suggestions.slice(0, 2).map((s, i) => (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => askTapped(s)}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-muted hover:border-ring/50 active:scale-[0.97] transition-[background-color,border-color,scale]"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        )}
        {/* The latest question and answer; a long answer scrolls on its own so the avatar stays in view */}
        {heard && <p className="line-clamp-2 text-muted-foreground break-words">“{heard}”</p>}
        {reply && <p className="chat-scroll max-h-28 overflow-y-auto px-1 leading-relaxed break-words">{reply}</p>}
      </div>

      <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={muted}
            aria-label={muted ? t.unmute : t.mute}
            title={muted ? t.unmute : t.mute}
            className={cn(
              "grid place-items-center size-12 rounded-full border border-border hover:bg-muted active:scale-95 transition-[background-color,scale]",
              muted && "border-transparent bg-foreground text-background hover:bg-foreground/85",
            )}
          >
            {muted ? <MicOff size={18} aria-hidden="true" /> : <Mic size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => onEnd()}
            className="flex items-center gap-2 h-12 rounded-full bg-destructive px-5 text-sm font-medium text-white hover:bg-destructive/85 active:scale-95 transition-[background-color,scale]"
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
