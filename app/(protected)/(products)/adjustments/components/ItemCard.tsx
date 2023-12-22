import React from "react";
import { Adjustment, Product, Variant, File } from "@prisma/client";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { AvatarItem } from "@/components/shared/avatar";

interface Props extends Adjustment {
  product: Product & { image: File };
  variant: Variant;
}
const ItemCard = ({ adjustment }: { adjustment: Props }) => {
  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <CardContent className="grid grid-cols-3 items-center gap-2">
        <div className="flex gap-3 items-center col-span-2">
          <div className="border-r pr-4 text-center w-14 md:w-20 shrink-0">
            <div className="text-lg leading-tight font-semibold">02</div>
            <div className="leading-tight text-muted-foreground">Dec</div>
          </div>
          <AvatarItem src={`/${adjustment?.product?.image?.src}`} />
          <div className="space-y-0.5 truncate">
            <div className="font-semibold truncate">
              {adjustment.product.title}
            </div>
            <div className="flex gap-2">
              {adjustment.variant.title && (
                <Badge className="py-0" variant="secondary">
                  {adjustment.variant.title}
                </Badge>
              )}
              <Badge className="py-0" variant="secondary">
                {adjustment.variant.barcode}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-6">
          <Badge
            variant="secondary"
            className="rounded-md gap-2 py-1 hidden md:inline-flex"
          >
            <span className="uppercase">{adjustment.reason}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground " />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-normal">{adjustment.notes}</p>
              </TooltipContent>
            </Tooltip>
          </Badge>

          <div
            className={`font-medium text-base ml-auto ${
              adjustment.quantity > 0 ? "text-success" : "text-destructive"
            }`}
          >
            {adjustment.quantity > 0
              ? `+${adjustment.quantity}`
              : adjustment.quantity}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
