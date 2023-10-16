"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import DynamicDialogContent from "./DialogContent";
import {
  MoreVertical,
  Trash2,
  BookmarkPlus,
  Bookmark,
  Settings,
} from "lucide-react";
import ClearCartDialog from "./ClearCartDialog";

export default function CartActions() {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              className="flex data-[state=open]:bg-muted ml-auto"
            >
              Menu
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            {/* dialog */}
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={() => setSelected("hold")}>
                <BookmarkPlus className="w-4 h-4 mr-2" />
                Save
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={() => setSelected("saved")}>
                <Bookmark className="w-4 h-4 mr-2" />
                Saved
              </DropdownMenuItem>
            </DialogTrigger>

            <DropdownMenuItem onSelect={() => setSelected("saved")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* alert dialog */}
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-popover-foreground">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <DynamicDialogContent content={selected} onOpenChange={setOpen} />

        <ClearCartDialog />
      </AlertDialog>
    </Dialog>
  );
}
