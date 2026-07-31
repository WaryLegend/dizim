import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { PartnerResponse } from "@/types/partner";

const query = qs.stringify({
  sort: ["id:asc"],
  populate: {
    logo: {
      fields: ["url", "name", "alternativeText", "width", "height"],
    },
  },
  locale: "en",
});

export async function getPartners(): Promise<PartnerResponse> {
  return fetchStrapi<PartnerResponse>(`/api/partners?${query}`);
}
