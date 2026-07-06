import type { StrapiMedia } from "./global";

export interface ArticleData {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  category: "Event" | "News" | "Product Update" | "Partnership" | "Tutorial";
  description: string;
  content: unknown;
  image: StrapiMedia | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  data: ArticleData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
