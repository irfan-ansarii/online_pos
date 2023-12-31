"use client";
import React, { HtmlHTMLAttributes } from "react";
import Image from "next/image";
import Numeral from "numeral";
import { Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
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
import { useDeleteProduct } from "@/hooks/useProduct";
import { toast } from "@/components/ui/use-toast";

interface BadgeProps {
  [key: string]: string;
}
const ProductCard = ({ product }: { product: any }) => {
  const [open, toggle] = useToggle();
  const [openDelete, toggleDelete] = useToggle();
  const { mutate, isLoading } = useDeleteProduct();
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

  const stock = React.useMemo(() => {
    let totalStock = 0;

    for (const variant of product.variants) {
      const variantInventory = variant?.inventory;

      if (variantInventory && Array.isArray(variantInventory)) {
        for (const item of variantInventory) {
          totalStock += Number(item.stock) || 0;
        }
      }
    }

    return totalStock;
  }, [product]);

  const badgeClassName: BadgeProps = {
    active: "bg-success hover:bg-successs",
    archived: "bg-warning hover:bg-warning",
    trash: "bg-destructive hover:bg-destructive",
  };

  const onDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    mutate(
      { id: product.id },
      {
        onSuccess: (res) => {
          toast({
            variant: "success",
            title: "Product deleted successfully!",
          });

          toggleDelete();
        },
        onError: (error: any) => {
          toast({
            variant: "error",
            title: error.response.data.message || "Something went wrong",
          });
        },
      }
    );
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
                <div className="flex gap-1">
                  <Badge variant="secondary" className="py-0">
                    {product?.variants?.[0]?.sku}
                  </Badge>
                  <Badge variant="secondary" className="py-0">
                    {product?.variants?.[0]?.barcode}
                  </Badge>
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
              <div
                className={`text-base font-medium ${
                  stock <= 0 ? "text-destructive" : ""
                }`}
              >
                {stock}
              </div>
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

        <AlertDialog open={openDelete} onOpenChange={toggleDelete}>
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
              <AlertDialogAction onClick={onDelete} className="w-28">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default ProductCard;
