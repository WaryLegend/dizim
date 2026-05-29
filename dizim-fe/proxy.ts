import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // If the user visits the root domain (e.g., example.com/), redirect them to /home
  if (pathname === "/") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // ---------- DEFAULT ----------
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home"],
};
