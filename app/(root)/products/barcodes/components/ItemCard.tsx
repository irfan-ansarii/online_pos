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
          <CardContent className="grid grid-cols-2 items-center gap-2">
            <div className="flex gap-3 items-center">
              <Avatar className="w-10 h-10 border-2">
                <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                  <ImageIcon className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 truncate">
                <div className="font-semibold truncate">
                  Lorem, ipsum dolor.
                </div>
                <div className="text-muted-foreground text-xs">
                  Lorem ipsum dolor sit amet.
                </div>
              </div>
            </div>

            <div className="text-right">10</div>
          </CardContent>
        </SheetTrigger>
        <ItemSheet product={{}} />
      </Sheet>
    </Card>
  );
};

export default ItemCard;
