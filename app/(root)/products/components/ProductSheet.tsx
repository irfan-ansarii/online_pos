import React from "react";
import { MapPin, Settings2 } from "lucide-react";
import Numeral from "numeral";
import { useProduct } from "@/hooks/useProduct";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import ErrorBox from "@/components/shared/error-box";
import Loading from "./Loading";
import AdjustmentDialog from "./AdjustmentDialog";

const ProductSheet = ({ product }: any) => {
  const { id, title } = product;
  const { data, isLoading, isError, error } = useProduct(id);

  return (
    <SheetContent className="md:max-w-lg">
      <SheetHeader className="md:pb-2">
        <SheetTitle>{title}</SheetTitle>
      </SheetHeader>

      <div className="space-y-2">
        {isLoading && [...Array(4)].map((_, i) => <Loading key={i} />)}

        {isError && (
          <ErrorBox
            className="col-span-1 md:col-span-2 xl:col-span-3"
            title={error?.response?.data?.message}
          />
        )}

        {data?.data.data.variants.map((variant: any) => (
          <div className="rounded-md border overflow-hidden" key={variant.id}>
            <div className="grid grid-cols-4 gap-2 px-4 py-2 items-center bg-accent">
              <div className="font-medium">
                <div>{variant.title}</div>

                <div className="text-xs uppercase text-muted-foreground">
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
              {variant.inventory.map((inventory: any) => (
                <div className="flex py-2 items-center">
                  <div className="text-muted-foreground mr-2">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>{inventory.location.name}</div>
                  <div className="ml-auto flex items-center gap-2">
                    <div>{inventory.stock}</div>

                    <AdjustmentDialog
                      data={{
                        title: product.title,
                        variantTitle: variant.variantTitle,
                        sku: variant.sku,
                        quantity: 1,
                        variantId: Number(variant.id),
                        imageId: Number(product.image.id),
                        locationId: inventory.locationId,
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
    </SheetContent>
  );
};

export default ProductSheet;
