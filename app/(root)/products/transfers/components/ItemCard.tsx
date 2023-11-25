"use client";
import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";

import ItemSheet from "./ItemSheet";

const ItemCard = () => {
  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <Sheet>
        <SheetTrigger asChild>
          <CardContent className="grid grid-cols-5 items-center gap-2">
            <div className="flex col-span-3 items-center gap-4">
              <div className="border-r pr-4 text-center w-20">
                <div className="text-2xl leading-tight font-semibold">12</div>
                <div className="text-lg leading-tight font-medium text-muted-foreground">
                  Aug
                </div>
              </div>
              <div className="flex">
                <Avatar className="w-10 h-10 border-2">
                  <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10 border-2 -ml-2">
                  <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <Avatar className="w-10 h-10 border-2 -ml-2">
                  <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                    <ImageIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="text-right">
              <div>12,9045.00</div>
            </div>
            <div className="text-right space-y-0.5 ml-auto">
              <Badge className="uppercase rounded-md mb-1" variant="secondary">
                Sent
              </Badge>
            </div>
          </CardContent>
        </SheetTrigger>
        <ItemSheet product={{}} />
      </Sheet>
    </Card>
  );
};

export default ItemCard;
