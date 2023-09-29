import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { Palette } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Customizer = () => {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger className="w-full flex justify-center items-center rounded-lg bg-secondary h-[44px]">
            <Palette className="w-5 h-5" />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Theme</TooltipContent>
      </Tooltip>
      <PopoverContent>
        <ThemeCustomizer />
      </PopoverContent>
    </Popover>
  );
};

export default Customizer;
