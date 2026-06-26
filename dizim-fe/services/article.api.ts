import qs from "qs";
import { fetchStrapi } from "@/lib/next-api";
import type { ArticleResponse } from "@/types/article";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function getArticles({
  page = 1,
  pageSize = 6,
}: {
  page?: number;
  pageSize?: number;
} = {}): Promise<ArticleResponse> {
  const query = qs.stringify({
    populate: {
      image: {
        fields: ["url", "name", "alternativeText", "width", "height"],
      },
    },
    sort: ["date:desc"],
    pagination: {
      page,
      pageSize,
    },
    locale: "en",
  });

  return fetchStrapi<ArticleResponse>(`${STRAPI_URL}/api/articles?${query}`);
}

export async function getLatestArticles(
  limit = 3,
): Promise<ArticleResponse> {
  return getArticles({ page: 1, pageSize: limit });
}
