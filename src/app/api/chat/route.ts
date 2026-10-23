// CV chat endpoint (src/components/cv-chat.tsx). Runs on the server (a Netlify function in production),
// so GEMINI_API_KEY never reaches the browser. Streams the answer back as plain text.

import { buildCvPrompt } from "@/lib/cv-context";
import { chatModels, isChatModel } from "@/lib/chat-models";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

// Override with GEMINI_MODEL in the Netlify environment when Google releases a newer Flash model
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
// Used when MODEL is out of free quota or unavailable
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL || "gemini-3.8-flash";
const MAX_TURNS = 12;
const MAX_CHARS = 1000;

// Light per-IP guard against someone burning the free-tier quota. Kept in memory, so it resets
// whenever the function cold-starts; Google's own quota is the hard limit.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

function parseMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_TURNS) return null;
  const messages: ChatMessage[] = [];
  for (const m of value) {
    if (!m || (m.role !== "user" && m.role !== "model") || typeof m.text !== "string") return null;
    const text = m.text.trim();
    if (!text || text.length > MAX_CHARS * 4) return null;
    if (m.role === "user" && text.length > MAX_CHARS) return null;
    messages.push({ role: m.role, text });
  }
  return messages.at(-1)?.role === "user" ? messages : null;
}

export async function POST(request: Request) {
  let body: { messages?: unknown; locale?: unknown; model?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const messages = parseMessages(body.messages);
  if (!messages) return Response.json({ error: "invalid" }, { status: 400 });
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : defaultLocale;
  // The visitor's pick from the model menu, with the other menu model as backup; otherwise the env defaults
  const picked = isChatModel(body.model) ? body.model : null;
  const primary = picked ?? MODEL;
  const fallback = picked ? (chatModels.find((m) => m.id !== picked)?.id ?? FALLBACK_MODEL) : FALLBACK_MODEL;

  const ip = request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set");
    return Response.json({ error: "unavailable" }, { status: 500 });
  }

  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: buildCvPrompt(locale) }] },
    contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
  });
  const callGemini = (model: string) =>
    fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: payload,
    }).catch((error: unknown) => {
      console.error(`[chat] Gemini request failed (${model})`, error);
      return null;
    });

  let upstream = await callGemini(primary);
  // Quota used up, model retired or Google having a bad moment: try the fallback model once
  if (!upstream || upstream.status === 429 || upstream.status === 404 || upstream.status >= 500) {
    if (upstream) console.error(`[chat] ${primary} returned ${upstream.status}, trying ${fallback}`);
    upstream = await callGemini(fallback);
  }

  if (!upstream?.ok || !upstream.body) {
    if (upstream) console.error("[chat] Gemini error", upstream.status, await upstream.text());
    const status = upstream?.status === 429 ? 429 : 502;
    return Response.json({ error: status === 429 ? "rate_limited" : "unavailable" }, { status });
  }

  // Gemini sends Server-Sent Events ("data: {json}" lines); pass on just the text parts
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          try {
            const data = JSON.parse(line.slice(5));
            const parts: { text?: string; thought?: boolean }[] = data.candidates?.[0]?.content?.parts ?? [];
            const text = parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // Partial or non-JSON line: skip it
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
