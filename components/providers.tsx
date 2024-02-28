"use client";

import React from "react";

import { AppProgressBar } from "next-nprogress-bar";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { TooltipProvider } from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/toaster";

export function Provider({ children, ...props }: ThemeProviderProps) {
 

  return (
    <>
      <AppProgressBar
        height="2px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <NextThemesProvider {...props}>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </NextThemesProvider>
  </>
  );
}
