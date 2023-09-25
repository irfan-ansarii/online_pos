import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import ProductCard from "./ProductCard";

const ProductSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <ProductCard />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you sure absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
          <ProductCard />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ProductSheet;
