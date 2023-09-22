import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ProductCard = () => {
  return (
    <Card>
      <CardContent className="flex p-0">
        <Avatar className="w-32 h-32 rounded-md">
          <AvatarImage
            src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
            alt="@shadcn"
          />
          <AvatarFallback className="rounded-md ">CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col truncate px-4 py-2">
          <div className="truncate font-medium mb-2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </div>
          <div className="flex  gap-1 flex-col uppercase">
            <Badge variant="secondary" className="justify-between font-medium">
              <span>sku</span> <span>gn746573456</span>
            </Badge>
            <Badge variant="secondary" className="justify-between font-medium">
              <span>1278</span> -<span>3679</span>
            </Badge>
            <Badge variant="secondary" className="justify-between font-medium">
              <span>stock</span> <span>8</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
