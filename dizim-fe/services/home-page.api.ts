import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { HomePageResponse } from "@/types/home-page";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const query = qs.stringify({
  populate: {
    blocks: {
      on: {
        "blocks.hero-section": {
          populate: {
            image: {
              fields: ["url", "name", "alternativeText"],
            },
            buttons: true,
          },
        },
        "blocks.feature-section": {
          populate: {
            feature: {
              populate: {
                icon: true,
                button: true,
              },
            },
          },
        },
        "blocks.step-section": {
          populate: {
            cta: true,
            steps: {
              populate: {
                icon: true,
                image: {
                  fields: ["url", "name", "alternativeText"],
                },
              },
            },
          },
        },
        "blocks.cta-section": {
          populate: {
            cta_block: {
              populate: {
                image: {
                  fields: ["url", "name", "alternativeText"],
                },
                cta: true,
              },
            },
          },
        },
        "blocks.testimonial-section": {
          populate: {
            image: {
              fields: ["url", "name", "alternativeText"],
            },
            testimonials: {
              populate: "*",
            },
          },
        },
        "blocks.shows-section": {
          populate: {
            cta: true,
            shows: {
              populate: "*",
            },
          },
        },
      },
    },
  },
  locale: "en",
  status: "published",
});

export async function getHomePage(): Promise<HomePageResponse> {
  return fetchStrapi<HomePageResponse>(`${STRAPI_URL}/api/home-page?${query}`);
}
