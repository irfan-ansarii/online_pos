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
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProductSheet from "./ProductSheet";
import EditSheet from "./EditSheet";

import { useToggle } from "@uidotdev/usehooks";

interface BadgeProps {
  [key: string]: string;
}
const ProductCard = ({ product }: { product: any }) => {
  const [open, toggle] = useToggle();

  const priceRange = React.useMemo(() => {
    const { variants } = product;

    const salePrices = variants.map((variant: any) => variant.salePrice);

    if (salePrices.every((price: number) => price === salePrices[0])) {
      return Numeral(salePrices[0]).format();
    }

    const minPrice = Numeral(Math.min(...salePrices)).format();
    const maxPrice = Numeral(Math.max(...salePrices)).format();

    return `${minPrice} - ${maxPrice}`;
  }, [product]);

  const stock = 0;

  const badgeClassName: BadgeProps = {
    active: "bg-success hover:bg-successs",
    archived: "bg-warning hover:bg-warning",
    trash: "bg-destructive hover:bg-destructive",
  };

  return (
    <Card className="relative group hover:bg-accent overflow-hidden">
      <Sheet open={open} onOpenChange={toggle}>
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
              {priceRange}
            </div>
            <div className="text-right col-span-3 md:col-span-1">
              <div className={`font-medium text-right truncate md:hidden`}>
                {priceRange}
              </div>
              <div>{stock}</div>
            </div>
            <div className="hidden md:block text-right">
              <Badge
                className={`uppercase rounded-md text-white mb-1 ${
                  badgeClassName[product.status]
                }`}
                variant="secondary"
              >
                {product.status}
              </Badge>
            </div>
          </CardContent>
        </SheetTrigger>
        {open && <ProductSheet product={product} />}
      </Sheet>

      <div className="absolute inset-y-0 right-0 px-4 invisible group-hover:visible bg-accent flex items-center gap-2">
        <EditSheet />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" size="icon" className="">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently remove the selected product from
                the system and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default ProductCard;
