"use client";
import React, {useState} from 'react'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DynamicDialogContent from "./DialogContent";
import {
  MoreHorizontal,
  Plus,
  Trash2,
  BookmarkPlus,
  Bookmark,
} from "lucide-react";

export default function CartActions() {

  const [selected, setSelected] = useState<string | null>(null)
  return (
    <Dialog>
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
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={()=>setSelected('add-customer')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={()=>setSelected('hold')}>
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Hold
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={()=>setSelected('saved')}>
              <Bookmark className="w-4 h-4 mr-2" />
              Saved
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />

          <DialogTrigger asChild>
            <DropdownMenuItem className="bg-destructive/50 focus:bg-destructive" onSelect={()=>setSelected('clear')}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DynamicDialogContent content={selected} />
    </Dialog>
  );
}
