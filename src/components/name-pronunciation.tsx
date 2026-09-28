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
  lang: string;
  // Tried when the device has no voice for `lang` (e.g. Hindi voices read English with an Indian accent)
  fallbackLang?: string;
  // Spelled the way it sounds, so voices don't read "Ashique" as "a-shee-kway"
  text: string;
  // Matched against the device's voice names to pick a male or female voice
  nameHint?: RegExp;
  // Used when the device has no voice for this preset, so each option still sounds different
  pitch: number;
  rate: number;
  look: Look;
};

const ENGLISH_TEXT = "Aashiq, P. J.";
const FEMALE = /female|zira|heera|neerja|swara|libby|sonia|hazel|susan|serena|kate|natasha|karen|catherine|jenny|aria/i;
const MALE = /\bmale|david|mark|guy|andrew|ravi|prabhat|ryan|george|daniel|arthur|thomas|william|hamed|maged|naayf|shakir/i;

const PRESETS: VoicePreset[] = [
  {
    id: "en-IN", label: "Indian English", detail: "Female · India", region: "IN",
    lang: "en-IN", fallbackLang: "hi-IN", text: ENGLISH_TEXT, nameHint: FEMALE, pitch: 1.1, rate: 0.85,
    look: { bg: "#FFE4D1", shirt: "#E0572B", skin: "#C68B59", hair: "#1F1A17", longHair: true },
  },
  {
    id: "en-GB-f", label: "British English", detail: "Female · United Kingdom", region: "GB",
    lang: "en-GB", text: ENGLISH_TEXT, nameHint: FEMALE, pitch: 1.15, rate: 0.85,
    look: { bg: "#E4E9FF", shirt: "#4A63E8", skin: "#F1C9A5", hair: "#A0521D", longHair: true },
  },
  {
    id: "en-GB-m", label: "British English", detail: "Male · United Kingdom", region: "GB",
    lang: "en-GB", text: ENGLISH_TEXT, nameHint: MALE, pitch: 0.85, rate: 0.85,
    look: { bg: "#DCEFF7", shirt: "#1E6F8C", skin: "#E8B48F", hair: "#6B4A2B" },
  },
  {
    id: "en-US", label: "American English", detail: "Male · United States", region: "US",
    lang: "en-US", text: ENGLISH_TEXT, nameHint: MALE, pitch: 0.9, rate: 0.85,
    look: { bg: "#E3F2E1", shirt: "#3C8D4F", skin: "#8D5A3B", hair: "#1B1B1B" },
  },
  {
    id: "en-AU", label: "Australian English", detail: "Female · Australia", region: "AU",
    lang: "en-AU", text: ENGLISH_TEXT, nameHint: FEMALE, pitch: 1.1, rate: 0.85,
    look: { bg: "#FFF1C9", shirt: "#D08A12", skin: "#F3D0B0", hair: "#D9A93F", longHair: true },
  },
  {
    id: "ar", label: "Arabic", detail: "Male · Arabic (عاشِق)", region: "AE",
    lang: "ar", text: "عاشِق، بي جي", nameHint: MALE, pitch: 0.9, rate: 0.8,
    look: { bg: "#F2E6DA", shirt: "#8A5A1F", skin: "#B97A50", hair: "#2A211C", beard: true },
  },
];

const STORAGE_KEY = "name-voice";

const noopSubscribe = () => () => {};
const hasSpeech = () => "speechSynthesis" in window;
const serverHasSpeech = () => false;

// Voices load lazily (Chrome fills the list after page load), so re-render when it changes
function subscribeVoices(onChange: () => void) {
  if (!("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", onChange);
}
const getVoiceCount = () => ("speechSynthesis" in window ? window.speechSynthesis.getVoices().length : 0);
const getServerVoiceCount = () => 0;

function findVoice(preset: VoicePreset) {
  const voices = window.speechSynthesis.getVoices();
  const byLang = (lang: string) => voices.filter((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
  let langMatches = byLang(preset.lang);
  if (!langMatches.length && preset.fallbackLang) langMatches = byLang(preset.fallbackLang);
  if (preset.nameHint) {
    const hinted = langMatches.find((v) => preset.nameHint!.test(v.name));
    if (hinted) return hinted;
  }
  return langMatches[0];
}

function readSavedPreset() {
  if (typeof window === "undefined") return PRESETS[0].id;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return PRESETS.some((p) => p.id === saved) ? saved! : PRESETS[0].id;
  } catch {
    return PRESETS[0].id; // Storage blocked (private mode); fall back to the default voice
  }
}

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
  // Only render where the browser can speak; the server renders nothing, so there's no hydration mismatch
  const supported = useSyncExternalStore(noopSubscribe, hasSpeech, serverHasSpeech);
  const voiceCount = useSyncExternalStore(subscribeVoices, getVoiceCount, getServerVoiceCount);
  // Safe to read storage here: nothing depending on it renders until `supported` is true on the client
  const [presetId, setPresetId] = useState(readSavedPreset);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Close the menu on an outside click or Escape
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
    menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!supported) return null;

  const speak = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id) ?? PRESETS[0];
    const synth = window.speechSynthesis;
    synth.cancel();

    const voice = findVoice(preset);
    // Without an Arabic voice, Arabic script can come out silent or garbled, so say the English spelling
    const text = voice || preset.lang.startsWith("en") ? preset.text : ENGLISH_TEXT;
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang ?? (text === preset.text ? preset.lang : "en-US");
    // A real matching voice sounds best untouched; pitch only separates the fallbacks
    utterance.pitch = voice ? 1 : preset.pitch;
    utterance.rate = preset.rate;
    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId((current) => (current === id ? null : current));
    utterance.onerror = () => setSpeakingId((current) => (current === id ? null : current));

    synth.speak(utterance);
  };

  const choose = (id: string) => {
    setPresetId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Not remembered this visit; the choice still plays
    }
    speak(id);
  };

  // Arrow keys move between voices while the menu is open
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next = e.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const current = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
  const voicesLoaded = voiceCount > 0;

  return (
    // Not `relative`: the menu anchors to the whole name row (hero.tsx) so it has room on phones
    <div ref={wrapperRef} className="inline-flex items-center">
      <button
        type="button"
        onClick={() => speak(presetId)}
        aria-label={`Hear how to pronounce ${name} (${current.label}, ${current.detail} voice)`}
        title="Hear how to pronounce my name"
        className={`grid place-items-center size-7 rounded-md transition-colors hover:bg-muted ${
          speakingId ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Volume2 size={16} aria-hidden="true" className={speakingId ? "animate-pulse" : undefined} />
      </button>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Choose a voice"
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid place-items-center h-7 w-5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
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
            <ul ref={menuRef} role="menu" aria-labelledby={titleId} onKeyDown={onMenuKeyDown} className="space-y-0.5">
              {PRESETS.map((preset) => {
                const selected = preset.id === presetId;
                const speaking = preset.id === speakingId;
                // Only judge availability once the device has reported its voices
                const available = !voicesLoaded || Boolean(findVoice(preset));
                return (
                  <li key={preset.id} role="none">
                    <button
                      type="button"
                      role="menuitemradio"
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
                          {available ? preset.detail : "Similar voice on this device"}
                        </span>
                      </span>
                      <span className="grid w-4 shrink-0 place-items-center">
                        {speaking ? (
                          <SpeakingBars />
                        ) : (
                          selected && <Check size={15} className="text-primary" aria-hidden="true" />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
