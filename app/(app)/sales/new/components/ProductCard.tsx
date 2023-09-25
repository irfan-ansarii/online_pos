"use client";
import React from "react";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogCancel,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
const ProductCard = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer">
          <CardHeader className="p-0">
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage
                alt="@shadcn"
                className="object-cover object-cover"
              />
              <AvatarFallback className="object-cover object-cover aspect-square rounded-t rounded-b-none">
                CN
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="p-2">
            <CardTitle className="truncate text-sm font-semibold">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Necessitatibus, aspernatur.
            </CardTitle>
            <CardDescription className="truncate">1,829.00</CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <div className="grid grid-cols-4 gap-4">
          {["Card 38fdhj fgdhghfg", "Razorpay", "Cash", "Paytm"].map((el) => (
            <DialogCancel asChild>
              <Button
                key={el}
                variant="outline"
                className="border-2 flex-col p-4 truncate space-y-2 w-full h-full hover:bg-background hover:border-primary"
              >
                <Avatar className="shrink-0 w-12 h-12">
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>

                <div className="space-y-0.5">
                  <div className="truncate">{el}</div>
                  <div className="text-muted-foreground text-xs font-normal">
                    1,290.00
                  </div>
                </div>
              </Button>
            </DialogCancel>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
