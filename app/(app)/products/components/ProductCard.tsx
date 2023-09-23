import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ProductCard = () => {
  return (
    <Card className="rounded-none md:rounded-md">
      <CardContent className="flex p-0">
        <Avatar className="w-32 h-32 rounded-none md:rounded-md">
          <AvatarImage
            src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
            alt="@shadcn"
          />
          <AvatarFallback className="rounded-none  md:rounded-md">
            CN
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col h-full space-y-2 px-4 py-2">
          <div className="font-medium">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </div>
          <div className="text-muted-foreground">GN123254</div>
          <div>1,290.00</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
