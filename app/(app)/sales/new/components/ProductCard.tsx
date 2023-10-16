"use client";
import React from "react";
import { Image } from "lucide-react";
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

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={(e) => {
          if (product.type === "simple") e.preventDefault();
        }}
      >
        <Card className="cursor-pointer">
          <CardHeader className="p-0">
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage
                alt="@shadcn"
                className="object-cover object-cover"
              />
              <AvatarFallback className="object-cover text-muted-foreground object-cover aspect-square rounded-t rounded-b-none">
                <Image className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="p-2">
            <CardTitle className="truncate text-sm font-semibold">
              {product.title}
            </CardTitle>
            <CardDescription className="truncate">
              {product.variants[0].salePrice}
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <div className="grid grid-cols-4 gap-4">
          {product.variants.map((variant: any) => (
            <DialogCancel asChild>
              <Button
                key={variant.id}
                variant="outline"
                className="border-2 flex-col p-4 truncate space-y-2 w-full h-full hover:bg-background hover:border-primary"
              >
                <Avatar className="shrink-0 w-12 h-12">
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>

                <div className="space-y-0.5">
                  <div className="truncate">{variant.title}</div>
                  <div className="text-muted-foreground text-xs font-normal">
                    {variant.salePrice}
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
