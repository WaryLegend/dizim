const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchStrapi<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const fullUrl = url.startsWith("http") ? url : `${STRAPI_URL}${url}`;

  const res = await fetch(fullUrl, {
    headers: { "Content-Type": "application/json" },
    ...options,
    next: { revalidate: 0, ...(options?.next as Record<string, unknown>) },
  });

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
