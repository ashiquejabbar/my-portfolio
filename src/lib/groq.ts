// Groq models behind the voice features: speech-to-text (src/app/api/transcribe/route.ts), the fast
// answers on a voice call (src/app/api/chat/route.ts) and the call's voice (src/app/api/speak/route.ts).
// Server only: GROQ_API_KEY never reaches the browser. Each can be overridden in the Netlify environment.

import type { Locale } from "@/lib/i18n/config";

export const GROQ_URL = "https://api.groq.com/openai/v1";

export const sttModel = process.env.GROQ_STT_MODEL || "whisper-large-v3-turbo";

// Tried in order on a voice call before falling back to Gemini. These are reasoning models: the
// reasoning streams separately (and is dropped), but it delays the answer, so it's kept to a minimum.
// Qwen with reasoning off answers in about 0.3 s.
const builtInCallModels = [
  { id: "qwen/qwen3.8-27b", reasoning: "none" },
  { id: "openai/gpt-oss-20b", reasoning: "low" },
  { id: "openai/gpt-oss-120b", reasoning: "low" },
];
export const callModels = process.env.GROQ_CHAT_MODEL
  ? [{ id: process.env.GROQ_CHAT_MODEL, reasoning: "low" }, ...builtInCallModels]
  : builtInCallModels;

// Orpheus voices (preview models, under 200 characters per request): young, warm female voices.
// English also has autumn and diana, Arabic lulwa and aisha. Other languages get the browser's
// built-in voice (src/lib/voice.ts).
export const ttsVoices: Partial<Record<Locale, { model: string; voice: string }>> = {
  en: { model: "canopylabs/orpheus-v1-english", voice: process.env.GROQ_VOICE_EN || "hannah" },
  ar: { model: "canopylabs/orpheus-arabic-saudi", voice: process.env.GROQ_VOICE_AR || "noura" },
};
export const TTS_MAX_CHARS = 200;
// Orpheus reads a bracketed direction as how to speak, not as words; a soft, smooth delivery.
// Set GROQ_VOICE_STYLE to e.g. "[calm]" or "[warm]" to change it, or to "none" to turn it off.
export const ttsStyle = process.env.GROQ_VOICE_STYLE === "none" ? "" : process.env.GROQ_VOICE_STYLE || "[softly]";
