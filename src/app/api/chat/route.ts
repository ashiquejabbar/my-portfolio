// CV chat endpoint (src/components/cv-chat.tsx). Runs on the server (a Netlify function in production),
// so GEMINI_API_KEY and GROQ_API_KEY never reach the browser. Streams the answer back as plain text.
// Voice calls (src/components/cv-call.tsx) try Groq first, which starts answering much sooner, then Gemini.

import { buildCvPrompt, voiceStyle } from "@/lib/cv-context";
import { backupModels, chatModels, isChatModel, thinkingLevel } from "@/lib/chat-models";
import { GROQ_URL, callModels } from "@/lib/groq";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { clientIp, rateLimited } from "@/lib/rate-limit";

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
const MAX_REQUESTS = 20;

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// One model to try: how to call it, and how to pull the answer text out of one of its SSE events
interface Attempt {
  name: string;
  call: (signal: AbortSignal) => Promise<Response>;
  text: (data: unknown) => string;
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
  let body: { messages?: unknown; locale?: unknown; model?: unknown; voice?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  const messages = parseMessages(body.messages);
  if (!messages) return Response.json({ error: "invalid" }, { status: 400 });
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : defaultLocale;
  const voice = body.voice === true;
  // The visitor's pick from the model menu (or the env default), then the backups, then the other menu model
  const picked = isChatModel(body.model) ? body.model : MODEL;
  const models = [
    ...new Set([picked, FALLBACK_MODEL, ...backupModels.map((m) => m.id), ...chatModels.map((m) => m.id)]),
  ].filter((m): m is string => !!m);

  // A call asks a question every few seconds, so it gets more room
  if (rateLimited(voice ? "call" : "chat", clientIp(request), voice ? MAX_REQUESTS * 2 : MAX_REQUESTS)) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  if (!apiKey && !(voice && groqKey)) {
    console.error("[chat] GEMINI_API_KEY is not set");
    return Response.json({ error: "unavailable" }, { status: 500 });
  }

  const prompt = buildCvPrompt(locale) + (voice ? voiceStyle : "");
  // Short spoken answers, plus room for the Groq models' brief reasoning
  const maxTokens = voice ? 500 : 800;

  const groq = ({ id, reasoning }: (typeof callModels)[number]): Attempt => ({
    name: id,
    call: (signal) =>
      fetch(`${GROQ_URL}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: id,
          reasoning_effort: reasoning,
          messages: [
            { role: "system", content: prompt },
            ...messages.map((m) => ({ role: m.role === "model" ? "assistant" : "user", content: m.text })),
          ],
          stream: true,
          temperature: 0.3,
          max_completion_tokens: maxTokens,
        }),
        signal,
      }),
    text: (data) => (data as { choices?: { delta?: { content?: string } }[] }).choices?.[0]?.delta?.content ?? "",
  });

  const gemini = (model: string): Attempt => ({
    name: model,
    call: (signal) =>
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey ?? "" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: prompt }] },
          contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: maxTokens,
            thinkingConfig: { thinkingLevel: thinkingLevel(model) },
          },
        }),
        signal,
      }),
    text: (data) => {
      const parts: { text?: string; thought?: boolean }[] =
        (data as { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[] }).candidates?.[0]?.content
          ?.parts ?? [];
      return parts.filter((p) => !p.thought).map((p) => p.text ?? "").join("");
    },
  });

  const attempts = [...(voice && groqKey ? callModels.map(groq) : []), ...(apiKey ? models.map(gemini) : [])];

  const tryModel = async (attempt: Attempt, timeoutMs: number) => {
    // Give up on a model that hasn't started answering in time (an overloaded one can take a minute);
    // the timer stops once the response arrives, so it never cuts off an answer that is streaming
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await attempt.call(controller.signal);
    } catch (error) {
      console.error(`[chat] request failed or timed out (${attempt.name})`, error);
      return null;
    } finally {
      clearTimeout(timer);
    }
  };
  // Daily quota used up, model retired or busy ("high demand" 503s are common): move on to the next model
  const retryable = (res: Response | null) => !res || res.status === 429 || res.status === 404 || res.status >= 500;

  const deadline = Date.now() + TOTAL_WAIT_MS;
  let upstream: Response | null = null;
  let used: Attempt | undefined;
  for (const attempt of attempts) {
    const left = deadline - Date.now();
    if (left < 500) break;
    used = attempt;
    upstream = await tryModel(attempt, Math.min(ATTEMPT_TIMEOUT_MS, left));
    if (!retryable(upstream)) break;
    if (upstream) console.error(`[chat] ${attempt.name} returned ${upstream.status}`);
  }

  if (!upstream?.ok || !upstream.body || !used) {
    if (upstream) console.error("[chat] model error", upstream.status, await upstream.text());
    const status = upstream?.status === 429 ? 429 : 502;
    return Response.json({ error: status === 429 ? "rate_limited" : "unavailable" }, { status });
  }

  // Both providers send Server-Sent Events ("data: {json}" lines); pass on just the answer text
  const extract = used.text;
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
            const text = extract(JSON.parse(line.slice(5)));
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // Partial or non-JSON line (Groq ends with "data: [DONE]"): skip it
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
