"use client";
import React from "react";
import { format } from "date-fns";
import Numeral from "numeral";
import { Download, Upload } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";

import { Card, CardContent } from "@/components/ui/card";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";

import ItemSheet from "./ItemSheet";
import { AvatarGroup } from "@/components/shared/avatar";
import { AvatarItem } from "@/components/shared/avatar";

export interface TransferStatus {
  [key: string]: string;
}

const ItemCard = ({ transfer }: { transfer: any }) => {
  const [open, toggle] = useToggle();

  const badge: TransferStatus = {
    pending: "bg-info hover:bg-info",
    completed: "bg-success hover:bg-success",
    cancelled: "bg-destructive hover:bg-destructive",
  };

  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <Sheet open={open} onOpenChange={toggle}>
        <SheetTrigger asChild>
          <CardContent className="grid grid-cols-6 items-center gap-2">
            <div className="flex col-span-3 items-center gap-4">
              <div className="border-r pr-4 text-center w-14 md:w-20 shrink-0">
                <div className="text-lg leading-tight font-semibold">
                  {format(new Date(transfer.createdAt), "dd")}
                </div>
                <div className="leading-tight text-muted-foreground">
                  {format(new Date(transfer.createdAt), "MMM")}
                </div>
              </div>
              <div className="flex truncate">
                <AvatarGroup maxCount={2}>
                  {transfer.lineItems?.map((lineItem: any) => (
                    <AvatarItem
                      src={lineItem?.product?.image?.src}
                      key={lineItem.id}
                    />
                  ))}
                </AvatarGroup>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div>{Numeral(transfer.totalAmount).format()}</div>
            </div>
            <div className="flex items-center gap-2 justify-end col-span-2 md:col-span-1">
              {/* {transfer.toId === session?.locationId ? (
                <Download className="w-5 h-5 text-success" />
              ) : (
                <Upload className="w-5 h-5 text-warning" />
              )} */}
              {/* <span>{destination?.name}</span> */}
            </div>
            <div className="text-right space-y-0.5 ml-auto truncate">
              <Badge
                className={`uppercase rounded-md mb-1 text-white truncate ${
                  badge[transfer.status?.toLowerCase()]
                }`}
                variant="secondary"
              >
                {transfer.status}
              </Badge>
            </div>
          </CardContent>
        </SheetTrigger>

        {open && <ItemSheet transfer={transfer} />}
      </Sheet>
    </Card>
  );
};

export default ItemCard;
