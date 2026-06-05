import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import { routing } from "@/i18n/routing";
import type { GlobalResponse } from "@/types/global";

function buildGlobalQuery(locale: string = routing.defaultLocale) {
  return qs.stringify({
    populate: {
      auth_background: {
        fields: ["url", "name", "alternativeText"],
      },
      location: true,
      SocialMedia: {
        populate: ["icon"],
      },
      cta_block: {
        populate: {
          image: {
            fields: ["url", "name", "alternativeText"],
          },
          cta: true,
        },
      },
      navigation: {
        populate: {
          links: true,
        },
      },
      logo: {
        populate: ["icon"],
      },
    },
    locale,
  });
}

export async function getGlobal(
  locale: string = routing.defaultLocale,
): Promise<GlobalResponse> {
  return fetchStrapi<GlobalResponse>(`/api/global?${buildGlobalQuery(locale)}`);
}
