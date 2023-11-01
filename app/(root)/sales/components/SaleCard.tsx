import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { User } from "lucide-react";
const SaleCard = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-6 gap-3 items-center">
        <div className="col-span-3 md:col-span-1 space-y-0.5">
          <div className="font-medium">GN256533</div>
          <div className="text-muted-foreground text-xs font-medium">
            12-04-2024
          </div>
        </div>

        <div className="col-span-3 md:col-span-1 truncate">
          <div className="truncate leading-tight">
            John Doe Lorem, ipsum dolor.
          </div>
          <div className="truncate leading-tight text-muted-foreground text-xs">
            9958367688
          </div>
        </div>

        <div className="flex -space-x-2 col-span-6 md:col-span-2">
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

        <div className="hidden md:block">
          <Badge className="pl-1 gap-1">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-foreground">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div className="truncate leading-tight">John Doe</div>
          </Badge>
        </div>

        <div className="col-span-6 md:col-span-1">
          <Badge
            className="justify-between w-full uppercase p-0 pr-3 md:py-1.5 md:px-3"
            variant="secondary"
          >
            <Badge className="pl-1 gap-1 md:hidden">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-foreground">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="truncate leading-tight">John Doe</div>
            </Badge>

            <div className="flex justify-between md:w-full w-3/5">
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
