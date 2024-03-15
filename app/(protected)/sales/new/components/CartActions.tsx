import React from "react";
import { CalendarDays } from "lucide-react";
import format from "date-fns/format";

import { useToggle } from "@uidotdev/usehooks";
import { useFormContext } from "react-hook-form";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import ClearCartDialog from "./ClearCartDialog";
import SaveCartDialog from "./SaveCartDialog";
import SavedCartsDialog from "./SavedCartsDialog";

const CartActions = () => {
  const [open, toggle] = useToggle(false);
  const form = useFormContext();

  return (
    <div className="grid grid-cols-4 mt-4  border-t-2 border-dashed pt-2 items-center divide-x">
      <div>
        <SaveCartDialog />
      </div>
      <div>
        <SavedCartsDialog />
      </div>
      <div>
        <Tooltip>
          <Popover open={open} onOpenChange={toggle}>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="link" className="w-full text-foreground">
                  <CalendarDays className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent>
              {format(new Date(form.watch("createdAt")), "dd-MM-yyyy")}
            </TooltipContent>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                initialFocus
                selected={new Date(form.watch("createdAt"))}
                onSelect={(value) => {
                  form.setValue("createdAt", new Date(value!).toISOString());
                  toggle();
                }}
              />
            </PopoverContent>
          </Popover>
        </Tooltip>
      </div>
      <div>
        <ClearCartDialog />
      </div>
    </div>
  );
};

export default CartActions;
