"use client";
import React from "react";

import Numeral from "numeral";

import { useFormContext, useWatch } from "react-hook-form";

import { Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import ProceedDialog from "./ProceedDialog";
import CartActions from "./CartActions";
import DiscountPopover from "./DiscountPopover";
import TaxPopover from "./TaxPopover";
import { AvatarItem } from "@/components/shared/avatar";

const Cart = ({
  fields,
  remove,
  update,
}: {
  fields: any;
  remove: any;
  update: any;
}) => {
  const form = useFormContext();

  // listen line item changes
  const watch = useWatch({
    control: form.control,
    name: "lineItems",
  });

  // handle quantity minus
  const handleMinus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const currentQuantity = fields[index].quantity;
    if (currentQuantity > 1) {
      update(index, {
        ...watch[index],
        quantity: Number(fields[index].quantity) - 1,
      });

      return;
    }
    remove(index);
  };

  // handle quantity plus
  const handlePlus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();

    update(index, {
      ...watch[index],
      quantity: Number(watch[index].quantity) + 1,
    });
  };

  /**
   * calculate tax helper function
   * @param {taxRate, itemTotal}
   * @returns
   */
  const calculateTax = ({
    taxRate,
    total,
  }: {
    taxRate: number;
    total: number;
  }) => {
    const taxType = form.watch("taxType");

    const taxAmount =
      taxType === "included"
        ? total - total / (1 + taxRate / 100)
        : total * (taxRate / 100);

    return taxAmount;
  };

  /**
   * handle price and discount change
   * @param {index, price, discount}
   */
  const handleFieldChange = ({
    index,
    price,
    discount,
  }: {
    index: number;
    price: number;
    discount: number;
  }) => {
    const total = Number(price * fields[index].quantity) - discount;

    const taxAmount = calculateTax({
      taxRate: fields[index].taxRate,
      total: total,
    });

    form.setValue(`lineItems.${index}.totalTax`, taxAmount);
    form.setValue(`lineItems.${index}.total`, total);
  };

  /**
   * calculate tax and total on line item or tax type change
   */
  React.useEffect(() => {
    fields.forEach((item: any, i: number) => {
      const taxableAmount = item.price * item.quantity - item.totalDiscount;

      const taxAmount = calculateTax({
        taxRate: item.taxRate,
        total: taxableAmount,
      });

      form.setValue(`lineItems.${i}.totalTax`, taxAmount);
      form.setValue(`lineItems.${i}.total`, taxableAmount);
    });
  }, [form.watch("taxType"), fields]);

  /**
   * calculate cart on line item change
   */
  React.useEffect(() => {
    const taxType = form.getValues("taxType");
    const result = watch.reduce(
      (acc: any, curr: any) => {
        const total = curr.price * curr.quantity - curr.totalDiscount || 0;

        acc.subtotal += Number(total) + Number(curr.totalDiscount || 0);
        acc.totalDiscount += curr.totalDiscount || 0;
        acc.totalTax += curr.totalTax;
        acc.total += taxType === "included" ? total : total + curr.totalTax;
        return acc;
      },
      {
        subtotal: 0,
        totalTax: 0,
        totalDiscount: 0,
        total: 0,
      }
    );
    Object.entries(result).map(([key, value]) => {
      form.setValue(key, value);
    });
  }, [watch]);

  return (
    <div className="flex flex-col h-full w-full relative space-y-2">
      {(!fields || fields.length === 0) && (
        <div className="flex flex-col h-full w-full grow items-center justify-center text-muted-foreground dark:text-background">
          <ShoppingBag className="w-20 h-20" />
        </div>
      )}
      {fields && fields.length > 0 && (
        <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox -mx-4">
          <Accordion type="single" collapsible className="h-full divide-y px-4">
            {fields.map((field: any, i: number) => (
              <AccordionItem
                key={field.id}
                value={field.id}
                className="border-b-0 py-1.5 first:pt-0 last:pb-0 relative snap-start"
              >
                <AccordionTrigger asChild>
                  <div className="!py-0 hover:no-underline flex gap-2 cursor-pointer">
                    <AvatarItem
                      className="w-14 h-14 rounded-md flex-0 bg-border dark:bg-secondary"
                      src={`/${field.imageSrc}`}
                    />

                    <div className="grid grid-cols-4 flex-1 h-14">
                      <div className="text-left col-span-3 space-y-1 text-sm font-normal truncate">
                        <div className="truncate">{field.title}</div>
                        <div className="flex justify-between">
                          {field.variantTitle && (
                            <Badge
                              className="inline-flex py-0"
                              variant="secondary"
                            >
                              {field.variantTitle}
                            </Badge>
                          )}

                          <Badge
                            className="shrink-0 px-0 py-0 min-w-[5rem] bg-secondary/80 ml-auto"
                            variant="secondary"
                          >
                            <Button
                              onClick={(e) => handleMinus(e, i)}
                              size="icon"
                              variant="secondary"
                              className="rounded-full w-6 h-6"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="grow text-center shrink-0 min-w-8 block">
                              {field.quantity}
                            </span>
                            <Button
                              size="icon"
                              onClick={(e) => handlePlus(e, i)}
                              variant="secondary"
                              className="rounded-full w-6 h-6"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end pb-1 h-full font-medium text-right">
                        {watch[i]?.total <
                          watch[i]?.total + watch[i]?.totalDiscount && (
                          <div className="line-through text-muted-foreground text-xs">
                            {Numeral(
                              Number(watch[i]?.total) +
                                Number(watch[i]?.totalDiscount)
                            ).format()}
                          </div>
                        )}
                        <div>{Numeral(watch[i]?.total).format()}</div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="[&>div]:pb-0">
                  <div className="py-1.5">
                    <div className="grid grid-cols-2 gap-4 border-t pt-1.5">
                      <div className="space-y-1.5">
                        <FormField
                          control={form.control}
                          name={`lineItems.${i}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    handleFieldChange({
                                      index: i,
                                      price: parseFloat(e.target.value),
                                      discount: watch[i].totalDiscount,
                                    });

                                    return field.onChange(e);
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <FormField
                          control={form.control}
                          name={`lineItems.${i}.totalDiscount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  onChange={(e) => {
                                    handleFieldChange({
                                      index: i,
                                      price: watch[i].price,
                                      discount: parseFloat(e.target.value),
                                    });

                                    return field.onChange(e);
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
      <div className="border-t-2 pt-2 border-dashed">
        <div className="flex flex-col text-sm">
          <div className="flex justify-between py-1">
            <div>Subtotal</div>
            <div>{Numeral(form.watch("subtotal")).format()}</div>
          </div>

          <DiscountPopover />

          <TaxPopover />

          <div className="border-b-2 border-dashed my-2 " />

          <div className="flex items-center py-1 text-lg font-medium">
            <div>Total</div>
            <div className="ml-auto">
              {Numeral(Math.ceil(form.watch("total"))).format()}
            </div>
          </div>
        </div>

        <div className="mt-2">
          <ProceedDialog disabled={fields.length <= 0} />
        </div>
        <CartActions />
      </div>
    </div>
  );
};

export default Cart;
