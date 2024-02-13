import { NextResponse, NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/recover-password" ||
    path === "/";

  const session = await auth();

  // if (!isPublicPath && !session) {
  //   return NextResponse.redirect(new URL(`/login?`, req.nextUrl));
  // }

  return res;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
