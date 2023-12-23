import { atom } from "jotai";
import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import Numeral from "numeral";

Numeral.defaultFormat("0,0.00");

interface State {
  open: boolean;
}

// classname
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// jotai state
export const store = atom<State>({
  open: false,
});
