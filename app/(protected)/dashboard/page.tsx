"use client";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as React from "react";

import { useState } from "react";

export function PickerExample() {
  return (
    <div className="w-full h-full preview flex min-h-[350px] justify-center p-10 items-center rounded !bg-cover !bg-center transition-all">
      {/* <ColorPicker /> */}
    </div>
  );
}

export default function ColorPicker({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [selected, setSelected] = useState<string>("");
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-transparent">
            <div
              className="flex h-8 w-8 shadow items-center border-2 justify-center rounded-full text-xs"
              style={{ borderColor: "red" }}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: "blue" }}
              ></span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="grid grid-cols-8 gap-2">
          popovver
        </PopoverContent>
      </Popover>
    </>
  );
}
