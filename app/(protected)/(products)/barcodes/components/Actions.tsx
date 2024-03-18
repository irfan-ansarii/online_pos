"use client";
import React from "react";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { printBarcode } from "@/actions/labels/generate-barcodes";
import { toast } from "@/components/ui/use-toast";
const Actions = () => {
  const [disabled, setDisabled] = React.useState(false);

  const create = async () => {
    if (disabled) return;
    try {
      const response = await printBarcode();
      window.open(response, "_blank");
    } catch (error: any) {
      setDisabled(true);
      toast({
        variant: "info",
        title: error.message,
      });
    }
  };
  return (
    <>
      <Button variant="secondary" onClick={create} disabled={disabled}>
        <Printer className="w-4 h-4 mr-2" />
        Print
      </Button>
    </>
  );
};

export default Actions;
