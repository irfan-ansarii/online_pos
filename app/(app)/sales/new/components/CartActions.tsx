"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
export default function CartActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="flex data-[state=open]:bg-muted ml-auto"
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Add Customer</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Hold</DropdownMenuItem>
        <DropdownMenuItem>Saved</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>Clear</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
