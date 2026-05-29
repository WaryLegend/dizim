"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StarRated from "@/components/ui/star-rated";
import type { BlockTestimonialSection } from "@/types/home-page";
import { STRAPI_URL } from "@/lib/utils";

export default function TestimonialSection({
  title,
  image,
  testimonials,
}: BlockTestimonialSection) {
  const [startIndex, setStartIndex] = useState(0);

  if (!testimonials?.length) return null;

  const showArrows = testimonials.length > 3;

  const visible = showArrows
    ? Array.from({ length: 3 }, (_, i) => {
        const idx = (startIndex + i) % testimonials.length;
        return testimonials[idx];
      })
    : testimonials;

  const next = () => setStartIndex((prev) => (prev + 3) % testimonials.length);
  const prev = () =>
    setStartIndex(
      (prev) => (prev - 3 + testimonials.length) % testimonials.length,
    );

  return (
    <section className="relative overflow-hidden py-20">
      {image && (
        <div className="absolute inset-0">
          <Image
            src={`${STRAPI_URL}${image.url}`}
            alt={image.alternativeText || title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-white/60" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex items-center justify-between">
          <h2 className="text-foreground text-3xl font-bold md:text-4xl">
            {title}
          </h2>
          {showArrows && (
            <div className="flex gap-2">
              <button
                onClick={prev}
                className="border-border rounded-full border p-2 transition-colors hover:bg-black/5"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="border-border rounded-full border p-2 transition-colors hover:bg-black/5"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {visible.map((testimonial) => (
            <div
              key={testimonial.id}
              className="border-border rounded-2xl border bg-white p-8 shadow-sm"
            >
              {testimonial.rated != null && (
                <StarRated
                  rated={testimonial.rated}
                  className="mb-4"
                  starClassName="text-rose"
                />
              )}
              <p className="text-muted-foreground mb-8 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-electric-violet/20 text-electric-violet flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  {testimonial.avatar ? (
                    <Image
                      src={`${STRAPI_URL}${testimonial.avatar.url}`}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    testimonial.name.charAt(0)
                  )}
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role}
                    {testimonial.company ? `, ${testimonial.company}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
