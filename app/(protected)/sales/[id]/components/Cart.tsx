"use client";
import React from "react";

import Numeral from "numeral";

import { useFormContext, useWatch } from "react-hook-form";

import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { AvatarItem } from "@/components/shared/avatar";

import TaxPopover from "../../new/components/TaxPopover";

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
  const handleMinus = React.useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      const currentQuantity = fields[index].quantity;
      const newQuantity =
        currentQuantity - 1 === 0 ? -1 : Number(fields[index].quantity) - 1;
      update(index, {
        ...watch[index],
        quantity: newQuantity,
      });
    },
    [fields, update]
  );

  // handle plus quantity
  const handlePlus = React.useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      const currentQuantity = fields[index].quantity;
      const newQuantity =
        currentQuantity + 1 === 0 ? 1 : Number(fields[index].quantity) + 1;
      update(index, {
        ...watch[index],
        quantity: newQuantity,
      });
    },
    [fields, update]
  );

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {(!fields || fields.length === 0) && (
        <div className="flex flex-col h-full w-full grow items-center justify-center text-muted-foreground dark:text-background">
          <ShoppingBag className="w-20 h-20" />
        </div>
      )}
      {fields && fields.length > 0 && (
        <ScrollArea className="flex-1 space-y-2 -mx-4 px-4">
          <Accordion type="single" collapsible className="h-full divide-y">
            {fields.map((field: any, i: number) => (
              <AccordionItem
                key={field.id}
                value={field.id}
                className="border-b-0 py-1.5 first:pt-0 last:pb-0 snap-start"
              >
                <AccordionTrigger asChild>
                  <div className="!py-0 hover:no-underline flex gap-2 cursor-pointer">
                    <AvatarItem
                      className="w-14 h-14 rounded-md flex-0 bg-border dark:bg-secondary"
                      src={field?.imageSrc}
                    />

                    <div className="grid grid-cols-4 flex-1 h-14">
                      <div className="text-left col-span-3 space-y-1 text-sm font-normal truncate">
                        <div className="truncate">{field.title}</div>
                        <div className="flex justify-between items-end">
                          {field.variantTitle && (
                            <Badge
                              className="inline-flex py-0"
                              variant="secondary"
                            >
                              {field.variantTitle}
                            </Badge>
                          )}

                          <Badge
                            className="shrink-0 px-0 py-0 min-w-[5rem] ml-auto"
                            variant={
                              field.quantity < 1 ? "destructive" : "secondary"
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
                              {field.quantity}
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
                          {watch[i]?.total <
                            Number(watch[i]?.total) +
                              Number(watch[i]?.totalDiscount) &&
                            Numeral(
                              Number(watch[i]?.total) +
                                Number(watch[i]?.totalDiscount)
                            ).format()}
                        </div>

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
                                <Input {...field} />
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
                                <Input {...field} />
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
            ))}
          </Accordion>
        </ScrollArea>
      )}
      <div className="border-t-2 pt-2 border-dashed">
        <div className="flex flex-col text-sm">
          <div className="flex justify-between py-1">
            <div>Subtotal</div>
            <div>{Numeral(form.watch("subtotal")).format()}</div>
          </div>

          <div className="flex items-center py-1">
            <div>Discount</div>
            <div className="ml-auto">
              {form.watch("totalDiscount") > 0 && "- "}
              {Numeral(form.watch("totalDiscount")).format()}
            </div>
          </div>

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
          <Button className="w-full">Proceed</Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
