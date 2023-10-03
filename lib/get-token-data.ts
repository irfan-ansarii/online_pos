import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getTokenData = (request: NextRequest) => {
  try {
    const token = request.cookies.get("_auth_token")?.value || "";

    return jwt.verify(token, process.env.TOKEN_SECRET!);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
