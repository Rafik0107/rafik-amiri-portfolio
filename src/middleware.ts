import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1];
  if (first === "fr" || first === "en") return NextResponse.next();

  // French is the default; English only when the browser clearly prefers it.
  const accept = req.headers.get("accept-language") || "";
  const lang = /^en\b/i.test(accept) && !/fr/i.test(accept.split(",")[0]) ? "en" : "fr";
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|admin|_next|photos|cv|favicon|icon|apple-icon|robots.txt|sitemap.xml|opengraph-image|.*\\.[a-z0-9]+$).*)"],
};
