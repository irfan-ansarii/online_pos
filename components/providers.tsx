"use client";

import React from "react";

import NextTopLoader from "nextjs-toploader";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthContextProvider } from "@/hooks/useAuthContext";
import { Toaster } from "@/components/ui/toaster";

export function Provider({ children, ...props }: ThemeProviderProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#da2576" />
      <AuthContextProvider>
        <NextThemesProvider {...props}>
          <Toaster />
          <TooltipProvider>{children}</TooltipProvider>
        </NextThemesProvider>
      </AuthContextProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
