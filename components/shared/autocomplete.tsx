"use client";
import React from "react";
import Image from "next/image";
import { useToggle } from "@uidotdev/usehooks";
import { useProducts } from "@/hooks/useProduct";
import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Command as CommandPrimitive } from "cmdk";
import { useState, useRef, useCallback } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

export type Option = Record<"value" | "label", string> & Record<string, string>;

export const AutoComplete = ({ onSelect }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, toggle] = useToggle(false);
  const [inputValue, setInputValue] = useState("");
  const { data, isLoading } = useProducts({ search: inputValue });

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      onSelect(selectedOption.id);
      setInputValue("");
      inputRef.current?.blur();
    },
    [onSelect]
  );

  const products = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data);
  }, [data]);

  return (
    <CommandPrimitive>
      <div>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => toggle(false)}
          onFocus={() => toggle(true)}
          placeholder="Search..."
        />
      </div>
      <div className="mt-1.5 relative">
        {open ? (
          <div className="absolute top-0 z-10 w-full bg-background border rounded-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="rounded-md p-0">
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}

              {products?.length > 0 && !isLoading ? (
                <CommandGroup>
                  {products?.map((option) => {
                    return (
                      <CommandItem
                        key={option.id}
                        value={option.id}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        onSelect={() => handleSelectOption(option)}
                        className="flex items-center gap-2 w-full"
                      >
                        <div className="flex gap-3 items-center col-span-2">
                          <Avatar className="w-10 h-10 border-2">
                            <AvatarImage
                              src={`/${option.image.src}`}
                              asChild
                              className="object-cover"
                            >
                              <Image
                                src={`/${option.image.src}`}
                                alt={`/${option.image.src}`}
                                width={40}
                                height={40}
                              ></Image>
                            </AvatarImage>
                            <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                              <ImageIcon className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5 truncate">
                            <div className="font-semibold truncate">
                              {option.title}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              lorem5
                            </div>
                          </div>
                        </div>

                        <div className="ml-auto">10</div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading && products?.length === 0 ? (
                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-sm text-center">
                  Empty
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        ) : null}
      </div>
    </CommandPrimitive>
  );
};
