"use client";

import * as React from "react";

import { useTheme as useNextTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { Check } from "lucide-react";
import { themes } from "@/components/theme/themes";
import { THEMES } from "@/lib/CONSTANTS";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeCustomizer() {
  const [config, setConfig] = useTheme();
  const { resolvedTheme: mode } = useNextTheme();

  return (
    <div className="grid grid-cols-6 gap-1">
      {THEMES.map((color, key) => {
        const theme = themes.find((theme) => theme.name === color);
        const isActive = config.theme === color;

        if (!theme) {
          return null;
        }

        return (
          <div
            className="flex items-center justify-center w-full h-full"
            key={color + key}
          >
            <Tooltip key={theme.name}>
              <TooltipTrigger asChild>
                <button
                  onClick={() =>
                    setConfig({
                      ...config,
                      theme: theme.name,
                    })
                  }
                  className={cn(
                    "flex h-8 w-8 hover:z-10 shadow items-center border-2  justify-center rounded-full  text-xs ",
                    isActive ? "border-[--theme-primary] z-10" : ""
                  )}
                  style={
                    {
                      "--theme-primary": `hsl(${
                        theme?.activeColor[mode === "dark" ? "dark" : "light"]
                      })`,
                    } as React.CSSProperties
                  }
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]"
                    )}
                  >
                    {isActive && <Check className="h-4 w-4 text-white" />}
                  </span>

                  <span className="sr-only">{theme.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                align="center"
                className="rounded bg-zinc-900 text-zinc-50"
              >
                {theme.label}
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
