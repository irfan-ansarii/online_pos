"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import StickyHeader from "@/components/shared/sticky-header";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

const Page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <>
      <StickyHeader>
        <div className="grid grid-cols-2 items-center">
          <div className="relative">
            <span className="absolute inset-y-0 inline-flex items-center pr-4 text-muted-foreground">
              <Search className="w-5 h-5" />
            </span>
            <Input
              className="bg-transparent rounded-none border-none pl-8 focus-visible:ring-transparent"
              placeholder="Search..."
            />
          </div>
          <div className="relative">
            <div className="flex gap-4 items-center">
              <div className="flex items-center">
                <span className="text-muted-foreground text-sm font-medium">
                  Group By:
                </span>
                <Select>
                  <SelectTrigger className="w-[180px] ml-2 border-none">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Group By</SelectLabel>
                      <Separator />
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="banana">Banana</SelectItem>
                      <SelectItem value="blueberry">Blueberry</SelectItem>
                      <SelectItem value="grapes">Grapes</SelectItem>
                      <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                <span>my tasks</span>
              </div>
            </div>
          </div>
        </div>
      </StickyHeader>
    </>
  );
};

export default Page;
