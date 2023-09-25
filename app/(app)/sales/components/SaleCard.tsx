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
          <div className="flex flex-col col-span-3">
            <div>GN256533</div>
            <div className="text-muted-foreground text-xs">12-04-2024</div>
          </div>

          <div className="flex gap-2 items-center col-span-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="truncate leading-tight">John Doe</div>
              <div className="truncate leading-tight text-muted-foreground text-xs">
                9958367688
              </div>
            </div>
          </div>
          <div className="flex -space-x-2 col-span-5">
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
          <Badge
            className="justify-between w-full uppercase col-span-5 p-0 pr-2"
            variant="secondary"
          >
            <Badge className="pl-1 gap-1">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-foreground">
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="truncate leading-tight">John Doe</div>
            </Badge>
            <div className="flex justify-between w-3/5">
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
