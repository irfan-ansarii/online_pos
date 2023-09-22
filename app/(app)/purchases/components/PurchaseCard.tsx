import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
const PurchaseCard = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-6 gap-3">
          <div className="flex flex-col space-y-0.5 col-span-2">
            <div>GN256533</div>
            <div className="text-muted-foreground text-xs">12-04-2024</div>
          </div>

          <div className="flex flex-col space-y-0.5 col-span-2">
            <div className="truncate">John Doe</div>
            <div className="truncate text-muted-foreground text-xs">
              Jaipur, India
            </div>
          </div>

          <div className="flex flex-col space-y-0.5 col-span-2">
            <span>540.00</span>
            <span className="text-muted-foreground text-xs uppercase font-medium">
              Items
            </span>
          </div>
          <div className="col-span-6 space-y-1">
            <Badge
              className="justify-between w-full uppercase "
              variant="secondary"
            >
              <span>Tax</span> <span>20,201.00</span>
            </Badge>
            <Badge
              className="justify-between w-full uppercase col-span-3"
              variant="secondary"
            >
              <span>Paid</span> <span>20,201.00</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseCard;
