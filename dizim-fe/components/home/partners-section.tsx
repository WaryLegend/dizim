import Image from "next/image";
import Link from "next/link";
import { getPartners } from "@/services/partner.api";
import type { PartnerData } from "@/types/partner";
import { STRAPI_URL } from "@/lib/utils";

export default async function PartnersSection() {
  let partners: PartnerData[] = [];

  try {
    const res = await getPartners();
    partners = res.data;
  } catch {
    return null;
  }

  if (!partners.length) return null;

  return (
    <section className="bg-background py-16">
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-foreground mb-12 text-center text-3xl font-bold md:text-4xl">
          Our Partners
        </h2>
      </div>
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            animation: "marquee-left 40s linear infinite",
          }}
        >
          {[...partners, ...partners].map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center px-10 grayscale transition-all hover:grayscale-0"
            >
              <Image
                src={`${STRAPI_URL}${p.logo.url}`}
                alt={p.name}
                width={p.logo.width || 120}
                height={p.logo.height || 48}
                className="h-16 w-auto object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
