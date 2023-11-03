import React from "react";
import Link from "next/link";
import Image from "next/image";
import Numeral from "numeral";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

const ProductCard = ({ product }: { product: any }) => {
  function prices(variants: any) {
    const min = Math.min(...variants);
    const max = Math.max(...variants);
    if (min === max) {
      return [min];
    }
    return [min, max];
  }

  return (
    <Card className="relative hover:bg-accent">
      <Link href={`/products/${product.id}`} className="block">
        <CardContent className="grid grid-cols-7 items-center gap-2">
          <div className="flex items-center gap-3 col-span-4 md:col-span-3 items-center">
            <Avatar className="w-12 h-12 border-2">
              <AvatarImage
                src={product.image.src}
                alt={product.image.title}
                className="object-cover"
                asChild
              >
                <Image
                  src={`/${product.image.src}`}
                  alt={product.image.title}
                  width={60}
                  height={60}
                ></Image>
              </AvatarImage>
              <AvatarFallback className="rounded-none  md:rounded-l-md object-cover">
                CN
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5 truncate">
              <div className="font-semibold truncate">{product.title}</div>
              <div className="text-muted-foreground font-medium text-xs uppercase">
                {product.variants[0].sku}
              </div>
            </div>
          </div>
          <div className="font-medium  text-right ">
            {prices(product.variants).map((price) => (
              <span>{Numeral(price).format()}</span>
            ))}
          </div>
          <div className="text-right col-span-2 md:col-span-1">
            <Badge className="uppercase gap-1 py-1 px-3" variant="secondary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <div className="text-success">{product.status}</div>
            </Badge>
          </div>
          <div className="hidden md:block text-right">427</div>
          <div className="hidden md:flex gap-2 justify-end">
            <div>{Numeral(product.variants[0].salePrice).format()}</div>
            <Activity className="w-5 h-5" />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
