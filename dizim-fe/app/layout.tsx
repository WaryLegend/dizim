import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { getGlobal } from "@/services/global.api";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const global = await getGlobal();
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
