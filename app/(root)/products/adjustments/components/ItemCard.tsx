"use client";
import React from "react";
import { Image as ImageIcon, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";

import ItemSheet from "./ItemSheet";
import { Button } from "@/components/ui/button";

const ItemCard = () => {
  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <Sheet>
        <SheetTrigger asChild>
          <CardContent className="grid grid-cols-3 items-center gap-2">
            <div className="flex gap-3 items-center col-span-2">
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
      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <Button variant="secondary" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default ItemCard;
