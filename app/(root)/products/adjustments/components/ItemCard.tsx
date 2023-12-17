import React from "react";
import Image from "next/image";
import { Image as ImageIcon, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { AvatarItem } from "@/components/shared/avatar";

const ItemCard = ({ adjustment }: any) => {
  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <CardContent className="grid grid-cols-3 items-center gap-2">
        <div className="flex gap-3 col-span-2 items-center col-span-2">
          <div className="border-r pr-4 text-center w-14 md:w-20 shrink-0">
            <div className="text-lg leading-tight font-semibold">02</div>
            <div className="leading-tight text-muted-foreground">Dec</div>
          </div>
          <AvatarItem src={`/${adjustment?.image?.src}`} />
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

        <div className="flex justify-end gap-6">
          <span>{adjustment.reason}</span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-5 h-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{adjustment.reason}</p>
            </TooltipContent>
          </Tooltip>

          <div>{adjustment.quantity}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
