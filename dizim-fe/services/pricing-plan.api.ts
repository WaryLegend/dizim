import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import { routing } from "@/i18n/routing";
import type { PricingPlanResponse } from "@/types/pricing-plan";

function buildPricingPlanQuery(locale: string = routing.defaultLocale) {
  return qs.stringify({
    sort: ["id:asc"],
    populate: {
      cta: true,
    },
    status: "published",
    locale,
  });
}

export async function getPricingPlans(
  locale: string = routing.defaultLocale,
): Promise<PricingPlanResponse> {
  return fetchStrapi<PricingPlanResponse>(
    `/api/pricing-plans?${buildPricingPlanQuery(locale)}`,
  );
}
