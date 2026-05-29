"use client";

import StrapiButton from "@/components/common/strapi-button";
import type { StrapiCtaBlock as CtaBlockType } from "@/types/global";
import Image from "next/image";

interface CtaBlockProps {
  cta_block: CtaBlockType;
}
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function CtaBlock({ cta_block }: CtaBlockProps) {
  if (!cta_block) return null;

  const bgGradient = cta_block.bg_color
    ? `bg-[${cta_block.bg_color}]`
    : "bg-linear-to-r from-rose via-electric-violet to-azure-radiance";

  return (
    <section className={`relative overflow-hidden py-20 ${bgGradient}`}>
      {cta_block.image?.url && (
        <Image
          src={`${STRAPI_URL}${cta_block.image.url}`}
          alt={cta_block.image.alternativeText || ""}
          fill
          priority
          className="pointer-events-none object-cover hover:cursor-default"
        />
      )}
      <div className="relative mx-auto max-w-2xl px-4 text-center">
        <p className="mb-2 text-sm font-medium text-white/80">
          Let&apos;s Start
        </p>
        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          {cta_block.title}
        </h2>
        {cta_block.description && (
          <p className="mb-8 text-white/80">{cta_block.description}</p>
        )}
        {cta_block.cta && (
          <div className="mx-auto flex max-w-xl items-center overflow-hidden rounded-full bg-white shadow-lg">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent px-5 text-gray-700 outline-none"
            />
            <div className="shrink-0">
              <StrapiButton button={cta_block.cta} onClick={() => {}} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
