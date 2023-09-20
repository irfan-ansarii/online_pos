import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const ProceedDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="flex items-center">
        <Button className="w-full">Proceed</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader className="text-left pb-4">
          <DialogTitle className="text-xl">Select Workspace</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
