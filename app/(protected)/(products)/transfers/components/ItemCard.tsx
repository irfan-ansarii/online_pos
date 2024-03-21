"use client";
import React from "react";
import { format } from "date-fns";
import Numeral from "numeral";
import { Download, Upload } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent } from "@/components/ui/card";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";

import ItemSheet from "./ItemSheet";
import { AvatarGroup } from "@/components/shared/avatar";
import { AvatarItem } from "@/components/shared/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export interface TransferStatus {
  [key: string]: string;
}

const ItemCard = ({ transfer }: { transfer: any }) => {
  const [open, toggle] = useToggle();
  const { session } = useSession();

  const isReceived = session?.locationId === transfer.toId;

  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <Sheet open={open} onOpenChange={toggle}>
        <SheetTrigger asChild>
          <CardContent className="grid grid-cols-6 items-center gap-2">
            <div className="flex col-span-4 items-center gap-4">
              <div className="border-r pr-4 text-center shrink-0">
                <div className="text-lg leading-tight font-semibold">
                  {format(transfer.createdAt, "dd")}
                </div>
                <div className="leading-tight text-xs text-muted-foreground">
                  {format(transfer.createdAt, "MMM yy")}
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
            <div className="text-right">
              <div>{Numeral(transfer.totalAmount).format()}</div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              {!session?.locationId ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                <Badge
                  variant="secondary"
                  className={`py-1 rounded-md text-white ${
                    isReceived ? "bg-success" : "bg-warning"
                  }`}
                >
                  {isReceived ? (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Received
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Sent
                    </>
                  )}
                </Badge>
              )}
            </div>
          </CardContent>
        </SheetTrigger>

        {open && <ItemSheet transfer={transfer} />}
      </Sheet>
    </Card>
  );
};

export default ItemCard;
