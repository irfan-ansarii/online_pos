"use client";
import React from "react";
import format from "date-fns/format";
import Numeral from "numeral";

import { Trash2, Bookmark } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useToggle, useLocalStorage } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";

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
import { Button } from "@/components/ui/button";

const SavedCartsDialog = () => {
  const form = useFormContext();
  const { toast } = useToast();
  const [open, toggle] = useToggle(false);
  const [savedCarts, saveCart] = useLocalStorage("carts", JSON.stringify([]));

  const jsonCarts = JSON.parse(savedCarts);

  // handle delete
  const onDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const { name, total, lineItems } = jsonCarts[index];
    if (name === "current" && (total > 0 || lineItems.length > 0)) {
      toast({
        variant: "error",
        title: "Cannot delete",
      });
      return;
    }
    jsonCarts.splice(index, 1);
    toast({
      variant: "success",
      title: "Cart removed successfully!",
    });
    saveCart(JSON.stringify(jsonCarts));
  };

  // handle select
  const onSelect = (e: React.MouseEvent, index: number) => {
    const selected = jsonCarts.splice(index, 1);
    saveCart(JSON.stringify(jsonCarts));

    // set form context to
    // form.setValue('');

    toggle();
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="w-full text-foreground"
              disabled={!jsonCarts || jsonCarts.length < 1}
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Saved</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="h-[60vh] flex flex-col gap-0">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Manage saved carts</DialogTitle>
          <DialogDescription>
            Select or remove an item form the list bellow.
          </DialogDescription>
        </DialogHeader>

        {jsonCarts && jsonCarts.length > 0 ? (
          <div className="flex-1 overflow-y-auto scrollbox h-[21rem]">
            {jsonCarts.map(
              (
                item: { name: string; createdAt: string; total: string },
                i: number
              ) => (
                <div
                  key={`item${i}`}
                  className="py-3 border-b justify-between flex items-center relative cursor-pointer"
                  onClick={(e) => onSelect(e, i)}
                >
                  <div className="space-y-1 text-left">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground text-xs font-normal">
                      {format(
                        new Date(item.createdAt),
                        "dd-MM-yyyy hh:mm:ss a"
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="font-medium">
                      {Numeral(item.total).format()}
                    </div>
                    <Button
                      className="text-destructive"
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        onDelete(e, i);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="grow flex flex-col items-center justify-center text-muted-foreground">
            Saved carts will appear here!
          </div>
        )}
        <Button
          className="w-full mt-2"
          variant="secondary"
          onClick={() => toggle()}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SavedCartsDialog;
