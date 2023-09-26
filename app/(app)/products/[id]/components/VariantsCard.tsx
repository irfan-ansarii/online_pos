import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const VariantsCard = () => {
  return (
    <Card className="overflow-hidden rounded-none md:rounded-md">
      <CardContent className="p-0 space-y-4">
        {[...Array(6)].map(() => (
          <div className="flex flex-col overflow-hidden border-t first:border-none">
            <div className="flex items-center p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="https://www.goldysnestt.com/cdn/shop/products/112_700x.jpg"
                  alt="Avatar"
                />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="font-medium leading-none">Item Name</p>
                <p className="text-xs text-muted-foreground">SKU12345</p>
              </div>
              <div className="ml-auto font-medium">+$1,999.00</div>
            </div>
            <div className="divide-y px-4 py-2">
              {[...Array(2)].map(() => (
                <div className="flex justify-between py-2">
                  <p className="font-medium leading-none">Item Name</p>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VariantsCard;
