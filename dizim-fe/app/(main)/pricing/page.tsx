import { getPricingPlans } from "@/services/pricing-plan.api";
import PricingTable from "@/components/pricing-plans/pricing-table";

export default async function PricingPage() {
  const data = await getPricingPlans();

  return <PricingTable plans={data.data} />;
}
