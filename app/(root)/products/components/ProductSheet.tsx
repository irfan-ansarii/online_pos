import React from "react";
import { MapPin, Settings2 } from "lucide-react";
import Numeral from "numeral";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import AdjustmentDialog from "./AdjustmentDialog";

const ProductSheet = ({ product }: any) => {
  const { title, variants } = product;

  return (
    <SheetContent className="md:max-w-lg">
      <div className="flex flex-col h-full">
        <SheetHeader className="md:pb-2">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <div className="relative flex-1 max-h-full overflow-y-auto scrollbox -mx-6">
          {variants?.map((variant: any) => (
            <div className="overflow-hidden border-b" key={variant.id}>
              <div className="grid grid-cols-4 gap-2 px-6 py-2 items-center bg-accent">
                <div className="font-medium">
                  <div>{variant.title}</div>
                  <Badge className="py-0" variant="secondary">
                    {variant.barcode}
                  </Badge>
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

              <div className="divide-y px-6">
                {variant?.inventory?.map((inventory: any) => (
                  <div className="flex py-2 items-center">
                    <div className="text-muted-foreground mr-2">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>{inventory.location.name}</div>
                    <div className="ml-auto flex items-center gap-2">
                      <div>{inventory.stock}</div>

                      <AdjustmentDialog
                        data={{
                          productId: product.id,
                          variantId: variant.id,
                          locationId: inventory.locationId,
                          quantity: 1,

                          // optional fields
                          title: product.title,
                          variantTitle: variant.title,
                          barcode: variant.barcode,
                          imageSrc: product.image.src,
                        }}
                      >
                        <Button size="sm" variant="secondary">
                          <Settings2 className="w-4 h-4" />
                        </Button>
                      </AdjustmentDialog>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SheetContent>
  );
};

export default ProductSheet;
