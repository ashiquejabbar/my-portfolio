// Models visitors can pick in the CV chat (src/components/cv-chat.tsx). The server only accepts
// these ids (src/app/api/chat/route.ts) and falls back to the other one if the pick fails.
export const chatModels = [
  { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash" },
  { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash" },
] as const;

export type ChatModelId = (typeof chatModels)[number]["id"];

export const isChatModel = (value: unknown): value is ChatModelId =>
  chatModels.some((m) => m.id === value);
