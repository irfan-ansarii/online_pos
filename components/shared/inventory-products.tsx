"use client";
import React from "react";
import Image from "next/image";
import { useState, useRef, useCallback } from "react";
import { ScanLine, Search, Image as ImageIcon } from "lucide-react";

import { useInventory } from "@/hooks/useInventory";

import { Input } from "@/components/ui/input";

import { Badge } from "../ui/badge";

import ProductLoading from "./product-loading";
import ErrorBox from "./error-box";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export type Option = Record<string, any>;

const InventoryProducts = ({
  onSelect,
}: {
  onSelect?: (value: Option) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef(null);
  const { inventory, isLoading, isError } = useInventory({
    search: searchTerm,
  });

  const handleSelectOption = useCallback(
    (selected: Option) => {
      if (onSelect) onSelect(selected);
    },
    [onSelect]
  );

  return (
    <div>
      <div className="flex items-center h-[61px] border-b sticky top-0 z-50 bg-background mb-4">
        <div className="relative grow">
          <span className="pointer-events-none absolute left-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
            <Search className="w-5 h-5" />
          </span>

          <Input
            ref={ref}
            type="text"
            className="bg-transparent rounded-none border-none pl-10 focus-visible:ring-transparent"
            placeholder="Search..."
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            value={searchTerm || ""}
          />

          <span className="pointer-events-none absolute right-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
            <ScanLine className="w-5 h-5" />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2  xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {/* loading cards */}
        {isLoading && [...Array(6)].map((_, i) => <ProductLoading key={i} />)}

        {inventory?.data?.map((item: Option) => (
          <Card className="rounded-md" onClick={() => handleSelectOption(item)}>
            <CardContent className="p-0">
              <Avatar className="w-full h-full aspect-square rounded-none border-none rounded-t-md">
                <AvatarImage
                  src={`/${item.product.image.src}`}
                  asChild
                  className="object-cover"
                >
                  <Image
                    src={`/${item.product.image.src}`}
                    alt={""}
                    width={140}
                    height={140}
                  />
                </AvatarImage>
                <AvatarFallback className="w-full h-full rounded-none border-none rounded-t-md text-muted-foreground">
                  <ImageIcon className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
            </CardContent>
            <div className="px-2 py-1">
              <div className="leading-tight truncate">{item.product.title}</div>
              <div className="leading-tight">{item.variant.salePrice}</div>
            </div>
          </Card>
        ))}

        {/* <EmptyBox
          className="col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-4 2xl:col-span-5"
          title="No Product Found"
        /> */}

        {/* error box */}
        {isError && (
          <ErrorBox className="col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-3 xl:col-span-4 2xl:col-span-5" />
        )}
      </div>
    </div>
  );
};
export default InventoryProducts;
