"use client";
import React from "react";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Command as CommandPrimitive } from "cmdk";
import { Image as ImageIcon, Search } from "lucide-react";
import { useToggle } from "@uidotdev/usehooks";
import { useProducts } from "@/hooks/useProduct";

import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import Loading from "@/app/(root)/products/components/Loading";

export type Option = Record<"value" | "label", string> & Record<string, string>;

const AutoComplete = ({
  onSelect,
  error,
}: {
  onSelect: (value: Option) => void;
  error: any;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, toggle] = useToggle(false);
  const [inputValue, setInputValue] = useState("");
  const { data, isLoading } = useProducts({ search: inputValue });

  const handleSelectOption = useCallback(
    (selected: Option) => {
      onSelect(selected);
      setInputValue("");
      inputRef.current?.blur();
    },
    [onSelect]
  );

  const products = React.useMemo(() => {
    return data?.pages.flatMap((page) =>
      page.data.data.flatMap((item: any) =>
        item.variants.map((variant: any) => ({
          ...variant,
          ...item,
          variantTitle:
            variant.title?.toLowerCase() !== "default" ? variant.title : null,
          variantId: variant.id,
          image: item.image.src,
        }))
      )
    );
  }, [data]);

  return (
    <CommandPrimitive>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 text-muted-foreground inline-flex items-center justify-center">
          <Search className="w-4 h-4" />
        </span>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => toggle(false)}
          onFocus={() => toggle(true)}
          placeholder="Search..."
          className={`pl-10 ${
            error ? "border-destructive !ring-destructive/50" : ""
          }`}
        />
      </div>
      {error && (
        <p className="text-sm font-medium text-destructive mt-2">
          Select atleat 1 product
        </p>
      )}
      <div className="mt-1.5 relative">
        {open ? (
          <div className="absolute top-0 z-10 w-full bg-background border rounded-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="rounded-md">
              {/* loading */}
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <Loading />
                </CommandPrimitive.Loading>
              ) : (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-sm text-center">
                  No Result
                </CommandPrimitive.Empty>
              )}

              {/* data */}
              {products && products?.length > 0 && !isLoading ? (
                <CommandGroup>
                  {products.map((product) => {
                    return (
                      <CommandItem
                        key={product.variantId}
                        value={product.variantId}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(product)}
                        className="flex items-center gap-2 w-full"
                      >
                        <div className="flex gap-3 items-center col-span-2">
                          <Avatar className="w-10 h-10 border-2">
                            <AvatarImage
                              src={`/${product.image}`}
                              asChild
                              className="object-cover"
                            >
                              <Image
                                src={`/${product.image}`}
                                alt={`/${product.image}`}
                                width={40}
                                height={40}
                              ></Image>
                            </AvatarImage>
                            <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                              <ImageIcon className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="space-y-0 5">
                            <div className="font-semibold truncate">
                              <span>{product.title}</span>

                              {product.variantTitle && (
                                <span> - {product.variantTitle}</span>
                              )}
                            </div>
                            <div className="text-xs uppercase text-muted-foreground">
                              {product.sku}
                            </div>
                          </div>
                        </div>

                        <div className="ml-auto">{Number(product.stock)}</div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
            </CommandList>
          </div>
        ) : null}
      </div>
    </CommandPrimitive>
  );
};
export default AutoComplete;
