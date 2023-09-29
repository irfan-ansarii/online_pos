import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
const CustomerCard = () => {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="flex gap-2 items-start">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>

          <div className="truncate">
            <div className="truncate font-medium">Lorem ipsum dolor</div>
            <div className="text-muted-foreground text-xs">+91 9876543210</div>
            <div className="text-muted-foreground text-xs">
              example@email.com
            </div>
          </div>
        </div>

        <Badge className="grid grid-cols-5 py-1" variant="secondary">
          <div className="flex justify-between col-span-2">
            <span className="uppercase  text-muted-foreground">orders</span>
            <span>10</span>
          </div>

          <Separator orientation="vertical" className="mx-auto w-0.5" />

          <div className="flex justify-between col-span-2">
            <span className="uppercase  text-muted-foreground">spent</span>
            <span>10,109.00</span>
          </div>
        </Badge>
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
