import React from "react";
import Image from "next/image";
import { Check, Image as ImageIcon, X } from "lucide-react";
import Numeral from "numeral";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const ProductSheet = ({ transfer }: any) => {
  return (
    <SheetContent className="md:max-w-lg">
      <SheetHeader className="md:pb-2">
        <SheetTitle>Transfer</SheetTitle>
      </SheetHeader>

      <div className="space-y-4">
        <Badge
          variant="secondary"
          className="block rounded-md p-3 capitalize text-sm"
        >
          werehouse
        </Badge>
        <div>
          <div className="mb-3">
            <Input placeholder="Search..." />
          </div>

          <div className="relative grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
            {transfer.lineItems.map((item, i) => (
              <div
                className="flex rounded-md border p-2 items-center snap-start"
                key={i}
              >
                <div className="flex gap-3 items-center col-span-2">
                  <Avatar className="w-10 h-10 border-2">
                    <AvatarImage
                      asChild
                      src={`/${item?.image}`}
                      className="object-cover"
                    >
                      <Image
                        src={`/${item?.image}`}
                        alt={`/${item?.image}`}
                        width={40}
                        height={40}
                      />
                    </AvatarImage>
                    <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                      <ImageIcon className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5 truncate">
                    <div className="font-semibold truncate">{item?.title}</div>
                    {item?.variantTitle && (
                      <Badge className="py-.5" variant="secondary">
                        {item?.variantTitle}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="ml-auto ">{item?.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SheetContent>
  );
};

export default ProductSheet;
