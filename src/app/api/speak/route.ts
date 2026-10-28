// The voice call's spoken answers (src/lib/voice.ts), one sentence per request. Answers with WAV audio
// from Groq, or 204 when there is no Groq voice for the language or Groq fails: the browser then
// reads the sentence with its built-in voice, so the call carries on either way.

import { GROQ_URL, TTS_MAX_CHARS, ttsVoices } from "@/lib/groq";
import { isLocale } from "@/lib/i18n/config";
import { clientIp, rateLimited } from "@/lib/rate-limit";

// A call speaks several sentences per answer
const MAX_REQUESTS = 150;
const TIMEOUT_MS = 6000;

export async function POST(request: Request) {
  let body: { text?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text || text.length > TTS_MAX_CHARS || typeof body.locale !== "string" || !isLocale(body.locale)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  const voice = ttsVoices[body.locale];
  const apiKey = process.env.GROQ_API_KEY;
  if (!voice || !apiKey) return new Response(null, { status: 204 });
  if (rateLimited("speak", clientIp(request), MAX_REQUESTS)) return new Response(null, { status: 204 });

  try {
    const res = await fetch(`${GROQ_URL}/audio/speech`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...voice, input: text, response_format: "wav" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok || !res.body) {
      console.error("[speak] Groq error", res.status, await res.text());
      return new Response(null, { status: 204 });
    }
    return new Response(res.body, { headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[speak] Groq request failed or timed out", error);
    return new Response(null, { status: 204 });
  }
}
