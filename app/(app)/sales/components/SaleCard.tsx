import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Actions from "./Actions";

const SaleCard = () => {
  return (
    <Card className="md:irst:rounded-t-none">
      <CardContent className="grid grid-cols-12 gap-4 p-4 items-center">
        <div className="flex flex-col space-y-0.5 col-span-4 sm:col-span-3 lg:col-span-2">
          <div>GN256533</div>
          <div className="text-muted-foreground text-xs">12-04-2024</div>
        </div>

        <div className="gap-2 items-center hidden overflow-hidden sm:flex col-span-3 lg:col-span-3">
          <Avatar className="w-10 h-10 border-2">
            <AvatarImage
              src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
              alt="@shadcn"
            />
            <AvatarFallback className="">CN</AvatarFallback>
          </Avatar>
          <div className="truncate">Employee</div>
        </div>

        <div className="flex flex-col col-span-5 sm:col-span-3 lg:col-span-2">
          <div className="truncate">John Doe</div>
          <div className="truncate text-muted-foreground text-xs">
            9958367688
          </div>
        </div>

        <div className="hidden lg:flex -space-x-2 col-span-2 overflow-hidden">
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

        <div className="flex flex-col col-span-3 sm:col-span-2 text-right">
          <div>4,090.00</div>
          <div>
            <Badge className="uppercase text-xs rounded-md py-0">paid</Badge>
          </div>
        </div>
        <div className="hidden sm:block col-span-2 sm:col-span-1">
          <Actions />
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
