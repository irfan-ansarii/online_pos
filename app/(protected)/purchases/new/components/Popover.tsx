"use client";
import React from "react";
import { PenSquare } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

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
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const DiscountPopover = ({
  handleUpdate,
}: {
  handleUpdate: (index: number) => void;
}) => {
  const [discount, setDiscount] = React.useState({ type: "fixed", amount: 0 });

  // form context
  const form = useFormContext();

  // listen on lineItemm changes
  const lineItems = useWatch({
    control: form.control,
    name: "lineItems",
  });

  const handleChange = (event: any) => {
    const { name, value } = event;
    setDiscount({ ...discount, [name]: value });
  };

  React.useEffect(() => {
    console.log("first");
    lineItems.forEach((item: any, i: number) => {
      const itemTotal = item.price * item.quantity;

      const discountAmount =
        discount.type === "fixed"
          ? discount.amount
          : itemTotal * (discount.amount / 100);

      const taxableAmount = itemTotal - discountAmount;

      form.setValue(`lineItems.${i}.total`, taxableAmount);
      form.setValue(`lineItems.${i}.totalDiscount`, discountAmount || 0);

      handleUpdate(i);
    });
  }, [discount, form.watch("taxType"), form.watch("saleType")]);

  return (
    <Popover>
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
          <Label>Discount Type</Label>

          <RadioGroup
            defaultValue={discount.type}
            onValueChange={(value) =>
              handleChange({
                name: "type",
                value: value,
              })
            }
          >
            <Label
              htmlFor="percent"
              className="flex py-1 text-muted-foreground items-center flex-1 cursor-pointer"
            >
              <RadioGroupItem value="percent" id="percent" />
              <span className="ml-2">Percent</span>
            </Label>

            <Label
              htmlFor="fixed"
              className="flex py-1 text-muted-foreground items-center flex-1 cursor-pointer "
            >
              <RadioGroupItem value="fixed" id="fixed" />
              <span className="ml-2">Fixed</span>
            </Label>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Discount Value</Label>
          <Input
            value={discount.amount}
            onChange={(e) =>
              handleChange({ name: "amount", value: e.target.value })
            }
          />
        </div>
        <Separator className="my-4" />
        <FormField
          control={form.control}
          name="taxType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tax Type</FormLabel>
              <FormControl>
                <RadioGroup
                  className="gap-3"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem className="flex flex-1 items-center gap-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="included" />
                    </FormControl>
                    <FormLabel className="font-normal text-muted-foreground flex-1 cursor-pointer">
                      Included
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex flex-1 items-center gap-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="excluded" />
                    </FormControl>
                    <FormLabel className="font-normal text-muted-foreground flex-1 cursor-pointer">
                      Excluded
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="saleType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Sale Type</FormLabel>
              <FormControl>
                <RadioGroup
                  className="gap-3"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem className="flex flex-1 items-center gap-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="state" />
                    </FormControl>
                    <FormLabel className="font-normal text-muted-foreground flex-1 cursor-pointer">
                      State
                    </FormLabel>
                  </FormItem>

                  <FormItem className="flex flex-1 items-center gap-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="inter_state" />
                    </FormControl>
                    <FormLabel className="font-normal text-muted-foreground flex-1 cursor-pointer">
                      Inter State
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <PopoverClose asChild>
          <Button variant="secondary" className="w-full">
            Close
          </Button>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  );
};

export default DiscountPopover;
