import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import { routing } from "@/i18n/routing";
import type { ArticlesResponse } from "@/types/article";

type GetArticlesParams = {
  page?: number;
  sort?: string;
  locale?: string;
};

function buildArticlesQuery(params: GetArticlesParams = {}) {
  return qs.stringify({
    sort: params.sort ? [params.sort] : ["date:desc"],
    populate: {
      image: {
        fields: ["url", "name", "alternativeText"],
      },
    },
    publicationState: "live",
    locale: params.locale ?? routing.defaultLocale,
    pagination: {
      page: params.page ?? 1,
      pageSize: 9,
    },
  });
}

export async function getArticles(
  params: GetArticlesParams = {},
): Promise<ArticlesResponse> {
  const query = buildArticlesQuery(params);

  return fetchStrapi<ArticlesResponse>(`/api/articles?${query}`);
}
