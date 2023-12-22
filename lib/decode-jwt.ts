"use server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  status: string;
  iat: number;
  exp: number;
}
