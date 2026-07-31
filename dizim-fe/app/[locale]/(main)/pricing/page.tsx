import { getPricingPlans } from "@/services/pricing-plan.api";
import { type Locale } from "@/i18n/routing";
import PricingTable from "@/components/pricing-plans/pricing-table";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const data = await getPricingPlans(locale);

  return <PricingTable plans={data.data} />;
}
