import React from "react";

import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
const SavedCartsDialog = ({
  onOpenChange,
}: {
  onOpenChange: (isOpen: boolean) => void;
}) => {
  return (
    <div className="relative">
      <CardHeader className="p-0">
        <CardTitle className="text-lg">Saved Carts</CardTitle>
        <CardDescription>Click on the button bellow to select.</CardDescription>
      </CardHeader>
      <ScrollArea className="max-h-[60vh]">
        <div className="flex flex-col gap-2 mt-6">
          {["Card", "Razorpay", "Cash", "Paytm"].map((el) => (
            <div
              key={el}
              className="px-4 py-3 h-full justify-between border-2 hover:bg-muted flex items-center relative rounded-md"
              onClick={() => onOpenChange(false)}
            >
              <div className="flex gap-2 items-center">
                <Avatar className="shrink-0 border-2 w-12 h-12 text-muted-foreground">
                  <AvatarFallback>
                    <ShoppingBag className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-left">
                  <div>{el}</div>
                  <div className="text-muted-foreground text-xs font-normal">
                    12-05-2023 12:04 AM
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="font-medium">1,290.00</div>
                <div
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SavedCartsDialog;
