"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const auth = async () => {
  const token = cookies().get("_auth_token")?.value;
  if (!token) return null;
  try {
    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET!);
    if (typeof decoded === "string") return null;
    return decoded;
  } catch (error) {
    return null;
  }
};
