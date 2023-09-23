import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {  User } from "lucide-react";
const CustomerCard = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-2 items-start">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>

          <div className="truncate">
            <div className="truncate font-medium">Lorem ipsum dolor</div>
            <div className="text-muted-foreground text-xs">+91 9876543210</div>
            <div className="text-muted-foreground text-xs">example@email.com</div>
          </div>
        </div>
    
        <div className="grid grid-cols-2 gap-4">
          <Badge className="justify-between" variant="secondary">
            <div className="text-xs uppercase text-muted-foreground font-medium">
              Orders
            </div>
            <div>10</div>
          </Badge>
          <Badge className="justify-between" variant="secondary">
            <div className="text-xs uppercase text-muted-foreground font-medium">
              spent
            </div>
            <div className="truncate">10,920.00</div>
          </Badge>
        </div>
      
      </CardContent>
    </Card>
  );
};

export default CustomerCard;
