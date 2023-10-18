import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const ProductCard = ({ product }: { product: any }) => {
  console.log(product);
  return (
    <Card className="relative">
      <Link href={`/products/${product.id}`} className="block">
        <CardContent className="flex p-0 items-stretch">
          <Avatar className="w-32 h-32 rounded-none md:rounded-l-md">
            <AvatarImage
              src="https://cdn.shopify.com/s/files/1/0652/3541/9353/files/aria3_200x.jpg?v=1685017009"
              alt="@shadcn"
            />
            <AvatarFallback className="rounded-none  md:rounded-l-md ">
              CN
            </AvatarFallback>
          </Avatar>

          <div className="grow p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="font-semibold">{product.title}</div>
              <div className="text-muted-foreground">
                {product.variants[0].sku}
              </div>
            </div>
            <div>{product.variants[0].salePrice}</div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
