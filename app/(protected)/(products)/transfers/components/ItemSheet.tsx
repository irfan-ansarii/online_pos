"use client";
import React from "react";

import Numeral from "numeral";

import { useAuthContext } from "@/hooks/useAuthContext";

import {
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { AvatarItem } from "@/components/shared/avatar";
import { Label } from "@/components/ui/label";

const ItemSheet = ({ transfer }: { transfer: any }) => {
  const { session } = useAuthContext();

  return (
    <SheetContent className="md:max-w-lg">
      <div className="flex flex-col h-full">
        {/* {(isLoading || isUpdating) && (
          <div className="absolute w-full h-full top-0 left-0 z-20"></div>
        )} */}
        <SheetHeader className="md:pb-2">
          <SheetTitle>Transfer</SheetTitle>
        </SheetHeader>

        <div className="pb-4 space-y-1.5">
          <Label>
            {session.locationId === transfer.fromId ? "Destination" : "Source"}
          </Label>
          {/* <Select defaultValue={`${destination.id}`}>
            <SelectTrigger>
              <SelectValue placeholder="Select Destination" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={`${destination.id}`}>
                {destination?.name}
              </SelectItem>
            </SelectContent>
          </Select> */}
        </div>

        <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
          {transfer.lineItems.map((field: any) => (
            <div
              className="flex rounded-md border p-2 pr-0 items-center snap-start"
              key={field.id}
            >
              <div className="flex gap-3 items-center col-span-2">
                <AvatarItem src={`/${field.product.image.src}`} />
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
