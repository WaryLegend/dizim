import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { PartnerResponse } from "@/types/partner";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const query = qs.stringify({
  sort: ["id:asc"],
  populate: {
    logo: {
      fields: ["url", "name", "alternativeText", "width", "height"],
    },
  },
  status: "published",
  locale: "en",
});

export async function getPartners(): Promise<PartnerResponse> {
  return fetchStrapi<PartnerResponse>(`${STRAPI_URL}/api/partners?${query}`);
}
