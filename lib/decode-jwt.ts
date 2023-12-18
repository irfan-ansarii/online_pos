import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  status: string;
  iat: number;
  exp: number;
}

export const decodeJwt = (request: NextRequest) => {
  try {
    const token = request.cookies.get("_auth_token")?.value;
    if (token) {
      return jwt.verify(token, process.env.TOKEN_SECRET!);
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
