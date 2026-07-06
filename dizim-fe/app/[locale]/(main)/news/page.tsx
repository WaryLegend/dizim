import { getArticles } from "@/services/article.api";
import NewsCard from "@/components/news/NewsCard";
import NewsSort from "@/components/news/NewsSort";
import Pagination from "@/components/common/Pagination";

type PageProps = {
  searchParams: Promise<{ page?: string; sort?: string }>;
};

export default async function NewsPage({ searchParams }: PageProps) {
  const { page, sort } = await searchParams;
  const { data: articles, meta } = await getArticles({
    page: Number(page) || 1,
    sort: sort || "date:desc",
  });

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-end">
            <NewsSort />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          <div className="mt-12">
            <Pagination
              total={meta.pagination.total}
              pageSize={meta.pagination.pageSize}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
