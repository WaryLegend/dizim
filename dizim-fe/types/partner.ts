import type { StrapiMedia } from "./global";

export interface PartnerData {
  id: number;
  documentId: string;
  name: string;
  url: string;
  logo: StrapiMedia;
}

export interface PartnerResponse {
  data: PartnerData[];
  meta: Record<string, unknown>;
}
