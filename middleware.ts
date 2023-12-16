import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const path = req.nextUrl.pathname;
  const token = req.cookies.get("_auth_token")?.value || "";

  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/recover-password";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${path}`, req.nextUrl)
    );
  }
  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
