import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { GlobalResponse } from "@/types/global";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const query = qs.stringify({
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
  locale: "en",
});

export async function getGlobal(): Promise<GlobalResponse> {
  return fetchStrapi<GlobalResponse>(`${STRAPI_URL}/api/global?${query}`);
}
