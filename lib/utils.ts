import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import Numeral from "numeral";
import { decodeJwt } from "./decode-jwt";
import { JwtPayload } from "jsonwebtoken";

Numeral.defaultFormat("0,0.00");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

export const api = axios.create({
  baseURL: "/api/",
});

type DataItem = Record<string, any>;

export const sanitizeOutput = (
  data: DataItem | DataItem[],
  keys: string[]
): DataItem | DataItem[] => {
  const sanitizeItem = (item: DataItem) => {
    const { ...copy } = item;
    keys.forEach((key) => {
      delete copy[key];
    });
    return copy;
  };

  if (Array.isArray(data)) {
    return data.map(sanitizeItem);
  }

  return sanitizeItem(data);
};

export const getSession = async (req: NextRequest) => {
  const session = decodeJwt(req) as JwtPayload | undefined;

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  return user;
};
