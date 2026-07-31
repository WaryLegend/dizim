import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import { routing } from "@/i18n/routing";
import type { HomePageResponse } from "@/types/home-page";

function buildHomePageQuery(locale: string = routing.defaultLocale) {
  return qs.stringify({
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
    locale,
    status: "published",
  });
}

export async function getHomePage(
  locale: string = routing.defaultLocale,
): Promise<HomePageResponse> {
  return fetchStrapi<HomePageResponse>(
    `/api/home-page?${buildHomePageQuery(locale)}`,
  );
}
