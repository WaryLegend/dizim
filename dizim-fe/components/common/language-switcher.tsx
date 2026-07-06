"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const locales = ["en", "vi"];

export default function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const switchTo = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-foreground/70 hover:text-foreground flex items-center gap-1 text-sm font-medium transition-colors"
      >
        {currentLocale.toUpperCase()}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 z-20 mt-1 min-w-20 rounded-lg border bg-white shadow-lg">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchTo(locale)}
                className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                  currentLocale === locale
                    ? "text-rose font-medium"
                    : "text-foreground/70"
                }`}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
