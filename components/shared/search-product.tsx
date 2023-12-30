"use client";
import React from "react";
import { useState, useRef, useCallback } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { useToggle } from "@uidotdev/usehooks";
import { useInventory } from "@/hooks/useInventory";

import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

import Loading from "@/components/shared/Loading";
import { Badge } from "../ui/badge";
import { AvatarItem } from "@/components/shared/avatar";

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
  const { inventory, isLoading } = useInventory({ search: inputValue });

  const handleSelectOption = useCallback(
    (selected: Option) => {
      onSelect(selected);
      setInputValue("");
      inputRef.current?.blur();
    },
    [onSelect]
  );

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
          onBlur={() => {
            toggle(false);
            setInputValue("");
          }}
          onFocus={() => toggle(true)}
          placeholder="Search..."
          className={`pl-10 ${
            error ? "border-destructive !ring-destructive/50" : ""
          }`}
        />
      </div>
      {/* error */}
      {error && (
        <p className="text-sm font-medium text-destructive mt-2">{error}</p>
      )}

      <div className="mt-1.5 relative">
        {open && (
          <div className="absolute top-0 z-10 w-full bg-background border rounded-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="rounded-md">
              {/* loading */}
              {isLoading && (
                <CommandPrimitive.Loading>
                  <Loading className="border-none" />
                </CommandPrimitive.Loading>
              )}

              {/* data */}

              <CommandGroup>
                {inventory?.data?.map((inv: any) => {
                  return (
                    <CommandItem
                      key={inv.id}
                      value={inv.id}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(inv)}
                      className="flex items-center gap-2 w-full"
                    >
                      <div className="flex gap-3 items-center col-span-2">
                        <AvatarItem src={inv.product?.image?.src} />

                        <div>
                          <div className="font-semibold truncate">
                            {inv.product.title}
                          </div>

                          <Badge
                            className="py-0 text-muted-foreground"
                            variant="secondary"
                          >
                            {inv.variant.title !== "Default" && (
                              <>
                                <span>{inv.variant.title}</span>
                                <span className="px-1">|</span>
                              </>
                            )}
                            <span> {inv.variant.barcode}</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="ml-auto">{inv.stock}</div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
    </CommandPrimitive>
  );
};
export default AutoComplete;
