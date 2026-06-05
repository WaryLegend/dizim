import { getHomePage } from "@/services/home-page.api";
import { type Locale } from "@/i18n/routing";
import HeroSection from "@/components/home/hero-section";
import FeatureSection from "@/components/home/feature-section";
import StepSection from "@/components/home/step-section";
import ShowsSection from "@/components/home/shows-section";
import CtaSection from "@/components/home/cta-section";
import TestimonialSection from "@/components/home/testimonial-section";
import PartnersSection from "@/components/home/partners-section";
import NewsSection from "@/components/home/news-section";
import type { HomePageBlock } from "@/types/home-page";

function RenderBlock(block: HomePageBlock) {
  const key = `${block.__component}-${block.id}`;
  switch (block.__component) {
    case "blocks.hero-section":
      return <HeroSection key={key} {...block} />;
    case "blocks.feature-section":
      return <FeatureSection key={key} {...block} />;
    case "blocks.step-section":
      return <StepSection key={key} {...block} />;
    case "blocks.shows-section":
      return <ShowsSection key={key} {...block} />;
    case "blocks.cta-section":
      return <CtaSection key={key} {...block} />;
    case "blocks.testimonial-section":
      return <TestimonialSection key={key} {...block} />;
    default:
      return null;
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const data = await getHomePage(locale);
  const blocks = data.data.blocks;

  return (
    <>
      {blocks.map((block) => RenderBlock(block))}
      <PartnersSection locale={locale} />
      <NewsSection />
    </>
  );
}
