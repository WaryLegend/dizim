import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { PricingPlanResponse } from "@/types/pricing-plan";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

const query = qs.stringify({
  sort: ["id:asc"],
  populate: {
    cta: true,
  },
  status: "published",
  locale: "en",
});

export async function getPricingPlans(): Promise<PricingPlanResponse> {
  return fetchStrapi<PricingPlanResponse>(
    `${STRAPI_URL}/api/pricing-plans?${query}`,
  );
}
