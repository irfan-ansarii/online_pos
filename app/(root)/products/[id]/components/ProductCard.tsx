import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
const ProductCard = ({ product }) => {
  console.log(product, product?.image?.src);
  return (
    <Card className="overflow-hidden relative">
      <Badge className="absolute right-4 top-4">In stock</Badge>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <Avatar className="w-auto h-auto rounded-md">
            <AvatarImage src={`/${product.image.src}`} asChild>
              <Image
                src={`/${product.image.src}`}
                alt="123"
                width={200}
                height={200}
              ></Image>
            </AvatarImage>
            <AvatarFallback className="rounded-none">P</AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-3">
          <CardTitle>{product?.title}</CardTitle>
          <CardDescription>GN314256</CardDescription>
          <CardDescription>GN314256</CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
