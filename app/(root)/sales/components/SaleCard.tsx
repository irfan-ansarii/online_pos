import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { User } from "lucide-react";
const SaleCard = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-12 gap-3 items-center">
        <div className="flex gap-3 col-span-8 md:col-span-6 lg:col-span-7">
          <div className="md:border-r pr-4 md:text-center w-20 shrink-0">
            <div className="text-lg leading-tight font-semibold">02</div>
            <div className="leading-tight text-muted-foreground">Dec 23</div>
          </div>
          <div className="flex -space-x-2 truncate">
            {[...Array(4)].map((e, i) => (
              <Avatar className="w-10 h-10 border-2" key={i}>
                <AvatarImage
                  src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
                  alt="@shadcn"
                />
                <AvatarFallback className="">CN</AvatarFallback>
              </Avatar>
            ))}
            <Avatar className="w-10 h-10 border-2">
              <AvatarFallback className="">+8</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="col-span-4 text-right md:text-left md:col-span-2 space-y-0.5">
          <div className="font-medium">GN256533</div>
          <div className="text-muted-foreground text-xs font-medium">
            Customer
          </div>
        </div>

        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <Badge
            className="justify-between w-full uppercase p-0 pr-3"
            variant="secondary"
          >
            <Badge className="pl-1 gap-1 mr-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-foreground">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="truncate leading-tight">John Doe</div>
            </Badge>

            <div className="flex justify-between w-2/5">
              <span className="inline-flex gap-2">cash</span>
              <span>20,201.00</span>
            </div>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
