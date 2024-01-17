"use client";
import React from "react";
import {
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowUpDown, ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

const sortingtrigger = (
  <Button size="icon" variant="ghost" className="bg-secondary">
    <ArrowUpDown className="w-4 h-4" />
  </Button>
);

const filtertrigger = (
  <Button size="icon" variant="ghost" className="bg-secondary">
    <ListFilter className="w-4 h-4" />
  </Button>
);

export const Sorting = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>{sortingtrigger}</PopoverTrigger>
      <PopoverContent className="w-40 bg-background p-3">
        <h4 className="font-semibold leading-none">Sort</h4>
        <Separator className="my-3" />

        <RadioGroup defaultValue="comfortable">
          <RadioGroupItem
            value="comfortable"
            id="r2"
            className="peer sr-only"
          />
          <Label
            htmlFor="r2"
            className="peer-data-[state=checked]:border-primary inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Ascending
          </Label>

          <RadioGroupItem value="compact" id="r3" />
          <Label htmlFor="r3">Descending</Label>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};

export const Filter = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>{filtertrigger}</PopoverTrigger>
      <PopoverContent className="w-52 bg-background p-3">
        <h4 className="font-semibold leading-none">Sort</h4>
        <Separator className="my-3" />

        <RadioGroup defaultValue="comfortable">
          <RadioGroupItem
            value="comfortable"
            id="r2"
            className="peer sr-only"
          />
          <Label
            htmlFor="r2"
            className="peer-data-[state=checked]:border-primary inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Ascending
          </Label>

          <RadioGroupItem value="compact" id="r3" />
          <Label htmlFor="r3">Descending</Label>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
};
