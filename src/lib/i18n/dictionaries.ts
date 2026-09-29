import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

// Server-only: dictionaries load per request/build, so no translation text ships in client JS
// except the slices passed to client components as props.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  ar: () => import("./dictionaries/ar").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  de: () => import("./dictionaries/de").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
};

// The [lang] segment of the current page (see src/app/[lang]/layout.tsx)
export async function getLocale(): Promise<Locale> {
  const locale = await lang();
  if (!isLocale(locale)) notFound();
  return locale;
}

export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}

export type { Dictionary };
