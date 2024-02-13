"use client";

import React from "react";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { TooltipProvider } from "@/components/ui/tooltip";

import { Toaster } from "@/components/ui/toaster";

export function Provider({ children, ...props }: ThemeProviderProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressBar
        height="2px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <NextThemesProvider {...props}>
        <Toaster />
        <TooltipProvider>{children}</TooltipProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
