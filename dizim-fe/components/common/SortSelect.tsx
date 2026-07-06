"use client";

import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortOption = {
  label: string;
  value: string;
};

type SortSelectProps = {
  sortOptions: readonly SortOption[] | SortOption[];
  defaultSort?: string;
};

export default function SortSelect({
  sortOptions,
  defaultSort,
}: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fallback = defaultSort ?? sortOptions[0]?.value ?? "";
  const currentSort = searchParams.get("sort") || fallback;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="text-muted-foreground h-4 w-4" />
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="border-border text-foreground bg-background cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium outline-none transition-colors focus:border-electric-violet focus:ring-1 focus:ring-electric-violet"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
