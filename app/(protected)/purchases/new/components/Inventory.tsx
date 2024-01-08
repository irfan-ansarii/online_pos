"use client";
import React from "react";

import { useState, useRef, useCallback } from "react";
import { ScanLine, Search } from "lucide-react";

import { useInventory } from "@/hooks/useInventory";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import ProductLoading from "@/components/shared/product-loading";
import ErrorBox from "@/components/shared/error-box";
import EmptyBox from "@/components/shared/empty-box";
import { AvatarItem } from "@/components/shared/avatar";

export type Option = Record<string, any>;

const Inventory = ({ onSelect }: { onSelect?: (value: Option) => void }) => {
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

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = ref.current;
    if (input) {
      if (e.key === "Enter") {
        await new Promise<void>((resolve) => {
          const intervalId = setInterval(() => {
            if (!isLoading) {
              clearInterval(intervalId);
              resolve();
            }
          }, 100);
        });

        if (!isLoading && inventory && inventory.data) {
          const index = inventory?.data?.findIndex(
            (inv: any) => inv.variant.barcode === Number(searchTerm)
          );

          if (index >= 0) {
            const item = inventory?.data[index];

            if (onSelect) onSelect(item);
            setSearchTerm("");
          }
        }
      }
    }
  };
  React.useEffect(() => {
    //@ts-ignore
    ref.current.focus();
  }, []);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            value={searchTerm || ""}
          />

          <span className="pointer-events-none absolute right-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
            <ScanLine className="w-5 h-5" />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4  2xl:grid-cols-5 gap-4">
        {/* loading cards */}
        {isLoading && [...Array(6)].map((_, i) => <ProductLoading key={i} />)}

        {/* empty box */}
        {inventory?.data.length === 0 && !isLoading && (
          <EmptyBox
            className="col-span-2 sm:col-span-3 md:col-span-4 2xl:col-span-5"
            title="No Product Found"
          />
        )}

        {/* error box */}
        {isError && !isLoading && !inventory?.data && (
          <ErrorBox
            className="col-span-2 sm:col-span-3 md:col-span-4 2xl:col-span-5"
            title="Internal server error"
          />
        )}
        {inventory?.data?.map((item: Option) => (
          <Card
            key={item.id}
            className="rounded-md cursor-pointer relative overflow-hidden"
            onClick={() => handleSelectOption(item)}
          >
            <Badge
              className={`top-2 left-2 absolute z-10 ${
                item.stock > 0 ? "bg-success" : "bg-destructive"
              }`}
              variant="secondary"
            >
              {item.stock}
            </Badge>
            <CardContent className="p-0">
              <AvatarItem
                src={item?.product?.image?.src}
                className="w-full h-full aspect-square rounded-none border-none rounded-t-md"
                width={140}
                height={140}
                iconClassName="w-10 h-10"
              />
            </CardContent>
            <div className="px-2 py-1">
              <div className="leading-tight truncate font-medium">
                {item.product.title}
              </div>
              <div className="leading-tight font-medium text-muted-foreground">
                {item.variant.salePrice}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default Inventory;
