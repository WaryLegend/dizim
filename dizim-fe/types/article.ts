import type { StrapiMedia } from "./global";

export interface ArticleData {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  category: "Event" | "News" | "Product Update" | "Partnership" | "Tutorial";
  description: string;
  image: StrapiMedia | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ArticleResponse {
  data: ArticleData[];
  meta: {
    pagination: StrapiPagination;
  };
}
