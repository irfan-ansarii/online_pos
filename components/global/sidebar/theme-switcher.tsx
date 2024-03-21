"use client";
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  return (
    <ul className="flex flex-col gap-3">
      <li className="rounded-md overflow-hidden hidden md:block lg:hidden">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-[44px] md:w-full flex justify-center h-[44px] bg-secondary"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Dark Mode</TooltipContent>
        </Tooltip>
      </li>
      <li className="rounded-md overflow-hidden md:hidden lg:block">
        <Label
          htmlFor="dark-mode"
          className={`text-foreground transition duration-500 text-sm font-medium flex items-center space-x-2 justify-between cursor-pointer py-2.5 ${className}`}
        >
          <div className="flex gap-3 relative items-center">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            Dark Mode
          </div>
          <Switch
            id="dark-mode"
            checked={theme === "dark"}
            onCheckedChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          />
        </Label>
      </li>
    </ul>
  );
};

export default ThemeSwitcher;
