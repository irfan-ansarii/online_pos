import { atom } from "jotai";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import Numeral from "numeral";
import { CHART_COLORS } from "@/config/app";

Numeral.defaultFormat("0,0.00");

// classname
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// jotai state
export const store = atom<{ [key: string]: Boolean }>({
  open: false,
  storeModal: false,
  newSheet: false,
  sheet: false,
  editSheet: false,
  deleteSheet: false,
  sorting: false,
  filter: false,
});

export const getRandomColor = () => {
  return CHART_COLORS[Math.floor(Math.random() * CHART_COLORS.length)];
};
export const capitalize = (text: string) => {
  if (!text || text.length === 0) return text;

  const words = text.split(" ");

  const capitalized = words.map((word) => {
    const filteredText = word.replace(/[^a-zA-Z]/g, "");

    const firtChar = filteredText.charAt(0).toUpperCase();
    const res = filteredText.slice(1);
    return `${firtChar}${res}`;
  });

  return capitalized.join(" ");
};
