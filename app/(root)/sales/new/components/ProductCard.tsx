import React from "react";
import Image from "next/image";
import Numeral from "numeral";

import { useFormContext, useWatch } from "react-hook-form";

import { Image as ImageIcon } from "lucide-react";

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
  taxRate: number;
  productId: number;
  variantId: number;
  imageId: number;
  imageSrc: string;
}

interface ProductType {
  id: number;
  title: string;
  description: string;
  type: string;
  options: [];
  variants: VariantType[];
  image: ImageType;
}
interface ImageType {
  id: number;
  src: string;
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
    variant: VariantType,
    action: string | null
  ) => {
    if (action === "skip") {
      return;
    }

    if (product.type === "simple") {
      e.preventDefault();
    }

    const index = fields.findIndex(
      (item: VariantType) => item.variantId === variant.variantId
    );

    if (index === -1) {
      append({
        ...variant,
        price: variant.salePrice,
        totalDiscount: "",
        quantity: 1,
      });
    } else {
      update(index, {
        ...updatedLineItems[index],
        totalDiscount: updatedLineItems[index].totalDiscount || 0,
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
              variantTitle: "",
              sku: product?.variants?.[0]?.sku!,
              salePrice: product?.variants?.[0].salePrice,
              taxRate: product?.variants?.[0].taxRate,
              productId: product.id,
              imageId: product.image.id,
              imageSrc: product.image.src,
              variantId: product?.variants?.[0].id!,
            },
            product.type !== "simple" ? "skip" : null
          )
        }
      >
        <Card className="cursor-pointer rounded-md">
          <CardHeader className="p-0">
            <Avatar className="w-full h-full rounded-none overflow-hidden">
              <AvatarImage
                alt="@shadcn"
                src={`/${product?.image?.src}`}
                className="object-cover object-cover rounded-t-md"
                asChild
              >
                <Image
                  src={`/${product?.image?.src}`}
                  width={200}
                  height={200}
                  alt=""
                ></Image>
              </AvatarImage>
              <AvatarFallback className="object-cover text-muted-foreground object-cover aspect-square rounded-t rounded-b-none">
                <ImageIcon className="w-10 h-10" />
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
                    taxRate: variant.taxRate,
                    imageId: product.image.id,
                    imageSrc: product.image.src,
                    productId: product.id,
                    variantId: variant.id,
                  },
                  null
                )
              }
            >
              <Button
                key={variant.id}
                className="flex-col !bg-secondary/20 border px-0 py-2 truncate space-y-2 w-full h-full"
              >
                <Avatar className="w-12 h-12 border-2">
                  <AvatarImage
                    alt="@shadcn"
                    src={`/${product?.image?.src}`}
                    className="object-cover object-cover rounded-t-md"
                    asChild
                  >
                    <Image
                      src={`/${product?.image?.src}`}
                      width={50}
                      height={60}
                      alt=""
                    ></Image>
                  </AvatarImage>
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
