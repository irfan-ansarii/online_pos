import React from "react";
import {
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
const ClearCartDialog = () => {
  const { toast } = useToast();

  const onClick = () => {
    localStorage.removeItem("current");
    toast({
      variant: "success",
      description: "Removed card items.",
    });
  };
  return (
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
  );
};

export default ClearCartDialog;
