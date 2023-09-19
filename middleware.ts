import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  //const supabase = createMiddlewareClient({ req, res });
  const path = req.nextUrl.pathname;

  return res;
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
