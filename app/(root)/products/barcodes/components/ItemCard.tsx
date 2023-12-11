import React from "react";
import Image from "next/image";
import { Image as ImageIcon, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import ItemDialog from "./ItemDialog";

const ItemCard = ({ item }: { item: any }) => {
  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <ItemDialog item={item}>
        <CardContent className="grid grid-cols-3 items-center gap-2">
          <div className="flex gap-3 items-center col-span-2">
            <Avatar className="w-10 h-10 border-2">
              <AvatarImage
                asChild
                src={`/${item?.variant?.product?.image?.src}`}
                className="object-cover"
              >
                <Image
                  src={`/${item?.variant?.product?.image?.src}`}
                  alt={`/${item?.variant?.product?.image?.title}`}
                  width={40}
                  height={40}
                />
              </AvatarImage>
              <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                <ImageIcon className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 truncate">
              <div className="font-semibold truncate">
                {item?.variant?.product?.title}
              </div>
              <div className="flex gap-2 items-end ">
                <Badge variant="secondary" className="py-0">
                  {item?.variant?.title}
                </Badge>
                <Badge variant="secondary" className="py-0">
                  {item?.variant?.sku}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center">
            <div
              className={`pr-6  ${
                item.status === "pending"
                  ? "text-success"
                  : "text-muted-foreground"
              }`}
            >
              <Printer className="w-4 h-4" />
            </div>
            <div>10</div>
          </div>
        </CardContent>
      </ItemDialog>
    </Card>
  );
};

export default ItemCard;
