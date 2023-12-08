"use client";
import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import Numeral from "numeral";
import { useSession } from "@/hooks/useAuth";
import { Download, Image as ImageIcon, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";

import ItemSheet from "./ItemSheet";
import EditSheet from "./EditSheet";

export interface TransferStatus {
  pending: string;
  completed: string;
  partial: string;
  rejected: string;
  [key: string]: string;
}

const ItemCard = ({ transfer }: { transfer: any }) => {
  const { data: session } = useSession();

  const locationId = React.useMemo(
    () => session?.data?.data?.locationId,
    [session]
  );

  const badge: TransferStatus = {
    pending: "bg-info hover:bg-info",
    completed: "bg-success hover:bg-success",
    partial: "bg-warning hover:bg-warning",
    rejected: "bg-destructive hover:bg-destructive",
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
                  <Avatar
                    className="w-10 h-10 border-2 -ml-2 first:ml-0"
                    key={lineItem.id}
                  >
                    <AvatarImage
                      asChild
                      src={`/${lineItem?.image?.src}`}
                      className="object-cover"
                    >
                      <Image
                        src={`/${lineItem?.image?.src}`}
                        alt={`/${lineItem?.image?.title}`}
                        width={40}
                        height={40}
                      />
                    </AvatarImage>

                    <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div>{Numeral(transfer.totalAmount).format()}</div>
            </div>
            <div className="flex items-center gap-2 justify-end col-span-2 md:col-span-1">
              {transfer.source.id === locationId ? (
                <>
                  <Upload className="w-5 h-5 text-warning" />
                  <span className="capitalize">
                    {transfer.destination.name}
                  </span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 text-success" />
                  <span className="capitalize">{transfer.source.name}</span>
                </>
              )}
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

        {transfer.toId === locationId ? (
          <ItemSheet transfer={transfer} />
        ) : (
          <EditSheet transfer={transfer} />
        )}
      </Sheet>
    </Card>
  );
};

export default ItemCard;
