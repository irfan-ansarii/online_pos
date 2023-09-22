import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { User } from "lucide-react";
const SaleCard = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-2">
          <div className="flex flex-col space-y-0.5 col-span-3">
            <div>GN256533</div>
            <div className="text-muted-foreground text-xs">12-04-2024</div>
          </div>

          <div className="flex flex-col space-y-0.5 col-span-2">
            <div className="truncate">John Doe</div>
            <div className="truncate text-muted-foreground text-xs">
              9958367688
            </div>
          </div>
          <div className="flex -space-x-2 col-span-3">
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

          <div className="truncate flex gap-2 items-center col-span-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Employee</span>
          </div>

          <Badge
            className="justify-between w-full uppercase col-span-5"
            variant="secondary"
          >
            <span>Paid</span> <span>20,201.00</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
