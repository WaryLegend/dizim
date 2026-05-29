import type { StrapiMedia, StrapiButton } from "./global";

// ---------- hero-section ----------
export interface BlockHeroSection {
  __component: "blocks.hero-section";
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  image: StrapiMedia | null;
  description: string | null;
  buttons: StrapiButton[];
}

// ---------- feature-item ----------
export interface BlockFeatureItem {
  id: number;
  title: string;
  description: BlocksRichText;
  icon: StrapiMedia | null;
  button: StrapiButton | null;
}

// ---------- feature-section ----------
export interface BlockFeatureSection {
  __component: "blocks.feature-section";
  id: number;
  heading: string;
  description: string;
  feature: BlockFeatureItem[];
}

// ---------- step ----------
export interface BlockStepItem {
  id: number;
  title: string;
  description: string;
  icon: StrapiMedia | null;
  image: StrapiMedia | null;
}

export interface BlockStepSection {
  __component: "blocks.step-section";
  id: number;
  heading: string;
  description: string;
  cta: StrapiButton | null;
  steps: BlockStepItem[];
}

// ---------- shows-section ----------
export interface BlockShowsSection {
  __component: "blocks.shows-section";
  id: number;
  title: string;
  description: string;
  cta: StrapiButton | null;
  shows: unknown[];
}

// ---------- cta-section ----------
export interface BlockCtaBlock {
  id: number;
  title: string;
  description: string;
  bg_color: string | null;
  image: StrapiMedia | null;
  cta: StrapiButton;
}

export interface BlockCtaSection {
  __component: "blocks.cta-section";
  id: number;
  cta_block: BlockCtaBlock[];
}

// ---------- testimonial ----------
export interface BlockTestimonialItem {
  id: number;
  documentId: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rated: number | null;
  avatar: StrapiMedia | null;
}

export interface BlockTestimonialSection {
  __component: "blocks.testimonial-section";
  id: number;
  title: string;
  image: StrapiMedia | null;
  testimonials: BlockTestimonialItem[];
}

export type HomePageBlock =
  | BlockHeroSection
  | BlockFeatureSection
  | BlockStepSection
  | BlockShowsSection
  | BlockCtaSection
  | BlockTestimonialSection;

export interface HomePageData {
  id: number;
  documentId: string;
  title: string;
  description: string | null;
  blocks: HomePageBlock[];
}

export interface HomePageResponse {
  data: HomePageData;
  meta: Record<string, unknown>;
}

type BlocksRichText = Array<{
  type: string;
  children: Array<{ text: string; type: string }>;
}>;
