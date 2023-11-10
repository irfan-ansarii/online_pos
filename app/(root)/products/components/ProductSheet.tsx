import React from "react";
import { MapPin, Settings2 } from "lucide-react";
import Numeral from "numeral";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const ProductSheet = ({ product }) => {
  const { id, title, variants } = product;

  return (
    <SheetContent className="md:max-w-lg">
      <SheetHeader className="md:pb-2">
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>

      <div className="space-y-4">
        {variants.map((variant) => (
          <div className="rounded-md border overflow-hidden" key={variant.id}>
            <div className="grid grid-cols-4 gap-2 px-4 py-2 items-center bg-accent">
              <div className="space-y-1 font-medium">
                <div>{variant.title}</div>
                <div className="text-muted-foreground text-xs">
                  {variant.sku}
                </div>
              </div>
              <div className="text-right">
                {Numeral(variant.purchasePrice).format()}
              </div>
              <div className="text-right">
                {Numeral(variant.salePrice).format()}
              </div>
              <div className="text-right">
                {Numeral(variant.taxRate / 100).format("0%")}
              </div>
            </div>

            <div className="divide-y px-2">
              <div className="flex py-2 items-center">
                <div className="text-muted-foreground mr-2">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>location</div>
                <div className="ml-auto flex items-center gap-2">
                  <div>10</div>
                  <Button size="sm" variant="secondary">
                    <Settings2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SheetContent>
  );
};

export default ProductSheet;
