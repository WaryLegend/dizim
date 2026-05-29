import type { StrapiButton } from "./global";

export interface PricingPlanAdvancedFeatures {
  socialListening: boolean;
  influencerConnect: boolean;
  offlineConsultation: boolean;
}

export interface PricingPlanAiSpeakerFeatures {
  maxCharacters: string;
  speakersIncluded: string;
}

export interface PricingPlanMultiChannelFeatures {
  usersIncluded: string;
  socialAccounts: string;
}

export interface PricingPlanVideoCreationFeatures {
  videoLength: string;
  exportVideos: string;
  basicTemplates: boolean;
  premiumTemplates: boolean;
  concurrentProcesses: string;
  customizableTemplates: boolean;
}

export interface PricingPlanFeatures {
  advanced: PricingPlanAdvancedFeatures;
  aiSpeaker: PricingPlanAiSpeakerFeatures;
  multiChannel: PricingPlanMultiChannelFeatures;
  videoCreation: PricingPlanVideoCreationFeatures;
}

export interface PricingPlanData {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  featured: boolean;
  features: PricingPlanFeatures;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string;
  bg_color: string | null;
  cta: StrapiButton | null;
}

export interface PricingPlanResponse {
  data: PricingPlanData[];
  meta: Record<string, unknown>;
}
