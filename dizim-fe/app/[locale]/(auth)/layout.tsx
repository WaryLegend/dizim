import Link from "next/link";
import Image from "next/image";
import { getGlobal } from "@/services/global.api";
import { type Locale } from "@/i18n/routing";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const global = await getGlobal(locale);
  const bg = global.data.auth_background;

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute inset-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${bg.url}`}
          alt={bg.alternativeText || "Background"}
          fill
          className="object-cover"
          priority
        />
      </div>

      <header className="relative z-10 w-full px-8 py-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-xl font-bold text-white">Dizim.ai</span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
