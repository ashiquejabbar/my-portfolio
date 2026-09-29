// Languages the portfolio is published in. English is the default and is served at "/"
// (next.config.ts rewrites "/" to "/en"); the others live at "/ar", "/fr", "/de" and "/es".
export const locales = ["en", "ar", "fr", "de", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

// Shown in the language menu, each in its own language
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

export const localeDir = (locale: Locale): "ltr" | "rtl" => (locale === "ar" ? "rtl" : "ltr");

export const ogLocales: Record<Locale, string> = {
  en: "en_AE",
  ar: "ar_AE",
  fr: "fr_FR",
  de: "de_DE",
  es: "es_ES",
};

// Page path for a language; English keeps the bare domain so the link on the CV never changes
export const localePath = (locale: Locale) => (locale === defaultLocale ? "/" : `/${locale}`);
