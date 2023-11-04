import React from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
};
const ProductCard = ({ product }: { product: ProductType }) => {
  return (
    <Card className="overflow-hidden relative">
      <Badge className="absolute right-4 top-4">In stock</Badge>
      <CardContent className="grid grid-cols-6 gap-4">
        <div className="col-span-2">
          <Avatar className="w-full h-full rounded-md aspect-square">
            <AvatarImage src={`/${product.image.src}`} asChild>
              <Image
                src={`/${product.image.src}`}
                alt="123"
                width={200}
                height={200}
              ></Image>
            </AvatarImage>
            <AvatarFallback className="rounded-none text-muted-foreground">
              <ImageIcon className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-3 col-span-4">
          <CardTitle>{product?.title}</CardTitle>
          <CardDescription>GN314256</CardDescription>
          <div className="flex gap-2 font-medium">
            <div>Price:</div>
            <div>1,290.00 - 1,890.00</div>
          </div>
          <CardDescription>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita
            atque distinctio vel a sed harum fugiat ex officia dignissimos
            laudantium.
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
