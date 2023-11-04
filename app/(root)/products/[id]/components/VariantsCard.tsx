import React from "react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Image as ImageIcon, MapPin } from "lucide-react";
import Numeral from "numeral";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import StockCard from "./StockCard";

type VariantType = {
  id: number;
  title: string;
  sku: string;
  purchasePrice: number;
  salePrice: number;
  taxRate: number;
};
type ProductType = {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  image: {
    id: number;
    title: string;
    src: string;
  };
  variants: VariantType[];
};
const VariantsCard = ({ product }: { product: ProductType }) => {
  return (
    <Card className="overflow-hidden rounded-none md:rounded-md">
      <CardHeader>
        <CardTitle>Variants</CardTitle>
        <CardDescription>View and manage inventory</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {product?.variants?.map((variant, i) => (
          <div key={i} className="p">
            <div className="grid grid-cols-6 gap-3 bg-accent py-3 px-4 border-y items-center">
              <div className="col-span-3 flex gap-2">
                <Avatar className="border-2 shrink-0">
                  <AvatarImage
                    src={`/${product.image.src}`}
                    asChild
                    alt={`/${product.image.title}`}
                  >
                    <Image
                      src={`/${product.image.src}`}
                      alt={`/${product.image.title}`}
                      width={40}
                      height={40}
                    ></Image>
                  </AvatarImage>
                  <AvatarFallback>
                    <ImageIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1 truncate">
                  <div className="truncate">{variant.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {variant.sku}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {Numeral(variant.purchasePrice).format()}
              </div>
              <div className="text-right">
                {Numeral(variant.salePrice).format()}
              </div>
              <div className="text-right">
                {Numeral(variant.taxRate / 100).format("0,0.00%")}
              </div>
            </div>
            <StockCard />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VariantsCard;
