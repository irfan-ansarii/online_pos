import { atom } from "jotai";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import Numeral from "numeral";
import { JwtPayload } from "jsonwebtoken";

Numeral.defaultFormat("0,0.00");

interface State {
  open: boolean;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCookie(name: string) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      const value = cookie.substring(name.length + 1);
      return decodeURIComponent(value);
    }
  }
  return null;
}

export const api = axios.create({
  baseURL: "/api/",
});

export const getSession = async () => {
  const session = (await decodeJwt()) as JwtPayload | undefined;
  console.log("promise", session);
  if (!session) {
    return null;
  }

  return await prisma.user.findUnique({ where: { id: session.id } });
};

export const decodeJwt = async (token) => {
  if (token) {
    return await jwt.verify(token, process.env.TOKEN_SECRET!);
  }

  return null;
};

export const store = atom<State>({
  open: false,
});
