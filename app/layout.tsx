import "./globals.css";
import "simplebar-react/dist/simplebar.min.css";
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
  description: "Inventory Managemen",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
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
