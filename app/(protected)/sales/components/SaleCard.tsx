import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { AvatarGroup, AvatarItem } from "@/components/shared/avatar";
const SaleCard = () => {
  return (
    <Card>
      <CardContent className="grid grid-cols-8 gap-3 items-center">
        <div className="flex gap-3 col-span-5 md:col-span-4">
          <div className="hidden md:block border-r pr-4 text-center w-20 shrink-0">
            <div className="text-lg leading-tight font-semibold">02</div>
            <div className="leading-tight text-muted-foreground">Dec 23</div>
          </div>
          <div className="md:hidden space-y-0.5">
            <div className="font-medium">GN256533</div>
            <div className="text-muted-foreground">02 Dec</div>
          </div>
          <div className="flex -space-x-2 truncate">
            <AvatarGroup maxCount={4}>
              {[...Array(10)].map((_, i) => (
                <AvatarItem
                  key={i}
                  src="/uploads/purple-3_1272x_$2a$10$f6m8M4FfnOyIFKtILCtReu.webp"
                />
              ))}
            </AvatarGroup>
          </div>
        </div>
        <div className="hidden md:block col-span-2 space-y-0.5">
          <div className="font-medium">GN256533</div>
          <span className="text-muted-foreground">Employee</span>
        </div>

        <div className="hidden md:flex flex-col space-y-0.5">
          <div className="font-medium">Customer</div>
          <div className="text-muted-foreground">9876543210</div>
        </div>
        <div className="col-span-3 md:col-span-1 space-y-0.5  text-right">
          <div>1290.00</div>
          <Badge
            variant="secondary"
            className="rounded-md justify-center uppercase"
          >
            Paid
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaleCard;
