"use client";
import React from "react";
import { useState, useRef, useCallback } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Loader2, Search } from "lucide-react";
import { useToggle } from "@uidotdev/usehooks";
import { useInventory } from "@/hooks/useInventory";

import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

import { Badge } from "../ui/badge";
import { AvatarItem } from "@/components/shared/avatar";
import LoadingSmall from "./loading-sm";
import { toast } from "../ui/use-toast";

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!isLoading) {
        processSelection();
      }
    }
  };

  const processSelection = () => {
    const foundItem = inventory?.data?.find(
      (inv: any) =>
        inv.variant.barcode?.toLowerCase() === inputValue.toLocaleLowerCase()
    );

    if (foundItem) {
      if (onSelect) onSelect(foundItem);
      setInputValue("");
    } else {
      toast({
        variant: "error",
        title: "error",
      });
    }
  };

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isLoading) {
      intervalId = setInterval(() => {
        if (!isLoading) {
          clearInterval(intervalId);
          processSelection();
        }
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [isLoading]);
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
          onKeyDown={handleKeyDown}
          onFocus={() => toggle(true)}
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
      {/* error */}
      {error && (
        <p className="text-sm font-medium text-destructive mt-2">{error}</p>
      )}
    </CommandPrimitive>
  );
};
export default AutoComplete;
