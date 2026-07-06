import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getGlobal } from "@/services/global.api";
import { routing, type Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  try {
    const global = await getGlobal(locale);
    const { siteName, description } = global.data;
    return {
      title: `${siteName} - Make Content Ever Easy`,
      description: description || "AI-powered live commerce platform",
    };
  } catch {
    return {
      title: "Dizim.ai - Make Content Ever Easy",
      description:
        "AI-powered platform for live commerce, content creation, and multi-platform distribution",
    };
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${montserrat.variable} bg-background`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
