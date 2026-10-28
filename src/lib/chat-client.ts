// Browser side of the CV chat, shared by the text chat (src/components/cv-chat.tsx) and the voice
// call (src/components/cv-call.tsx).

import { sendGAEvent } from "@next/third-parties/google";
import type { Locale } from "@/lib/i18n/config";
import type { ChatModelId } from "@/lib/chat-models";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// Same limits as src/app/api/chat/route.ts
export const MAX_TURNS = 12;
export const MAX_CHARS = 1000;

// Google Analytics events (GA loads in src/app/[lang]/layout.tsx). Only counts, never the chat text or audio.
export function track(name: string, params: Record<string, string | number> = {}) {
  try {
    sendGAEvent("event", name, params);
  } catch {
    // GA blocked or not loaded: nothing to do
  }
}

// Thrown when /api/chat answers with an error status
export class ChatError extends Error {
  constructor(public status: number) {
    super(`chat ${status}`);
  }
}

// Asks /api/chat and hands each piece of the answer to onText as it streams in; resolves with the whole answer
export async function streamAnswer(
  history: ChatMessage[],
  options: { locale: Locale; model: ChatModelId; voice?: boolean; signal?: AbortSignal },
  onText: (answer: string, chunk: string) => void,
): Promise<string> {
  const { locale, model, voice, signal } = options;
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Older turns drop off: an odd count keeps the history starting with a question
    body: JSON.stringify({ messages: history.slice(-(MAX_TURNS - 1)), locale, model, voice }),
    signal,
  });
  if (!res.ok || !res.body) throw new ChatError(res.status);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let answer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    answer += chunk;
    onText(answer, chunk);
  }
  return answer;
}
