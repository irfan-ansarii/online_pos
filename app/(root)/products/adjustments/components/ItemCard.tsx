"use client";
import React from "react";
import { Image as ImageIcon, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ItemCard = () => {
  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <CardContent className="grid grid-cols-3 items-center gap-2">
        <div className="flex gap-3 col-span-2 items-center col-span-2">
          <div className="border-r pr-4 text-center w-14 md:w-20 shrink-0">
            <div className="text-lg leading-tight font-semibold">02</div>
            <div className="leading-tight text-muted-foreground">Dec</div>
          </div>
          <Avatar className="w-10 h-10 border-2">
            <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
              <ImageIcon className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5 truncate">
            <div className="font-semibold truncate">Lorem, ipsum dolor.</div>
            <div className="text-muted-foreground text-xs">
              Lorem ipsum dolor sit amet.
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-5 h-5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>

          <div>12</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
