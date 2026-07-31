"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PaginationProps = {
  total: number;
  pageSize?: number;
};

type PageItem = number | "...";

export default function Pagination({ total, pageSize = 10 }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (total <= pageSize) return null;

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(total / pageSize);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const prevPage = () => {
    if (currentPage > 1) setPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < pageCount) setPage(currentPage + 1);
  };

  const getPageNumbers = (): PageItem[] => {
    if (pageCount <= 1) return [1];

    const delta = 2;
    const pages: PageItem[] = [];

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(pageCount - 1, currentPage + delta);

    if (rangeStart > 2) pages.push("...");

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

    if (rangeEnd < pageCount - 1) pages.push("...");

    if (pageCount > 1) pages.push(pageCount);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-muted-foreground text-sm">
        Showing{" "}
        <span className="text-electric-violet font-semibold">
          {(currentPage - 1) * pageSize + 1}
        </span>{" "}
        to{" "}
        <span className="text-electric-violet font-semibold">
          {currentPage !== pageCount ? currentPage * pageSize : total}
        </span>{" "}
        of <span className="font-semibold">{total}</span> results
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="text-electric-violet hover:bg-electric-violet/10 disabled:text-muted-foreground flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="hidden md:inline">Back</span>
        </button>

        <div className="flex gap-1">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="flex h-9 w-8 items-center justify-center text-sm font-medium lg:h-9 lg:w-8"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setPage(page)}
                className={`flex h-9 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors lg:h-9 lg:w-8 ${
                  page === currentPage
                    ? "bg-electric-violet text-white"
                    : "text-electric-violet hover:bg-electric-violet/10 border-electric-violet/20 border"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className="text-electric-violet hover:bg-electric-violet/10 disabled:text-muted-foreground flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="hidden md:inline">Next</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
