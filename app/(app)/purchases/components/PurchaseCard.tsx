import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
const PurchaseCard = () => {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-8 gap-3">
          <div className="flex flex-col col-span-3">
            <div>GN256533</div>
            <div className="text-muted-foreground text-xs">12-04-2024</div>
          </div>
          <div className="flex flex-col col-span-3">
            <span>540.00</span>
            <span className="text-muted-foreground text-xs uppercase font-medium">
              Items
            </span>
          </div>
          <div className="flex flex-col items-end col-span-2">
            <span>540.00</span>
            <span className="text-muted-foreground text-xs uppercase font-medium">
              Tax
            </span>
          </div>

          <Badge
            className="justify-between uppercase col-span-8 p-0 pr-2"
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
              <span className="inline-flex gap-2">Paid</span>
              <span>20,201.00</span>
            </div>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseCard;
