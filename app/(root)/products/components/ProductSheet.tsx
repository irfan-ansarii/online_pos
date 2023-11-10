import React from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
const ProductSheet = ({ title }) => {
  return (
    <SheetContent className="md:max-w-lg">
      <SheetHeader className="md:pb-2">
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>
    </SheetContent>
  );
};

export default ProductSheet;
