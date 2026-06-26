import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { getLatestArticles } from "@/services/article.api";
import type { ArticleData } from "@/types/article";
import { STRAPI_URL } from "@/lib/utils";

export default async function NewsSection() {
  let articles: ArticleData[] = [];

  try {
    const res = await getLatestArticles(3);
    articles = res.data;
  } catch {
    return null;
  }

  if (!articles.length) return null;

  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-foreground mb-12 text-center text-3xl font-bold md:text-4xl">
          Latest News
        </h2>

        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="border-border overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="aspect-video relative flex items-center justify-center overflow-hidden bg-zinc-100">
                {article.image ? (
                  <Image
                    src={`${STRAPI_URL}${article.image.url}`}
                    alt={article.image.alternativeText || article.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl">📰</span>
                )}
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-rose text-xs font-semibold tracking-wider uppercase">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Calendar className="h-3 w-3" />
                    {article.date}
                  </span>
                </div>
                <h3 className="text-foreground line-clamp-2 leading-snug font-semibold">
                  {article.title}
                </h3>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="border-electric-violet text-electric-violet hover:bg-electric-violet rounded-full px-8 hover:text-white"
          >
            <Link href="/news">
              View More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
