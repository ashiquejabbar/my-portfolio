// Models visitors can pick in the CV chat (src/components/cv-chat.tsx). The server only accepts
// these ids (src/app/api/chat/route.ts) and falls back to the backups below if the pick fails.
// thinking: the lowest thinking level the model accepts. Thinking tokens count against
// maxOutputTokens, so with more thinking the answer gets cut off or comes back empty.
export const chatModels = [
  { id: "gemini-3.6-flash", label: "Gemini 3.6 Flash", thinking: "minimal" },
  { id: "gemini-3.5-flash-lite", label: "Gemini 3.5 Flash Lite", thinking: "minimal" },
] as const;

// Tried after the visitor's pick when it is out of quota or busy. Each model has its own free daily
// quota (only 20 requests on the Flash models), and these Lite ones answer in 1-2 seconds
export const backupModels = [
  { id: "gemini-3.5-flash-lite", thinking: "minimal" },
  { id: "gemini-3.1-flash-lite", thinking: "minimal" },
  { id: "gemini-flash-lite-latest", thinking: "minimal" },
] as const;

export const thinkingLevel = (model: string) =>
  [...chatModels, ...backupModels].find((m) => m.id === model)?.thinking ?? "low";

export type ChatModelId = (typeof chatModels)[number]["id"];

export const isChatModel = (value: unknown): value is ChatModelId =>
  chatModels.some((m) => m.id === value);
