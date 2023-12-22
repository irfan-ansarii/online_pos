import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, JwtPayload } from "@/lib/decode-jwt";
import prisma from "@/lib/prisma";
import { sanitize } from "@/lib/sanitize-user";

export async function GET(req: NextRequest) {
  try {
    const session = decodeJwt(req) as JwtPayload | undefined;

    if (!session) {
      const response = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
      await response.cookies.set("_auth_token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return response;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      include: {
        location: true,
      },
    });

    return NextResponse.json({ data: sanitize(user) }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
