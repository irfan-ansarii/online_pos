"use client";
import React from "react";
import { ListFilter } from "lucide-react";
import { useQueryParams } from "@/hooks/useQueryParams";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Filters = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto gap-2" variant="secondary">
            <ListFilter className="w-4 h-4" />
            <span className="capitalize font-normal">
              {queryParams.status || "Filters"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 bg-background" align="end">
          {["active", "archived", "trash"].map((item) => (
            <DropdownMenuItem
              className="capitalize"
              onClick={() => {
                if (queryParams.status === item) {
                  setQueryParams({ status: null });
                  return;
                }
                setQueryParams({ status: item });
              }}
            >
              {item}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setQueryParams({ status: null })}>
            Clear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Filters;
