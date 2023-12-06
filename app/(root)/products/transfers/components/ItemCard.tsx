"use client";
import React from "react";
import { format } from "date-fns";
import Numeral from "numeral";

import { Prisma } from "@prisma/client";
import { Image as ImageIcon, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";

import ItemSheet from "./ItemSheet";

interface TransferStatus {
  pending: string;
  completed: string;
  dispute: string;
  [key: string]: string;
}

const ItemCard = ({ transfer }: { transfer: any }) => {
  const badge: TransferStatus = {
    pending: "bg-warning hover:bg-warning",
    completed: "bg-success hover:bg-success",
    dispute: "bg-destructive hover:bg-destructive",
  };

  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <Sheet>
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
                {transfer.lineItems?.map((lineItem: any) => (
                  <Avatar className="w-10 h-10 border-2 -ml-2 first:ml-0">
                    <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div>{Numeral(transfer.totalAmount).format()}</div>
            </div>
            <div className="flex justify-end">
              <Upload className="w-5 h-5 rotate-90 text-warning" />
            </div>
            <div className="text-right space-y-0.5 ml-auto">
              <Badge
                className={`uppercase rounded-md mb-1 text-primary-foreground ${
                  badge[transfer.status?.toLowerCase()]
                }`}
                variant="secondary"
              >
                {transfer.status}
              </Badge>
            </div>
          </CardContent>
        </SheetTrigger>
        <ItemSheet transfer={transfer} />
      </Sheet>
    </Card>
  );
};

export default ItemCard;
