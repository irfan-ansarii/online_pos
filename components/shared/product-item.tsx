import React from "react";
import Image from "next/image";
import { Image as ImageIcon, Minus, Plus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type Option = Record<"value" | "label", string> & Record<string, string>;
const ProductItem = ({ product, onPlus, onMinus, onDelete }) => {
  // handle plus
  const handlePlus = React.useCallback(
    (selected: Option) => {
      onPlus(selected);
    },
    [onPlus]
  );
  // handle minus
  const handleMinus = React.useCallback(
    (selected: Option) => {
      onPlus(selected);
    },
    [onMinus]
  );

  // handle delete
  const handleDelete = React.useCallback(
    (index: number) => {
      onPlus(index);
    },
    [onDelete]
  );
  return (
    <div className="flex  rounded-md border p-2 pr-0 items-center snap-start">
      <div className="flex gap-3 items-center col-span-2">
        <Avatar className="w-10 h-10 border-2">
          <AvatarImage
            asChild
            src={`/${product.imageSrc}`}
            className="object-cover"
          >
            <Image
              src={`/${product.imageSrc}`}
              alt={`/${product.imageSrc}`}
              width={40}
              height={40}
            />
          </AvatarImage>
          <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5 truncate">
          <div className="font-semibold truncate">{product.title}</div>
          {product.variantTitle && (
            <Badge className="py-.5" variant="secondary">
              {product.variantTitle}
            </Badge>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-6">
        <div className="flex items-center w-20 justify-between">
          <Button
            onClick={(e) => handleMinus(e, i)}
            size="icon"
            variant="secondary"
            className="rounded-full w-6 h-6"
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="flex-1 truncate text-center block">
            {product.quantity}
          </span>
          <Button
            size="icon"
            onClick={(e) => handlePlus(e, i)}
            variant="secondary"
            className="rounded-full w-6 h-6"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="opacity-50 hover:opacity-100 hover:bg-background transition"
          onClick={() => handleDelete()}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductItem;
