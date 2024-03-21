import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import ThemeSwitcher from "@/components/global/sidebar/theme-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const Setting = () => {
  return (
    <Popover>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <Settings className="w-5 h-5" />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Customize</TooltipContent>
      </Tooltip>
      <PopoverContent className="space-y-6">
        <div className="space-y-1 pr-2">
          <div className="font-semibold leading-none tracking-tight">
            Customize
          </div>
          <div className="text-xs text-muted-foreground">
            Pick a style and color for application.
          </div>
        </div>
        <ThemeSwitcher className="!px-0" />
        <div>
          <span className="mb-2 inline-block text-xs text-muted-foreground">
            Theme
          </span>
          <ThemeCustomizer />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Setting;
