"use client";
import React from "react";

import Numeral from "numeral";

import { useFormContext, useWatch } from "react-hook-form";

import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
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
import Popover from "./Popover";
import { AvatarItem } from "@/components/shared/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // handle quantity minus
  const handleMinus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const currentQuantity = fields[index].quantity;
    const newQuantity =
      currentQuantity - 1 === 0 ? -1 : Number(fields[index].quantity) - 1;
    update(index, {
      ...fields[index],
      quantity: newQuantity,
    });

    // triggered line items recalculation
    handleUpdate("quantity", index);
  };

  // handle quantity plus
  const handlePlus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const currentQuantity = fields[index].quantity;
    const newQuantity =
      currentQuantity + 1 === 0 ? 1 : Number(fields[index].quantity) + 1;
    update(index, {
      ...fields[index],
      quantity: newQuantity,
    });

    // triggered line items recalculation
    handleUpdate("quantity", index);
  };

  /**
   * Calculate line items total
   * This function gets triggered on
   * price, quantity and discount change
   *
   * @param name @string
   * @param index  @number
   */
  const handleUpdate = (name: string, index: number) => {
    const lineItem = form.getValues(`lineItems.${index}`);
    const { price, quantity, totalDiscount, taxRate } = lineItem;

    const totalBeforeDiscount = Number(price || 0) * Number(quantity || 0);
    const taxableAmount = totalBeforeDiscount - Number(totalDiscount || 0);
    const totalTax = 0;
    const total = taxableAmount + Number(totalTax);
    update(
      index,
      {
        ...lineItem,
        totalBeforeDiscount,
        totalTax,
        total,
      },
      { focusName: `lineItems.${index}.${name}` }
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {!fields || fields.length === 0 ? (
        <div className="flex flex-col h-full w-full grow items-center justify-center text-muted-foreground dark:text-background">
          <ShoppingBag className="w-20 h-20" />
        </div>
      ) : (
        <ScrollArea className="flex-1 space-y-2 -mx-4 px-4">
          <Accordion type="single" collapsible className="h-full divide-y">
            {fields.map(
              (
                {
                  id,
                  imageSrc,
                  quantity,
                  title,
                  total,
                  totalBeforeDiscount,
                  variantTitle,
                },
                i: number
              ) => (
                <AccordionItem
                  key={id}
                  value={`lineItem-${i}`}
                  className="border-b-0 py-1.5 first:pt-0 last:pb-0 relative snap-start"
                >
                  <AccordionTrigger asChild>
                    <div className="!py-0 hover:no-underline flex gap-2 cursor-pointer relative">
                      <AvatarItem
                        className="w-14 h-14 rounded-md flex-0 bg-border dark:bg-secondary"
                        src={imageSrc}
                      />

                      <div className="grid grid-cols-4 flex-1 h-14">
                        <div className="text-left col-span-3 space-y-1 text-sm font-normal truncate">
                          <div className="truncate">{title}</div>
                          <div className="flex justify-between items-end">
                            {variantTitle && (
                              <Badge
                                className="inline-flex py-0"
                                variant="secondary"
                              >
                                {variantTitle}
                              </Badge>
                            )}

                            <Badge
                              className="shrink-0 px-0 py-0 min-w-[5rem] ml-auto"
                              variant={
                                quantity < 1 ? "destructive" : "secondary"
                              }
                            >
                              <Button
                                onClick={(e) => handleMinus(e, i)}
                                size="icon"
                                variant="outline"
                                className="rounded-full w-6 h-6"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="grow text-center shrink-0 min-w-8 block">
                                {quantity}
                              </span>
                              <Button
                                size="icon"
                                onClick={(e) => handlePlus(e, i)}
                                variant="outline"
                                className="rounded-full w-6 h-6"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between pb-1 h-full font-medium text-right">
                          <div className="line-through text-muted-foreground text-xs">
                            {totalBeforeDiscount > total &&
                              Numeral(totalBeforeDiscount).format()}
                          </div>

                          <div>{Numeral(total).format()}</div>
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
                                      field.onChange(e);
                                      return handleUpdate("price", i);
                                    }}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="hidden">
                          <FormField
                            control={form.control}
                            name={`lineItems.${i}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    onChange={(e) => {
                                      e.preventDefault();
                                      field.onChange(e);
                                      return handleUpdate("quantity", i);
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
                                      e.preventDefault();
                                      field.onChange(e);
                                      return handleUpdate("totalDicount", i);
                                    }}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        variant="link"
                        className="text-error w-full mt-2"
                        onClick={() => remove(i)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        </ScrollArea>
      )}

      <div className="border-t-2 pt-2 border-dashed">
        <div className="flex flex-col text-sm">
          <div className="flex justify-between py-1">
            <div>Subtotal</div>
            <div>{Numeral(form.watch("subtotal")).format()}</div>
          </div>
          <div className="flex justify-between py-1">
            <div>
              Discount
              <Popover />
            </div>
            <div>{Numeral(form.watch("subtotal")).format()}</div>
          </div>

          <div className="flex justify-between py-1">
            <div>
              Tax
              <span className="ml-2 text-muted-foreground capitalize">
                ({form.watch("taxType")})
              </span>
              <Popover />
            </div>
            <div>{Numeral(form.watch("subtotal")).format()}</div>
          </div>

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
