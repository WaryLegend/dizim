import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "vi"] as const,
  defaultLocale: "en",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
