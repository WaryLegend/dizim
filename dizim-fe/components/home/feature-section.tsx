import Image from "next/image";
import { ChevronRight } from "lucide-react";
import StrapiButton from "@/components/common/strapi-button";
import BgCircle from "@/components/ui/bg-circle";
import type { BlockFeatureSection } from "@/types/home-page";
import { STRAPI_URL } from "@/lib/utils";

function renderRichText(desc: Array<{ children: Array<{ text: string }> }>) {
  return (
    desc?.map((p) => p.children.map((c) => c.text).join("")).join("\n") || ""
  );
}

export default function FeatureSection({
  heading,
  description,
  feature,
}: BlockFeatureSection) {
  return (
    <section className="bg-background relative overflow-x-clip py-20">
      <BgCircle
        from="#F39C17"
        to="#FFCA6C"
        size={140}
        className="pointer-events-none absolute top-10 -left-10"
        id="feat-yellow"
      />
      <BgCircle
        from="#FF8CCF"
        to="#EC40A1"
        size={120}
        className="pointer-events-none absolute -top-1 right-1/4 -translate-x-1/4 -translate-y-1/2"
        id="feat-pink-center"
      />
      <BgCircle
        from="#9D8DFF"
        to="#6044FE"
        size={120}
        className="pointer-events-none absolute -right-6 bottom-20"
        id="feat-pink-right"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
            {heading}
          </h2>
          {description && (
            <p className="text-muted-foreground text-base">{description}</p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {feature?.map((item) => (
            <div
              key={item.id}
              className="border-border rounded-2xl border bg-white p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl">
                {item.icon ? (
                  <Image
                    src={`${STRAPI_URL}${item.icon.url}`}
                    alt={item.icon.alternativeText || item.title}
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                ) : (
                  <span className="text-xl">⭐</span>
                )}
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">
                {item.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {renderRichText(item.description)}
              </p>
              {item.button && (
                <StrapiButton
                  button={item.button}
                  className="text-bold hover:underline"
                >
                  {item.button.text}
                  <ChevronRight className="h-4 w-4" />
                </StrapiButton>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
