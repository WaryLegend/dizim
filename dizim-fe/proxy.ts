import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "vi"];
const defaultLocale = "en";

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("Accept-Language");
  if (!acceptLanguage) return defaultLocale;

  const preferred = acceptLanguage
    .split(",")
    .map((l) => l.split(";")[0].trim().split("-")[0])
    .find((l) => locales.includes(l));

  return preferred || defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split("/")[1];
  const hasLocale = locales.includes(firstSegment);

  if (!hasLocale) {
    const locale = getPreferredLocale(request);
    const target = `/${locale}${pathname === "/" ? "/home" : pathname}`;
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
