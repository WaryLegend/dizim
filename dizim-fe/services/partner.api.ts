import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import { routing } from "@/i18n/routing";
import type { PartnerResponse } from "@/types/partner";

function buildPartnerQuery(locale: string = routing.defaultLocale) {
  return qs.stringify({
    sort: ["id:asc"],
    populate: {
      logo: {
        fields: ["url", "name", "alternativeText", "width", "height"],
      },
    },
    status: "published",
    locale,
  });
}

export async function getPartners(
  locale: string = routing.defaultLocale,
): Promise<PartnerResponse> {
  return fetchStrapi<PartnerResponse>(
    `/api/partners?${buildPartnerQuery(locale)}`,
  );
}
