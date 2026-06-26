"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/shadcn-ui/button";
import { Calendar } from "lucide-react";
import { getArticles } from "@/services/article.api";
import type { ArticleData } from "@/types/article";
import { STRAPI_URL } from "@/lib/utils";
import { Spinner } from "@/components/shadcn-ui/spinner";

export default function NewsPage() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchArticles = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getArticles({ page: pageNum, pageSize: 6 });
      const { data, meta } = res;
      setArticles((prev) =>
        pageNum === 1 ? data : [...prev, ...data],
      );
      setHasMore(meta.pagination.page < meta.pagination.pageCount);
    } catch {
      setError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    setInitialLoading(true);
    fetchArticles(1);
  }, [fetchArticles]);

  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchArticles(nextPage);
  }

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl">
              Latest News
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl">
              Stay updated with the latest news, product updates, and events
              from Dizim.ai
            </p>
          </div>

          {initialLoading ? (
            <div className="flex justify-center py-20">
              <Spinner className="text-muted-foreground size-8" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => {
                  setPage(1);
                  fetchArticles(1);
                }}
              >
                Try Again
              </Button>
            </div>
          ) : !articles.length ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-lg">
                No news articles yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="border-border group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg"
                  >
                    <div className="h-48 relative overflow-hidden bg-zinc-100">
                      {article.image ? (
                        <Image
                          src={`${STRAPI_URL}${article.image.url}`}
                          alt={
                            article.image.alternativeText || article.title
                          }
                          fill
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-medium text-zinc-400">
                            News Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-rose text-xs font-medium tracking-wider uppercase">
                          {article.category}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {article.date}
                        </span>
                      </div>
                      <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 font-semibold transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {article.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-12 flex flex-col items-center gap-4">
                {loading && (
                  <Spinner className="text-muted-foreground size-6" />
                )}
                {hasMore && !loading && (
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    className="border-primary text-primary hover:bg-primary rounded-full px-8 hover:text-white"
                  >
                    Load More
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
