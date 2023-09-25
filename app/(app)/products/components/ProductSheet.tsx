import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ProductCard from "./ProductCard";

const ProductSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <ProductCard />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Product</SheetTitle>
        </SheetHeader>
        {/* <SheetDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </SheetDescription> */}
        {/* <ProductCard /> */}
        <div className="divide-y">
          <div className="border-b">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/avatars/01.png" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    Lorem, ipsum dolor.
                  </p>
                  <p className="text-sm text-muted-foreground">GN36345</p>
                </div>
              </div>
              <div>1290.00</div>
            </div>

            <div className="flex justify-between py-1">
              <div>location</div>
              <div>Qty</div>
            </div>
            <div className="flex justify-between py-1">
              <div>location</div>
              <div>Qty</div>
            </div>
            <div className="flex justify-between py-1">
              <div>location</div>
              <div>Qty</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductSheet;
