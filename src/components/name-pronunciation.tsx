"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Volume2 } from "lucide-react";

type Look = {
  bg: string;
  shirt: string;
  skin: string;
  hair: string;
  longHair?: boolean;
  beard?: boolean;
};

type VoicePreset = {
  id: string;
  label: string;
  // Shown under the label: who the voice sounds like
  detail: string;
  region: string;
  // Languages that give this preset its real accent (e.g. Hindi voices speak with an Indian accent)
  langs: string[];
  // Closest accents to try when the device has none of `langs`
  similarLangs: string[];
  // Matched against the device's voice names to pick a male or female voice
  nameHint: RegExp;
  // Used only when the device has no voice to give, so each option still sounds different
  pitch: number;
  look: Look;
};

type Resolved = { voice?: SpeechSynthesisVoice; exact: boolean };

// Spelled the way it sounds, in the script each voice reads best
const NAME_TEXT = { en: "Aashiq, P. J.", hi: "आशिक़, पी. जे.", ar: "عاشِق، بي جي" };
const RATE = 0.85;
// Pre-made recording for browsers that can't speak (e.g. in-app browsers in LinkedIn or WhatsApp)
const FALLBACK_AUDIO = "/name-pronunciation.wav";
const FALLBACK_ID = "fallback";

const FEMALE = /female|zira|heera|neerja|swara|kalpana|libby|sonia|hazel|susan|serena|kate|natasha|karen|catherine|jenny|aria|samantha|fiona|moira|tessa|veena|lekha|zariyah|salma|hoda/i;
const MALE = /\bmale|david|mark|guy|andrew|ravi|prabhat|hemant|ryan|george|daniel|arthur|thomas|william|alex|fred|rishi|hamed|maged|naayf|shakir|hamdan|tarik/i;

const PRESETS: VoicePreset[] = [
  {
    id: "en-IN", label: "Indian English", detail: "Female · India", region: "IN",
    langs: ["en-IN", "hi-IN"], similarLangs: ["en"], nameHint: FEMALE, pitch: 1.1,
    look: { bg: "#FFE4D1", shirt: "#E0572B", skin: "#C68B59", hair: "#1F1A17", longHair: true },
  },
  {
    id: "en-GB-f", label: "British English", detail: "Female · United Kingdom", region: "GB",
    langs: ["en-GB"], similarLangs: ["en-IE", "en-AU", "en"], nameHint: FEMALE, pitch: 1.15,
    look: { bg: "#E4E9FF", shirt: "#4A63E8", skin: "#F1C9A5", hair: "#A0521D", longHair: true },
  },
  {
    id: "en-GB-m", label: "British English", detail: "Male · United Kingdom", region: "GB",
    langs: ["en-GB"], similarLangs: ["en-IE", "en-AU", "en"], nameHint: MALE, pitch: 0.85,
    look: { bg: "#DCEFF7", shirt: "#1E6F8C", skin: "#E8B48F", hair: "#6B4A2B" },
  },
  {
    id: "en-US", label: "American English", detail: "Male · United States", region: "US",
    langs: ["en-US"], similarLangs: ["en-CA", "en"], nameHint: MALE, pitch: 0.9,
    look: { bg: "#E3F2E1", shirt: "#3C8D4F", skin: "#8D5A3B", hair: "#1B1B1B" },
  },
  {
    id: "en-AU", label: "Australian English", detail: "Female · Australia", region: "AU",
    langs: ["en-AU"], similarLangs: ["en-NZ", "en-GB", "en"], nameHint: FEMALE, pitch: 1.1,
    look: { bg: "#FFF1C9", shirt: "#D08A12", skin: "#F3D0B0", hair: "#D9A93F", longHair: true },
  },
  {
    id: "ar", label: "Arabic", detail: "Male · Arabic (عاشِق)", region: "AE",
    langs: ["ar"], similarLangs: ["en"], nameHint: MALE, pitch: 0.9,
    look: { bg: "#F2E6DA", shirt: "#8A5A1F", skin: "#B97A50", hair: "#2A211C", beard: true },
  },
];

const STORAGE_KEY = "name-voice";
const PRESET_CHANGE_EVENT = "name-voice-change";

const noopSubscribe = () => () => {};
const hasSpeech = () => "speechSynthesis" in window;
const serverFalse = () => false;

// Voices load lazily (Chrome fills the list after page load), so re-render when it changes
function subscribeVoices(onChange: () => void) {
  if (!("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", onChange);
}
const getVoiceCount = () => ("speechSynthesis" in window ? window.speechSynthesis.getVoices().length : 0);
const getServerVoiceCount = () => 0;

// The chosen voice lives in localStorage; reading it through a store keeps server and first client render identical
function subscribePreset(onChange: () => void) {
  window.addEventListener(PRESET_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(PRESET_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
function getSavedPreset() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return PRESETS.some((p) => p.id === saved) ? saved! : PRESETS[0].id;
  } catch {
    return PRESETS[0].id; // Storage blocked (private mode); fall back to the default voice
  }
}
const getServerPreset = () => PRESETS[0].id;
function savePreset(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Not remembered; the choice still applies until the page reloads
  }
  window.dispatchEvent(new Event(PRESET_CHANGE_EVENT));
}

const matchesLang = (voice: SpeechSynthesisVoice, lang: string) =>
  voice.lang.replace("_", "-").toLowerCase().startsWith(lang.toLowerCase());

// Give every preset its own device voice: real accents first, then the closest distinct stand-in,
// so two options never quietly share the same voice while the device has enough to go round
function resolveVoices(): Record<string, Resolved> {
  const voices = window.speechSynthesis.getVoices();
  const used = new Set<string>();
  const result: Record<string, Resolved> = {};

  const pick = (preset: VoicePreset, langs: string[], useHint: boolean) =>
    voices.find(
      (v) => !used.has(v.voiceURI) && langs.some((l) => matchesLang(v, l)) && (!useHint || preset.nameHint.test(v.name))
    );

  const passes: [keyof Pick<VoicePreset, "langs" | "similarLangs">, boolean, boolean][] = [
    ["langs", true, true],
    ["langs", false, true],
    ["similarLangs", true, false],
    ["similarLangs", false, false],
  ];
  for (const [field, useHint, exact] of passes) {
    for (const preset of PRESETS) {
      if (result[preset.id]) continue;
      const voice = pick(preset, preset[field], useHint);
      if (voice) {
        used.add(voice.voiceURI);
        result[preset.id] = { voice, exact };
      }
    }
  }
  for (const preset of PRESETS) result[preset.id] ??= { exact: false };
  return result;
}

const textFor = (voice?: SpeechSynthesisVoice) => {
  if (voice && matchesLang(voice, "ar")) return NAME_TEXT.ar;
  if (voice && matchesLang(voice, "hi")) return NAME_TEXT.hi;
  return NAME_TEXT.en;
};

function VoiceAvatar({ look, region }: { look: Look; region: string }) {
  const clipId = useId();
  return (
    <span className="relative shrink-0">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true" className="block rounded-full">
        <clipPath id={clipId}>
          <circle cx="20" cy="20" r="20" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="40" height="40" fill={look.bg} />
          {look.longHair && <path d="M11.5 19c0-6 3.8-10 8.5-10s8.5 4 8.5 10v11h-17z" fill={look.hair} />}
          <path d="M7 40c0-7.5 5.8-11.5 13-11.5S33 32.5 33 40z" fill={look.shirt} />
          <rect x="17.5" y="22" width="5" height="8" rx="2" fill={look.skin} />
          <circle cx="20" cy="18" r="6.5" fill={look.skin} />
          <path d="M13.4 17.6c0-4.6 2.9-7.8 6.6-7.8s6.6 3.2 6.6 7.8c-1.6-2.3-3.8-3.4-6.6-3.4s-5 1.1-6.6 3.4z" fill={look.hair} />
          {look.beard && <path d="M14.2 19.5c.8 4.2 3 6.6 5.8 6.6s5-2.4 5.8-6.6c-1.5 1.6-3.4 2.3-5.8 2.3s-4.3-.7-5.8-2.3z" fill={look.hair} />}
        </g>
      </svg>
      <span className="absolute -bottom-1 -right-1.5 rounded-[4px] border border-border bg-card px-[3px] text-[9px] font-semibold leading-[13px] text-muted-foreground">
        {region}
      </span>
    </span>
  );
}

// Three bouncing bars for the voice that's speaking (animation in globals.css, off for reduced motion)
function SpeakingBars() {
  return (
    <span className="flex h-3.5 items-end gap-[2px] text-primary" aria-hidden="true">
      {[0, 150, 300].map((delay) => (
        <span key={delay} className="eq-bar h-full w-[3px] rounded-full bg-current" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  );
}

export default function NamePronunciation({ name }: { name: string }) {
  const speechSupported = useSyncExternalStore(noopSubscribe, hasSpeech, serverFalse);
  const voiceCount = useSyncExternalStore(subscribeVoices, getVoiceCount, getServerVoiceCount);
  const presetId = useSyncExternalStore(subscribePreset, getSavedPreset, getServerPreset);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speakSafetyRef = useRef<number | null>(null);
  // Chrome can garbage-collect an utterance mid-speech (so it stops and never fires onend); holding it prevents that
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const titleId = useId();

  // The voice menu only makes sense where the device actually has voices to offer
  const canSpeak = speechSupported && voiceCount > 0;

  // Close on an outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    listRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (speakSafetyRef.current) window.clearTimeout(speakSafetyRef.current);
      audioRef.current?.pause();
    };
  }, []);

  const clearSpeaking = (id: string) => setSpeakingId((current) => (current === id ? null : current));

  const playFallback = () => {
    activeUtteranceRef.current = null; // Stops any pending speech retry from talking over the recording
    if (canSpeak) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    const audio = new Audio(FALLBACK_AUDIO);
    audioRef.current = audio;
    audio.onplay = () => setSpeakingId(FALLBACK_ID);
    audio.onended = () => clearSpeaking(FALLBACK_ID);
    audio.onpause = () => clearSpeaking(FALLBACK_ID);
    audio.onerror = () => clearSpeaking(FALLBACK_ID);
    audio.play().catch(() => clearSpeaking(FALLBACK_ID));
  };

  const buildUtterance = (preset: VoicePreset, allowNetworkVoice: boolean) => {
    let { voice } = resolveVoices()[preset.id];
    // Online voices (e.g. Chrome's "Google …") fail without a connection; the retry uses an on-device voice
    if (voice && !allowNetworkVoice && !voice.localService) {
      const lang = voice.lang;
      voice = window.speechSynthesis.getVoices().find((v) => v.localService && v.lang === lang);
    }
    const utterance = new SpeechSynthesisUtterance(textFor(voice));
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? "en-US";
    // A real voice sounds best untouched; pitch only separates options when the device has no voice to give
    utterance.pitch = voice ? 1 : preset.pitch;
    utterance.rate = RATE;
    return { utterance, voice };
  };

  const speakPreset = (id: string, allowNetworkVoice = true) => {
    if (!canSpeak) return playFallback();

    const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0];
    const synth = window.speechSynthesis;
    audioRef.current?.pause();

    const { utterance, voice } = buildUtterance(preset, allowNetworkVoice);
    let started = false;
    let failed = false;
    utterance.onstart = () => {
      started = true;
      setSpeakingId(id);
    };
    utterance.onend = () => clearSpeaking(id);
    utterance.onerror = (e) => {
      clearSpeaking(id);
      if (e.error === "interrupted" || e.error === "canceled") return;
      failed = true; // Handled below; the "dropped speak" retry mustn't replay it
      if (allowNetworkVoice && voice && !voice.localService) speakPreset(id, false);
      else playFallback(); // The device couldn't speak at all; the recording still works
    };
    activeUtteranceRef.current = utterance;

    // Speak synchronously inside the tap: iPhones block speech that starts after a delay
    synth.cancel();
    synth.resume(); // Chrome can get stuck "paused" after a while; resuming wakes it
    synth.speak(utterance);

    // Chrome sometimes drops a speak() right after cancel(); if nothing started, try once more
    window.setTimeout(() => {
      const dropped = !started && !failed && !synth.speaking && !synth.pending;
      if (activeUtteranceRef.current === utterance && dropped) synth.speak(utterance);
    }, 250);

    // Some browsers never fire onend; don't leave the bars bouncing forever
    if (speakSafetyRef.current) window.clearTimeout(speakSafetyRef.current);
    speakSafetyRef.current = window.setTimeout(() => {
      if (activeUtteranceRef.current === utterance) clearSpeaking(id);
    }, 8000);
  };

  const choose = (id: string) => {
    savePreset(id);
    speakPreset(id);
  };

  // Arrow keys move between voices
  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const resolved = canSpeak ? resolveVoices() : null;
  const current = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  return (
    // Not `relative`: the popover anchors to the whole name row (hero.tsx) so it has room on phones
    <div ref={wrapperRef} className="inline-flex items-center">
      <button
        type="button"
        onClick={() => speakPreset(presetId)}
        aria-label={
          canSpeak ? `Hear how to pronounce ${name} (${current.label}, ${current.detail} voice)` : `Hear how to pronounce ${name}`
        }
        title="Hear how to pronounce my name"
        className={`grid place-items-center size-8 rounded-md transition-colors hover:bg-muted ${
          speakingId ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Volume2 size={17} aria-hidden="true" className={speakingId ? "animate-pulse" : undefined} />
      </button>

      {canSpeak && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Choose a voice"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="grid place-items-center h-8 w-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronDown size={15} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}

      <AnimatePresence>
        {open && canSpeak && (
          <motion.div
            role="dialog"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 sm:left-[4.5rem] top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] origin-top-left rounded-xl border border-border bg-popover p-1.5 font-normal text-popover-foreground shadow-[var(--shadow-raised)]"
          >
            <div className="px-2.5 pt-1.5 pb-2">
              <p id={titleId} className="text-sm font-semibold">
                Hear my name
              </p>
              <p className="text-xs text-muted-foreground">Pick a voice. Your choice is remembered.</p>
            </div>

            <div ref={listRef} role="radiogroup" aria-labelledby={titleId} onKeyDown={onListKeyDown} className="space-y-0.5">
              {PRESETS.map((preset) => {
                const selected = preset.id === presetId;
                const exact = !resolved || resolved[preset.id].exact;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => choose(preset.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none ${
                      selected ? "bg-muted/60" : ""
                    }`}
                  >
                    <VoiceAvatar look={preset.look} region={preset.region} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-tight">{preset.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {exact ? preset.detail : "Similar voice on this device"}
                      </span>
                    </span>
                    <span className="grid w-4 shrink-0 place-items-center">
                      {speakingId === preset.id ? (
                        <SpeakingBars />
                      ) : (
                        selected && <Check size={15} className="text-primary" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
