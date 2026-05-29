import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlockCtaSection } from "@/types/home-page";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function CtaSection({ cta_block }: BlockCtaSection) {
  if (!cta_block?.length) return null;

  return (
    <section className="flex min-h-120 w-full flex-col overflow-hidden md:flex-row">
      {cta_block.map((block) => {
        const overlayColor = block.bg_color || "#8000FF";
        const btnColor = block.cta?.color || "#0B0B0C";

        return (
          <div
            key={block.id}
            className="group relative flex min-h-100 flex-1 flex-col justify-center overflow-hidden md:min-h-120"
          >
            {/* Background Image */}
            {block.image && (
              <Image
                src={`${STRAPI_URL}${block.image.url}`}
                alt={block.image.alternativeText || block.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}

            {/* The Overlay Layer */}
            <div
              className="bg-opacity-90 absolute inset-0 mix-blend-multiply"
              style={{ backgroundColor: overlayColor }}
            />

            {/* Secondary subtle dark layer underneath to ensure text remains highly readable */}
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />

            {/* Content Container */}
            <div className="relative z-10 flex h-full w-full flex-col justify-center px-8 py-16 sm:px-12">
              <h3 className="mb-4 text-3xl font-bold tracking-tight text-white xl:text-4xl">
                {block.title}
              </h3>
              <p className="mb-8 max-w-sm text-base leading-relaxed font-medium text-white/90">
                {block.description}
              </p>
              {block.cta && (
                <Link
                  href={block.cta.href || "#"}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold shadow-md transition-all hover:bg-white/95 hover:shadow-lg active:scale-95"
                  style={{ color: btnColor }}
                >
                  {block.cta.text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
