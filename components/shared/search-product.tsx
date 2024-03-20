"use client";
import React from "react";
import { useState, useRef, useCallback, useMemo } from "react";
import { Loader2, ScanLine } from "lucide-react";

import { Command as CommandPrimitive } from "cmdk";
import { useToggle } from "@uidotdev/usehooks";
import { useInventory } from "@/hooks/useInventory";

import { Input } from "@/components/ui/input";

import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

import { AvatarItem } from "@/components/shared/avatar";
import { Badge } from "@/components/ui/badge";

export type Option = Record<"value" | "label", string> & Record<string, string>;

const AutoComplete = ({ onSelect }: { onSelect: (value: Option) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [process, setProcess] = useToggle(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { inventory, isLoading } = useInventory({ search: searchTerm });

  /** handle key down */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const input = inputRef.current;

      if (!input) return;

      if (e.key === "Enter" && input.value !== "") {
        if (isLoading) {
          setProcess(true);
        } else {
          processSelection(input.value);
        }
      }
    },
    [isLoading]
  );

  /** handle selection */
  const processSelection = useCallback(
    (selectedBarcode: string) => {
      if (selectedBarcode === "") return;

      if (!Array.isArray(inventory?.data) || inventory?.data.length === 0) {
        setProcess(false);
        return;
      }

      const foundItem = inventory?.data?.find(
        (inv: any) =>
          inv.variant.barcode?.toLowerCase() === selectedBarcode.toLowerCase()
      );

      if (foundItem) {
        // @ts-ignore
        if (onSelect) onSelect(foundItem);
        setSearchTerm("");
        setProcess(false);
      }
    },
    [searchTerm, isLoading]
  );

  // const showPopup = useMemo(() => {
  //   return (
  //     !isLoading &&
  //     searchTerm !== "" &&
  //     Array.isArray(inventory?.data) &&
  //     inventory?.data?.length > 0
  //   );
  // }, [searchTerm, isLoading]);

  const showPopup =
    !isLoading &&
    searchTerm !== "" &&
    Array.isArray(inventory?.data) &&
    inventory?.data?.length > 0;

  const isError = useMemo(() => {
    return (
      !isLoading &&
      searchTerm !== "" &&
      (!Array.isArray(inventory?.data) || inventory?.data?.length <= 0)
    );
  }, [searchTerm, isLoading]);

  React.useEffect(() => {
    if (!isLoading && process) {
      processSelection(searchTerm);
    }
  }, [isLoading]);

  return (
    <CommandPrimitive onKeyDown={handleKeyDown}>
      <div className="relative [&_[cmdk-input-wrapper]>svg]:hidden [&_[cmdk-input-wrapper]]:p-0 [&_[cmdk-input-wrapper]]:border-0 [&_[cmdk-input-wrapper]>input]:pl-10 [&_[cmdk-input-wrapper]>input]:border [&_[cmdk-input-wrapper]>input]rounded-md [&_[cmdk-input-wrapper]>input:focus]:ring-2 [&_[cmdk-input-wrapper]>input:focus]:ring-ring [&_[cmdk-input-wrapper]>input:focus]:ring-offset-2 ring-offset-background">
        <span className="absolute inset-y-0 left-3 text-muted-foreground inline-flex items-center justify-center">
          <ScanLine className="w-4 h-4" />
        </span>
        <CommandInput
          ref={inputRef}
          value={searchTerm}
          onValueChange={setSearchTerm}
          onBlur={() => {
            // setSearchTerm("");
            setProcess(false);
          }}
          className="text-base"
        />
        {/* <Input
          ref={inputRef}
          value={searchTerm}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={() => {
            setSearchTerm("");
            setProcess(false);
          }}
          placeholder="Scan or search..."
          className={`pl-10 ${
            isError ? "border-destructive !ring-destructive/50" : ""
          }`}
        /> */}
        <span
          className={`absolute inset-y-0 right-3 text-muted-foreground inline-flex items-center justify-cente ${isLoading ? "opacity-100" : "opacity-0"}`}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </span>
      </div>

      {isError && <p className="text-error mt-1.5">Invalid barcode</p>}

      <div className="mt-0.5 relative">
        {showPopup && (
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
                        }}
                        onSelect={() => processSelection(inv?.variant?.barcode)}
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
              ) : // <Command.Empty className="select-none rounded-sm px-2 py-3 text-sm text-center">
              //   Empty
              // </Command.Empty>
              null}
            </CommandList>
          </div>
        )}
      </div>
    </CommandPrimitive>
  );
};
export default AutoComplete;
