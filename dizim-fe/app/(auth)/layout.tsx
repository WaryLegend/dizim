import Link from "next/link";
import Image from "next/image";
import { getGlobal } from "@/services/global.api";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await getGlobal();
  const bg = global.data.auth_background;

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0">
        <Image
          src={`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${bg.url}`}
          alt={bg.alternativeText || "Background"}
          fill
          className="object-cover"
          priority
        />
      </div>

      <header className="relative z-10 w-full py-2 px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-white font-bold text-xl">Dizim.ai</span>
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
