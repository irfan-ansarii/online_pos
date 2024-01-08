"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";

const ClearCartDialog = () => {
  const { watch, reset } = useFormContext();
  const { toast } = useToast();

  const onClick = () => {
    reset();
    localStorage.removeItem("current_cart");
    toast({
      variant: "success",
      description: "Cart items removed.",
    });
  };
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="link"
              className="w-full text-foreground"
              disabled={!watch("lineItems") || watch("lineItems").length < 1}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clear</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove all items
            from the cart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearCartDialog;
