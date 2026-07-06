import Image from "next/image";
import { STRAPI_URL } from "@/lib/utils";
import type { ArticleData } from "@/types/article";

type NewsCardProps = {
  article: ArticleData;
};

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="border-border group cursor-pointer overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        {article.image ? (
          <Image
            src={`${STRAPI_URL}${article.image.url}`}
            alt={article.image.alternativeText || article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="from-electric-violet to-rose flex h-full w-full items-center justify-center bg-linear-to-br">
            <span className="text-lg font-medium text-white/50">No Image</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-rose text-xs font-medium tracking-wider uppercase">
            {article.category}
          </span>
          <span className="text-muted-foreground text-xs">
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
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
  );
}
