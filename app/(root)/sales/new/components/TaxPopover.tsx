"use client";
import React from "react";
import Numeral from "numeral";
import { PenSquare } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Separator } from "@/components/ui/separator";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";

import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const items = [
  {
    id: "cgst",
    label: "CGST",
  },
  {
    id: "sgst",
    label: "SGST",
  },
  {
    id: "igst",
    label: "IGST",
  },
];

const TaxPopover = () => {
  const form = useFormContext();

  return (
    <Popover>
      <div className="flex items-center py-1">
        <div>Tax</div>
        <PopoverTrigger asChild>
          <span className="ml-4 cursor-pointer text-muted-foreground inline-flex items-center">
            <span className="text-sm font-normal capitalize">
              ( {form.watch("taxType")} )
            </span>
            <PenSquare className="w-3 h-3 ml-2" />
          </span>
        </PopoverTrigger>
        <PopoverContent className="min-w-[20rem] w-full bg-background flex flex-col">
          <FormField
            control={form.control}
            name="taxType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <div className="space-y-1">
                  <FormLabel>Tax Type</FormLabel>
                  <FormDescription>
                    Tax will be calculated according to the selected type.
                  </FormDescription>
                </div>
                <FormControl>
                  <RadioGroup
                    className="space-y-2"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <PopoverClose asChild>
                      <FormItem className="flex items-center justify-between space-y-0">
                        <FormLabel className="font-normal flex-1 cursor-pointer">
                          Included
                        </FormLabel>
                        <FormControl>
                          <RadioGroupItem value="included" />
                        </FormControl>
                      </FormItem>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <FormItem className="flex items-center justify-between space-y-0">
                        <FormLabel className="font-normal flex-1 cursor-pointer">
                          Excluded
                        </FormLabel>
                        <FormControl>
                          <RadioGroupItem value="excluded" />
                        </FormControl>
                      </FormItem>
                    </PopoverClose>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <FormField
            control={form.control}
            name="taxAllocations"
            render={() => (
              <FormItem className="space-y-3">
                <div className="space-y-1">
                  <FormLabel>Tax Allocations</FormLabel>
                  <FormDescription>
                    Tax amount will be divided among the selected taxes.
                  </FormDescription>
                </div>

                {items.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="taxAllocations"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormLabel className="font-normal flex-1 cursor-pointer">
                            {item.label}
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                console.log(field);
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: any) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </FormItem>
            )}
          />
        </PopoverContent>

        <div className="ml-auto">
          {Numeral(form.watch("totalTax")).format()}
        </div>
      </div>
    </Popover>
  );
};

export default TaxPopover;
