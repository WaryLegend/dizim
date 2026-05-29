"use client";

import { Play, ChevronRight } from "lucide-react";
import Image from "next/image";
import StrapiButton from "@/components/common/strapi-button";
import type {
  StrapiButton as StrapiButtonType,
  StrapiMedia,
} from "@/types/global";
import { STRAPI_URL } from "@/lib/utils";

interface HeroSectionProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string | null;
  image: StrapiMedia | null;
  buttons: StrapiButtonType[];
}

export default function HeroSection({
  badge,
  title,
  subtitle,
  description,
  image,
  buttons,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="bg-electric-violet/15 pointer-events-none absolute top-0 left-50 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
      <div className="bg-rose/15 pointer-events-none absolute top-0 right-0 h-100 w-100 translate-x-1/3 -translate-y-1/4 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-2 md:grid-cols-2">
          <div className="flex flex-col gap-6">
            {badge && (
              <div className="bg-electric-violet/10 text-electric-violet inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                <span className="bg-electric-violet h-2 w-2 animate-pulse rounded-full" />
                {badge}
              </div>
            )}

            <h1 className="text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
              <span className="text-foreground">{title}</span>
              <br />
              <span className="from-electric-violet to-rose bg-linear-to-r bg-clip-text text-transparent">
                {subtitle}
              </span>
            </h1>

            {description && (
              <p className="text-muted-foreground max-w-lg text-base leading-relaxed lg:text-lg">
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              {buttons?.map((button) => (
                <StrapiButton key={button.id} button={button} />
              ))}
            </div>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex -space-x-3">
                {["#FF008F", "#8000FF", "#00A5FF"].map((color, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">
                Trusted by <strong className="text-foreground">10k+</strong>{" "}
                creators
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            {image && (
              <div className="relative aspect-3/4 w-full max-w-lg rounded-2xl drop-shadow-lg">
                <Image
                  src={`${STRAPI_URL}${image.url}`}
                  alt={image.alternativeText || "Hero"}
                  fill
                  quality={100}
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
