import React from "react";

import { Button } from "@/components/ui/button";
import { Trash2, Bookmark } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SavedCartsDialog = () => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full">
              <Bookmark className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Saved cart</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg">Saved Carts</DialogTitle>
          <DialogDescription>
            Click on the button bellow to select.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col justify-center divide-y border-y">
            {["Card", "Razorpay", "Cash", "Paytm"].map((el) => (
              <div
                key={el}
                className="py-3 h-full justify-between flex items-center relative cursor-pointer"
              >
                <div className="space-y-1 text-left">
                  <div>{el}</div>
                  <div className="text-muted-foreground text-xs font-normal">
                    12-05-2023 12:04 AM
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="font-medium">1,290.00</div>
                  <Button
                    className="text-destructive"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SavedCartsDialog;
