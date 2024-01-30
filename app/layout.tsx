import "./globals.css";

import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

import { Provider } from "@/components/providers";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Inventory Management",
    template: `%s - Goldy's Nestt`,
  },
  description: "Inventory Management",

  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ overflow: "visible !important", height: "100%" }}
    >
      <body
        className={cn(
          "min-h-screen bg-background antialiased text-sm !overflow-auto",
          inter.className
        )}
      >
        <NextTopLoader />
        <Provider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Provider>
        <ThemeSwitcher />
      </body>
    </html>
  );
}
