import React from "react";
import { format } from "date-fns";
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
      <CardContent className="grid grid-cols-6 items-center gap-2">
        <div className="flex gap-3 items-center col-span-5 md:col-span-4">
          <div className="border-r pr-4 text-center shrink-0">
            <div className="text-lg leading-tight font-semibold">
              {format(adjustment.createdAt, "dd")}
            </div>
            <div className="leading-tight text-xs text-muted-foreground">
              {format(adjustment.createdAt, "MMM yy")}
            </div>
          </div>
          <AvatarItem src={adjustment?.product?.image?.src} />
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

        <div
          className={`font-medium text-base text-right ${
            adjustment.quantity > 0 ? "text-success" : "text-destructive"
          }`}
        >
          {adjustment.quantity > 0
            ? `+${adjustment.quantity}`
            : adjustment.quantity}
        </div>

        <div className="text-right hidden md:block">
          <Badge
            variant="secondary"
            className="rounded-md gap-2 py-1 items-end"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground " />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-normal">{adjustment.notes}</p>
              </TooltipContent>
            </Tooltip>
            <span className="capitalize">{adjustment.reason}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
