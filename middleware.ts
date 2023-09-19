import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });
  const path = req.nextUrl.pathname;
  console.log("path middleware: ", path);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("user middleware:", user);

  return res;
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
