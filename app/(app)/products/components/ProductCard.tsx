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

        <div className="flex flex-col h-full truncate px-4 py-2">
          <div className="truncate font-medium mb-3">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </div>
          <div className="flex gap-1 uppercase">
            <span className="text-muted-foreground w-1/3">sku:</span>
            <span>gn746573456</span>
          </div>
          <div className="flex gap-1 uppercase">
            <span className="text-muted-foreground w-1/3">stock:</span>
            <span>8</span>
          </div>
          <Badge className="justify-between mt-3" variant="secondary">
            <span>1278</span> -<span>3679</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
