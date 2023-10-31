import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="relative ">
      <Link href={`/products/${product.id}`} className="block">
        <CardContent className="grid grid-cols-6">
          <div className="flex items-center gap-3 col-span-2 items-center">
            <Avatar className="">
              <AvatarImage
                src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
                alt="@shadcn"
              />
              <AvatarFallback className="rounded-none  md:rounded-l-md ">
                CN
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div className="font-semibold">{product.title}</div>
              <div className="text-muted-foreground font-medium text-xs uppercase">
                {product.variants[0].sku}
              </div>
            </div>
          </div>
          <div>{product.variants[0].salePrice}</div>
          <div>{product.status}</div>
          <div>Total Sales</div>
          <div>Total Revenue</div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
