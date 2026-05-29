"use client";

import React, { useMemo, useState } from "react";
import StrapiButton from "@/components/common/strapi-button";
import { Switch } from "@/components/shadcn-ui/switch";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlanData } from "@/types/pricing-plan";
import FeatureRow from "./feature-row";

interface PricingTableProps {
  plans: PricingPlanData[];
}

type FeaturePath = Array<string>;

const PRICING_FEATURES: Array<{
  category: string;
  items: Array<{ label: string; path: FeaturePath }>;
}> = [
  {
    category: "CREATIVE VIDEO CREATION",
    items: [
      { label: "Export Videos", path: ["videoCreation", "exportVideos"] },
      { label: "Video Length", path: ["videoCreation", "videoLength"] },
      {
        label: "Video creating process at the same time",
        path: ["videoCreation", "concurrentProcesses"],
      },
      {
        label: "Basic media templates",
        path: ["videoCreation", "basicTemplates"],
      },
      {
        label: "Premium media templates",
        path: ["videoCreation", "premiumTemplates"],
      },
      {
        label: "Customizable media templates",
        path: ["videoCreation", "customizableTemplates"],
      },
    ],
  },
  {
    category: "AI SPEAKER",
    items: [
      {
        label: "AI Speakers included",
        path: ["aiSpeaker", "speakersIncluded"],
      },
      {
        label: "Max characters speaking",
        path: ["aiSpeaker", "maxCharacters"],
      },
    ],
  },
  {
    category: "MULTICHANNEL CONTENT DISTRIBUTION",
    items: [
      {
        label: "Social Accounts Integration",
        path: ["multiChannel", "socialAccounts"],
      },
      { label: "Users included", path: ["multiChannel", "usersIncluded"] },
    ],
  },
  {
    category: "ADVANCED",
    items: [
      { label: "Social Listening", path: ["advanced", "socialListening"] },
      {
        label: "Support to consult offline video",
        path: ["advanced", "offlineConsultation"],
      },
      {
        label: "Support to connect influencers",
        path: ["advanced", "influencerConnect"],
      },
    ],
  },
];

function getFeatureValue(plan: PricingPlanData, path: FeaturePath) {
  return path.reduce<unknown>((value, key) => {
    if (value && typeof value === "object") {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, plan.features) as string | boolean | undefined;
}

export default function PricingTable({ plans }: PricingTableProps) {
  const [isAnnual, setIsAnnual] = useState(true);

  const orderedPlans = useMemo(() => {
    return [...plans].sort((a, b) => a.id - b.id);
  }, [plans]);

  const columnStyles = orderedPlans.map((plan) => {
    return plan.bg_color ? { backgroundColor: plan.bg_color } : undefined;
  });

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-1/3 py-4 pr-4 text-left">
                    <div className="font-normal">
                      <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
                        Pricing plans
                      </h1>
                      <p className="text-muted-foreground max-w-md">
                        Our starter plan comes with a 14-day free trial with
                        essential features &amp; no credit card required.
                      </p>

                      <div className="mt-6 flex items-center gap-3">
                        <span
                          className={cn(
                            "text-sm",
                            !isAnnual
                              ? "text-foreground font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          Billed Monthly
                        </span>
                        <Switch
                          checked={isAnnual}
                          onCheckedChange={setIsAnnual}
                          className="data-[state=checked]:bg-rose"
                        />
                        <span
                          className={cn(
                            "text-sm",
                            isAnnual
                              ? "text-foreground font-medium"
                              : "text-muted-foreground",
                          )}
                        >
                          Billed Annually
                        </span>
                      </div>
                    </div>
                  </th>

                  {orderedPlans.map((plan, index) => (
                    <th
                      key={plan.id}
                      className="min-w-45 px-4 py-4 text-center"
                      style={columnStyles[index]}
                    >
                      <div className="space-y-2">
                        <h3 className="text-foreground text-lg font-bold">
                          {plan.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {plan.description}
                        </p>

                        {plan.featured ? (
                          <div className="py-4">
                            <Star className="text-muted-foreground mx-auto h-12 w-12" />
                          </div>
                        ) : (
                          <div className="py-4">
                            <span className="text-foreground text-4xl font-bold">
                              $
                              {isAnnual
                                ? (plan.annualPrice ?? "-")
                                : (plan.monthlyPrice ?? "-")}
                            </span>
                            <span className="text-muted-foreground block text-sm">
                              Per month
                            </span>
                          </div>
                        )}

                        <StrapiButton
                          button={plan.cta || undefined}
                          className={cn(
                            "rounded-full px-6",
                            plan.featured
                              ? "text-foreground border-border hover:bg-muted border bg-white"
                              : plan.name === "Starter"
                                ? "bg-foreground hover:bg-foreground/90 text-white"
                                : "text-foreground border-border hover:bg-muted border bg-white",
                          )}
                        >
                          {plan.cta?.text || "Contact Us"}
                        </StrapiButton>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICING_FEATURES.map((category) => (
                  <React.Fragment key={category.category}>
                    <tr>
                      <td className="pt-8 pb-4">
                        <h4 className="text-foreground text-sm font-bold tracking-wider uppercase">
                          {category.category}
                        </h4>
                      </td>
                      {orderedPlans.map((plan, index) => (
                        <td
                          key={`${category.category}-${plan.id}`}
                          className="pt-8 pb-4"
                          style={columnStyles[index]}
                        />
                      ))}
                    </tr>
                    {category.items.map((item) => (
                      <FeatureRow
                        key={`${category.category}-${item.label}`}
                        label={item.label}
                        values={orderedPlans.map((plan) => {
                          return (getFeatureValue(plan, item.path) ?? "-") as
                            | string
                            | boolean;
                        })}
                        columnStyles={columnStyles}
                      />
                    ))}
                  </React.Fragment>
                ))}

                <tr>
                  <td className="py-8"></td>
                  {orderedPlans.map((plan, index) => (
                    <td
                      key={`cta-${plan.id}`}
                      className="px-4 py-8 text-center"
                      style={columnStyles[index]}
                    >
                      <StrapiButton
                        button={plan.cta || undefined}
                        className={cn(
                          "rounded-full px-6",
                          plan.featured
                            ? "text-foreground border-border hover:bg-muted border bg-white"
                            : plan.name === "Starter"
                              ? "bg-foreground hover:bg-foreground/90 text-white"
                              : "text-foreground border-border hover:bg-muted border bg-white",
                        )}
                      >
                        {plan.cta?.text || "Contact Us"}
                      </StrapiButton>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
