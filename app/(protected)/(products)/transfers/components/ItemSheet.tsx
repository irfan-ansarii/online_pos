"use client";
import React from "react";
import { Transfer, TransferLineItem } from "@prisma/client";
import Numeral from "numeral";
import { useSession } from "@/hooks/useSession";
import {
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { AvatarItem } from "@/components/shared/avatar";
import { Download, Upload } from "lucide-react";

interface Props extends Transfer {
  lineItems: TransferLineItem[];
}
const ItemSheet = ({ transfer }: { transfer: Props }) => {
  const { session } = useSession();

  const isReceived = session?.locationId === transfer.toId;
  return (
    <SheetContent className="md:max-w-lg">
      <div className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="flex">
            <span>Transfer</span>
            <Badge
              variant="secondary"
              className={`py-1 rounded-md ml-auto text-white ${
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
          </SheetTitle>
        </SheetHeader>

        <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
          {transfer.lineItems.map((field: any) => (
            <div
              className="flex rounded-md border p-2 pr-0 items-center snap-start"
              key={field.id}
            >
              <div className="flex gap-3 items-center col-span-2">
                <AvatarItem src={field?.product?.image?.src} />
                <div className="space-y-0.5 truncate">
                  <div className="font-semibold truncate">{field.title}</div>
                  {field.variantTitle && (
                    <Badge className="py-0" variant="secondary">
                      {field.variantTitle}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="ml-auto flex items-center">
                <div className="pr-6">{field.quantity}</div>
              </div>
            </div>
          ))}
        </div>
        <Separator className="h-0.5" />
        <SheetFooter className="pt-2 flex-col">
          <div className="flex">
            <div>Items</div>
            <div className="ml-auto">{transfer.totalItems}</div>
          </div>
          <div className="flex">
            <div>Amount</div>
            <div className="ml-auto">
              {Numeral(transfer.totalAmount).format()}
            </div>
          </div>
        </SheetFooter>
      </div>
    </SheetContent>
  );
};

export default ItemSheet;
