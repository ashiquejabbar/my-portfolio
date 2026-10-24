// CV chat endpoint (src/components/cv-chat.tsx). Runs on the server (a Netlify function in production),
// so GEMINI_API_KEY never reaches the browser. Streams the answer back as plain text.

import { buildCvPrompt } from "@/lib/cv-context";
import { backupModels, chatModels, isChatModel, thinkingLevel } from "@/lib/chat-models";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

// Override with GEMINI_MODEL in the Netlify environment when Google releases a newer Flash model
const MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
// Optional extra backup, tried before the built-in ones
const FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL;
const MAX_TURNS = 12;
const MAX_CHARS = 1000;
// How long one model may take to start answering, and the total wait before giving up, so the
// visitor isn't left hanging and the Netlify function doesn't time out
const ATTEMPT_TIMEOUT_MS = 6000;
const TOTAL_WAIT_MS = 9000;

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
  // The visitor's pick from the model menu (or the env default), then the backups, then the other menu model
  const picked = isChatModel(body.model) ? body.model : MODEL;
  const models = [
    ...new Set([picked, FALLBACK_MODEL, ...backupModels.map((m) => m.id), ...chatModels.map((m) => m.id)]),
  ].filter((m): m is string => !!m);

  const ip = request.headers.get("x-nf-client-connection-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set");
    return Response.json({ error: "unavailable" }, { status: 500 });
  }

  const systemInstruction = { parts: [{ text: buildCvPrompt(locale) }] };
  const contents = messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
  const callGemini = async (model: string, timeoutMs: number) => {
    // Give up on a model that hasn't started answering in time (an overloaded one can take a minute);
    // the timer stops once the response arrives, so it never cuts off an answer that is streaming
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction,
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
            thinkingConfig: { thinkingLevel: thinkingLevel(model) },
          },
        }),
        signal: controller.signal,
      });
    } catch (error) {
      console.error(`[chat] Gemini request failed or timed out (${model})`, error);
      return null;
    } finally {
      clearTimeout(timer);
    }
  };
  // Daily quota used up, model retired or busy ("high demand" 503s are common): move on to the next model
  const retryable = (res: Response | null) => !res || res.status === 429 || res.status === 404 || res.status >= 500;

  const deadline = Date.now() + TOTAL_WAIT_MS;
  let upstream: Response | null = null;
  for (const model of models) {
    const left = deadline - Date.now();
    if (left < 500) break;
    upstream = await callGemini(model, Math.min(ATTEMPT_TIMEOUT_MS, left));
    if (!retryable(upstream)) break;
    if (upstream) console.error(`[chat] ${model} returned ${upstream.status}`);
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
