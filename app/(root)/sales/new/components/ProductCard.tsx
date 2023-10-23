import React from "react";
import Numeral from "numeral";

import { useFormContext, useWatch } from "react-hook-form";

import { Image } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogCancel,
} from "@/components/ui/dialog";

interface VariantType {
  id?: number;
  title: string;
  variantTitle: string | null;
  sku: string;
  salePrice: number;
  productId: number;
  variantId: number;
}

interface ProductType {
  id: number;
  title: string;
  description: string;
  type: string;
  options: [];
  variants: VariantType[];
}

const ProductCard: React.FC<{ product: ProductType; lineItems: any }> = ({
  product,
  lineItems,
}) => {
  const form = useFormContext();
  const { fields, append, update } = lineItems;
  const updatedLineItems = useWatch({
    control: form.control,
    name: "lineItems",
  });
  const handleClick = (
    e: React.MouseEvent<HTMLElement>,
    clickedItem: VariantType,
    action: string | null
  ) => {
    if (action === "skip") {
      return;
    }

    if (product.type === "simple") {
      e.preventDefault();
    }

    const index = fields.findIndex(
      (item: VariantType) => item.variantId === clickedItem.variantId
    );

    if (index === -1) {
      append({
        ...clickedItem,
        price: clickedItem.salePrice,
        quantity: 1,
        totalDiscount: 0,
        totalTax:
          clickedItem.salePrice - clickedItem.salePrice / (12 / 100 + 1),
        total: clickedItem.salePrice,
      });
    } else {
      update(index, {
        ...updatedLineItems[index],
        totalDiscount: updatedLineItems[index].totalDiscount,
        quantity: Number(fields[index].quantity) + 1,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        asChild
        onClick={(e) =>
          handleClick(
            e,
            {
              title: product.title,
              variantTitle: null,
              sku: product?.variants?.[0]?.sku!,
              salePrice: product?.variants?.[0].salePrice,
              productId: product.id,
              variantId: product?.variants?.[0].id!,
            },
            product.type !== "simple" ? "skip" : null
          )
        }
      >
        <Card className="cursor-pointer rounded-md">
          <CardHeader className="p-0">
            <Avatar className="w-full h-full rounded-none">
              <AvatarImage
                alt="@shadcn"
                className="object-cover object-cover"
              />
              <AvatarFallback className="object-cover text-muted-foreground object-cover aspect-square rounded-t rounded-b-none">
                <Image className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="p-2">
            <CardTitle className="truncate text-sm font-semibold">
              {product.title}
            </CardTitle>
            <CardDescription className="truncate">
              {Numeral(product.variants[0].salePrice).format()}
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <div className="grid grid-cols-4 gap-4">
          {product.variants.map((variant: any) => (
            <DialogCancel
              asChild
              key={variant.id}
              onClick={(e) =>
                handleClick(
                  e,
                  {
                    title: product.title,
                    variantTitle: variant.title,
                    sku: variant.sku,
                    salePrice: variant.salePrice,
                    productId: product.id,
                    variantId: variant.id,
                  },
                  null
                )
              }
            >
              <Button
                key={variant.id}
                variant="outline"
                className="border-2 flex-col p-4 truncate space-y-2 w-full h-full hover:bg-background hover:border-primary"
              >
                <Avatar className="shrink-0 w-12 h-12">
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <div className="truncate">{variant.title}</div>
                  <div className="text-muted-foreground text-xs font-normal">
                    {variant.salePrice}
                  </div>
                </div>
              </Button>
            </DialogCancel>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCard;
