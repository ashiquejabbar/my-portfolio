// Speech-to-text for the CV chat's mic button and voice call (src/lib/voice.ts). Runs on the server,
// so GROQ_API_KEY never reaches the browser. Takes one recorded question, returns { text }.

import { GROQ_URL, sttModel } from "@/lib/groq";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { personalInfo } from "@/lib/data";
import { clientIp, rateLimited } from "@/lib/rate-limit";

// About 30 seconds of compressed speech; recordings stop well before that
const MAX_BYTES = 1024 * 1024;
const MAX_REQUESTS = 40;
const TIMEOUT_MS = 8000;
const extensions: Record<string, string> = { "audio/webm": "webm", "audio/mp4": "mp4", "audio/ogg": "ogg", "audio/wav": "wav" };

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const audio = form.get("audio");
  const type = audio instanceof Blob ? audio.type.split(";")[0] : "";
  if (!(audio instanceof Blob) || !extensions[type] || audio.size === 0 || audio.size > MAX_BYTES) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const lang = form.get("locale");
  const locale = typeof lang === "string" && isLocale(lang) ? lang : defaultLocale;

  if (rateLimited("transcribe", clientIp(request), MAX_REQUESTS)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("[transcribe] GROQ_API_KEY is not set");
    return Response.json({ error: "unavailable" }, { status: 500 });
  }

  const upstream = new FormData();
  upstream.append("file", audio, `speech.${extensions[type]}`);
  upstream.append("model", sttModel);
  upstream.append("language", locale);
  upstream.append("temperature", "0");
  upstream.append("response_format", "json");
  // Spelling hint, so the name comes out right
  upstream.append("prompt", `A recruiter asks about ${personalInfo.name}'s CV.`);

  try {
    const res = await fetch(`${GROQ_URL}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstream,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("[transcribe] Groq error", res.status, await res.text());
      const status = res.status === 429 ? 429 : 502;
      return Response.json({ error: status === 429 ? "rate_limited" : "unavailable" }, { status });
    }
    const data: { text?: string } = await res.json();
    return Response.json({ text: (data.text ?? "").trim() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[transcribe] Groq request failed or timed out", error);
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
