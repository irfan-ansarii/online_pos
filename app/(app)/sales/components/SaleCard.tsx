import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Actions from "./Actions";
const SaleCard = () => {
  return (
    <Card className="md:irst:rounded-t-none">
      <CardContent className="grid grid-cols-12 gap-4 p-4 items-center">
        <div className="flex flex-col space-y-0.5 col-span-2">
          <div>GN256533</div>
          <div className="text-muted-foreground text-xs">12-04-2024</div>
        </div>
        <div className="gap-2 items-center hidden md:flex col-span-2">
          <Avatar className="w-10 h-10 border-2">
            <AvatarImage
              src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
              alt="@shadcn"
            />
            <AvatarFallback className="">CN</AvatarFallback>
          </Avatar>
          <div>Employee</div>
        </div>

        <div className="flex flex-col col-span-2">
          <div>John Doe</div>
          <div>9958367688</div>
        </div>
        <div className="hidden md:flex -space-x-2 col-span-3">
          <Avatar className="w-10 h-10 border-2">
            <AvatarImage
              src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
              alt="@shadcn"
            />
            <AvatarFallback className="">CN</AvatarFallback>
          </Avatar>
          <Avatar className="w-10 h-10 border-2">
            <AvatarImage
              src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
              alt="@shadcn"
            />
            <AvatarFallback className="">CN</AvatarFallback>
          </Avatar>
          <Avatar className="w-10 h-10">
            <AvatarFallback className="">+4</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col col-span-2">
          <div>Total</div>
          <div>
            <Badge className="uppercase text-xs rounded-md py-0.5">paid</Badge>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <Actions />
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
