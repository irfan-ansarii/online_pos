import React from "react";
import { Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import ClearCartDialog from "./ClearCartDialog";
import SaveCartDialog from "./SaveCartDialog";
import SavedCartsDialog from "./SavedCartsDialog";
const CartActions = () => {
  return (
    <div className="grid grid-cols-4 mt-4 -mb-3 border-t-2 border-dashed pt-2 items-center divide-x">
      <div>
        <SaveCartDialog />
      </div>
      <div>
        <SavedCartsDialog />
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="w-full">
              <Settings className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Settings</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <ClearCartDialog />
      </div>
    </div>
  );
};

export default CartActions;
