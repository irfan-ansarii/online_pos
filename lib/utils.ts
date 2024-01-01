import { atom } from "jotai";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import Numeral from "numeral";

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
});
