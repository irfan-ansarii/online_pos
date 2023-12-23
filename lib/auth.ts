"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const auth = () => {
  const token = cookies().get("_auth_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decoded;
  } catch (error) {
    return null;
  }
};
