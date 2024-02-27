import { NextResponse, NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const params = req.nextUrl.search;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/recover-password" ||
    path === "/";

  const session = await auth();

  // if (!isPublicPath && !session) {
  //   return NextResponse.redirect(new URL(`/login?`, req.nextUrl));
  // }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);
  requestHeaders.set("x-params", params);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
