import React from "react";
import { Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarItem } from "@/components/shared/avatar";
import ItemDialog from "./ItemDialog";
import { format } from "date-fns";

const ItemCard = ({ item }: { item: any }) => {
  const badgeClass: { [key: string]: string } = {
    pending: "bg-warning hover:bg-warning",
    printed: "bg-success hover:bg-success",
    cancelled: "bg-error hover:bg-error",
  };

  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <ItemDialog item={item}>
        <CardContent className="grid grid-cols-5 items-center gap-2">
          <div className="flex gap-3 items-center col-span-3 md:col-span-4">
            <AvatarItem src={item?.product?.image?.src} />
            <div className="space-y-0.5 truncate">
              <div className="font-semibold truncate">
                {item?.product?.title}
              </div>
              <div className="flex gap-2 items-end ">
                <Badge variant="secondary" className="py-0">
                  {item?.variant?.title}
                </Badge>
                <Badge variant="secondary" className="py-0">
                  {item?.variant?.barcode}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-6 col-span-2 md:col-span-1">
            <div className="text-base font-medium">{item.quantity}</div>
            <div className="space-y-0.5">
              <div className="text-xs text-muted-foreground text-right">
                {format(item.updatedAt, "dd-mm-yyyy")}
              </div>
              <Badge
                className={`gap-1 capitalize py-1 rounded-md h-5 text-white ${
                  badgeClass[item.status]
                }`}
                variant="secondary"
              >
                {item.status === "printed" ? (
                  <Printer className="w-3.5 h-3.5" />
                ) : null}

                <span>{item.status}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </ItemDialog>
    </Card>
  );
};

export default ItemCard;
