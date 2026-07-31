import Image from "next/image";
import Link from "next/link";
import type { BlockStepSection } from "@/types/home-page";
import { STRAPI_URL } from "@/lib/utils";
import StrapiButton from "@/components/common/strapi-button";

export default function StepSection({
  heading,
  description,
  cta,
  steps,
}: BlockStepSection) {
  return (
    <section className="bg-linear-to-t from-[#FAFCFF] via-[#FAFCFF]/80 to-transparent py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-foreground text-3xl font-bold md:text-4xl">
              {heading}
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            {description && (
              <p className="text-muted-foreground text-lg">{description}</p>
            )}
            {cta && (
              <StrapiButton
                button={cta}
                className="border-rose text-rose hover:not-disabled:bg-rose/5 border"
              />
            )}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps?.map((step, index) => (
            <div
              key={step.id}
              className="border-border rounded-2xl border bg-white p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl">
                {step.icon ? (
                  <Image
                    src={`${STRAPI_URL}${step.icon.url}`}
                    alt={step.icon.alternativeText || step.title}
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                ) : (
                  <span className="text-xl">⭐</span>
                )}
              </div>
              <div className="mb-3 flex items-center gap-2">
                <span className="bg-electric-violet/10 text-electric-violet flex h-7 w-10 items-center justify-center rounded-full text-sm font-bold">
                  0{index + 1}
                </span>
                <h3 className="text-foreground text-xl font-bold">
                  {step.title}
                </h3>
              </div>
              {step.description && (
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {step.description}
                </p>
              )}
              {step.image && (
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl drop-shadow-lg">
                  <Image
                    src={`${STRAPI_URL}${step.image.url}`}
                    alt={step.image.alternativeText || step.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
