import { Check, X } from "lucide-react";

export default function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="mx-auto h-5 w-5 text-emerald-500" />
    ) : (
      <X className="text-rose mx-auto h-5 w-5" />
    );
  }

  return <span className="text-foreground text-sm">{value}</span>;
}
