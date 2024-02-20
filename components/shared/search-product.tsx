"use client";
import React from "react";
import { useState, useRef, useCallback } from "react";
import { Loader2, ScanLine } from "lucide-react";
import { useToggle } from "@uidotdev/usehooks";
import { useInventory } from "@/hooks/useInventory";

import { Input } from "@/components/ui/input";

import { toast } from "../ui/use-toast";
import { CommandGroup, CommandItem, CommandList } from "../ui/command";
import { Command } from "cmdk";
import { AvatarItem } from "./avatar";
import { Badge } from "../ui/badge";

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
  const [process, setProcess] = useToggle(false);

  const [inputValue, setInputValue] = useState("");

  const { inventory, isLoading } = useInventory({ search: inputValue });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const input = inputRef.current;

    if (input && input.value && e.key === "Enter") {
      console.log("key down item");
      if (isLoading && process) {
        toast({
          variant: "info",
          title: "Please wait...",
        });
      }
      setProcess(true);
    }
  }, []);

  const processSelection = () => {
    if (!Array.isArray(inventory?.data) || inventory?.data.length === 0) {
      toast({
        variant: "error",
        title: "Invalid barcode",
      });
      setProcess(false);
      return;
    }

    const foundItem = inventory?.data?.find(
      (inv: any) =>
        inv.variant.barcode?.toLowerCase() === inputValue.toLowerCase()
    );

    if (foundItem) {
      // @ts-ignore
      if (onSelect) onSelect(foundItem);
      setInputValue("");
    }
  };

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!isLoading && process) {
      processSelection();
    }
  }, [isLoading]);

  return (
    <Command>
      <div className="relative">
        <span className="absolute inset-y-0 left-3 text-muted-foreground inline-flex items-center justify-center">
          <ScanLine className="w-4 h-4" />
        </span>

        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            if (value !== "") {
              toggle(true);
            } else {
              toggle(false);
            }
            setInputValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className={`pl-10 ${
            error ? "border-destructive !ring-destructive/50" : ""
          }`}
        />
        <span
          className={`absolute inset-y-0 right-3 text-muted-foreground inline-flex items-center justify-cente ${isLoading ? "opacity-100" : "opacity-0"}`}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </span>
      </div>

      <div className="mt-1.5 relative">
        {open && !isLoading && inputValue !== "" && (
          <div className="absolute top-0 z-10 w-full bg-background border rounded-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="rounded-md">
              {Array.isArray(inventory?.data) && inventory?.data?.length > 0 ? (
                <CommandGroup>
                  {inventory?.data?.map((inv: any) => {
                    return (
                      <CommandItem
                        key={inv.id}
                        value={inv.id}
                        onMouseDown={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          console.log("command item");
                        }}
                        // onSelect={() => handleKeyDown(inv)}
                        className="flex items-center gap-2 w-full"
                      >
                        <div className="flex gap-3 items-center col-span-2">
                          <AvatarItem src={`${inv.product?.image?.src}`} />

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
              ) : (
                <Command.Empty className="select-none rounded-sm px-2 py-3 text-sm text-center">
                  Empty
                </Command.Empty>
              )}
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  );
};
export default AutoComplete;
