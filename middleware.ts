// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Extracting the page name from the pathname
  // For example, /about would give "about", /products/[id] would give "products"
  const pageName = pathname; //.split("/")[1] || "home";
  console.log(JSON.stringify(url, null, 2));
  // Adding the page name to the request headers
  req.headers.set("x-page-name", pageName);
  console.log(pageName);
  return NextResponse.next();
}

// Specify the paths where you want to run this middleware
export const config = {
  matcher: "/studio/:path*",
};
