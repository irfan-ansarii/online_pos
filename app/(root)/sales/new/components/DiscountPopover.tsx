"use client";
import React from "react";
import { PenSquare, AlertCircle } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
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
import { Button } from "@/components/ui/button";
const DiscountPopover = () => {
  // form context
  const form = useFormContext();

  // listen on lineItemm changes
  const lineItems = useWatch({
    control: form.control,
    name: "lineItems",
  });

  const discount = React.useMemo(() => {
    return form.getValues("discountLine");
  }, [form.getValues("discountLine")]);

  //  handle discount
  const handleDiscount = () => {
    const taxtype = form.getValues("taxType");

    for (let i = 0; i < lineItems.length; i++) {
      const item = lineItems[i];
      const value = parseFloat(discount.value || 0);
      const itemTotal =
        parseFloat(item.price || 0) * parseFloat(item.quantity || 0);

      const discountAmount =
        discount.type === "fixed" ? value : itemTotal * (value / 100);

      const taxableAmount = itemTotal - discountAmount;
      const taxAmount =
        taxtype === "included"
          ? taxableAmount - taxableAmount / (1 + 12 / 100)
          : taxableAmount * (12 / 100);
      // set line item discount, tax, and total
      form.setValue(`lineItems.${i}.totalTax`, taxAmount);
      form.setValue(`lineItems.${i}.totalDiscount`, discountAmount);
      form.setValue(`lineItems.${i}.total`, itemTotal - discountAmount);

      // set line item discount line
      form.setValue(`lineItems.${i}.discountLine.type`, discount.type);
      form.setValue(`lineItems.${i}.discountLine.value`, discount.value);
      form.setValue(`lineItems.${i}.discountLine.title`, discount.title);
    }
  };

  // check if has applied discount
  const hasProductDiscount = React.useMemo(() => {
    for (const item of lineItems) {
      if (item.totalDiscount > 0) {
        return true;
      }
      return false;
    }
  }, [lineItems]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <span
          className={`ml-4 cursor-pointer inline-flex items-center text-muted-foreground`}
        >
          <PenSquare className="w-3 h-3" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[20rem] bg-background flex flex-col space-y-4">
        {hasProductDiscount && (
          <Alert variant="destructive" className="flex items-center ">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>This will replace product discounts.</AlertTitle>
          </Alert>
        )}
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={`discountLine.type`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Discount Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    className="flex gap-6"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormItem className="flex flex-1 items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="percent" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Percentage
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex flex-1 items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fixed" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
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
        <div className="space-y-2">
          <FormField
            control={form.control}
            name={`discountLine.title`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <PopoverClose asChild>
          <Button size="sm" onClick={handleDiscount}>
            Apply
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default DiscountPopover;
