"use client";
import React from "react";
import Image from "next/image";
import Numeral from "numeral";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductSheet from "./ProductSheet";
import EditSheet from "./EditSheet";

const ProductCard = ({ product }: { product: any }) => {
  const price = React.useMemo(() => {
    const { variants } = product;

    const salePrices = variants.map((variant: any) => variant.salePrice);

    if (salePrices.every((price: number) => price === salePrices[0])) {
      return Numeral(salePrices[0]).format();
    }

    const minPrice = Numeral(Math.min(...salePrices)).format();
    const maxPrice = Numeral(Math.max(...salePrices)).format();

    return `${minPrice} - ${maxPrice}`;
  }, [product]);

  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <Sheet>
        <SheetTrigger asChild>
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
                <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                  <ImageIcon className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-0.5 truncate">
                <div className="font-semibold truncate">{product.title}</div>
                <div className="text-muted-foreground font-medium text-xs uppercase">
                  {product.variants[0].sku}
                </div>
              </div>
            </div>
            <div className="font-medium text-right truncate col-span-2 hidden md:block">
              {price}
            </div>
            <div className="text-right col-span-3 md:col-span-1">
              <Badge className="uppercase rounded-md mb-1" variant="secondary">
                {product.status}
              </Badge>
              <div className="font-medium text-right truncate md:hidden">
                {price}
              </div>
            </div>
            <div className="hidden md:block text-right">427</div>
          </CardContent>
        </SheetTrigger>
        <ProductSheet product={product} />
      </Sheet>

      <div className="absolute inset-y-0 right-4 transition transform translate-x-[120%] group-hover:translate-x-0 bg-accent flex items-center gap-2">
        <EditSheet />
        <Button variant="secondary" size="icon" className="">
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
