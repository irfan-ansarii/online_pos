"use client";
import React from "react";
import Numeral from "numeral";
import { PenSquare, AlertCircle } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "@/components/ui/input";
const DiscountPopover = () => {
  // form context
  const form = useFormContext();

  // listen on lineItemm changes
  const lineItems = useWatch({
    control: form.control,
    name: "lineItems",
  });
  const discount = useWatch({
    control: form.control,
    name: "discountLine",
  });

  React.useEffect(() => {
    const taxType = form.getValues("taxType");

    lineItems.forEach((item: any, i: number) => {
      const itemTotal = item.price * item.quantity;

      const discountAmount =
        discount.type === "fixed"
          ? discount.value
          : itemTotal * (discount.value / 100);
      const taxableAmount = itemTotal - discountAmount;

      const taxAmount =
        taxType === "included"
          ? taxableAmount - taxableAmount / (1 + item.taxRate / 100)
          : taxableAmount * (item.taxRate / 100);

      form.setValue(`lineItems.${i}.totalTax`, taxAmount);
      form.setValue(`lineItems.${i}.total`, taxableAmount);
      form.setValue(`lineItems.${i}.totalDiscount`, discountAmount || 0);
    });
  }, [discount]);

  return (
    <Popover>
      <div className="flex items-center py-1">
        <div>Discount</div>
        <PopoverTrigger asChild>
          <span
            className={`ml-4 cursor-pointer inline-flex items-center text-muted-foreground`}
          >
            <PenSquare className="w-3 h-3" />
          </span>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-full min-w-[20rem] bg-background flex flex-col space-y-4"
        >
          <div className="space-y-2">
            <FormField
              control={form.control}
              name={`discountLine.type`}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Discount Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      className="flex"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem className="flex flex-1 items-center space-y-0 gap-2">
                        <FormControl>
                          <RadioGroupItem value="percent" />
                        </FormControl>
                        <FormLabel className="font-normal text-muted-foreground flex-1 cursor-pointer">
                          Percentage
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex flex-1 items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fixed" />
                        </FormControl>
                        <FormLabel className="font-normal text-muted-foreground flex-1 cursor-pointer truncate">
                          Fixed Amount
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name={`discountLine.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </PopoverContent>

        <div className="ml-auto">
          {form.watch("totalDiscount") > 0 && "- "}
          {Numeral(form.watch("totalDiscount")).format()}
        </div>
      </div>
    </Popover>
  );
};

export default DiscountPopover;
