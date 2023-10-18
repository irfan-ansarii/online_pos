"use client";
import React from "react";

import Numeral from "numeral";

import { useFormContext } from "react-hook-form";

import { Plus, Minus, ShoppingBag, Image } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ProceedDialog from "./ProceedDialog";
import CartActions from "./CartActions";

const Cart = () => {
  const form = useFormContext();

  const { fields, update, remove, register } = form!;

  const handleMinus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const currentQuantity = fields[index].quantity;
    if (currentQuantity > 1) {
      update(index, { ...fields[index], quantity: fields[index].quantity - 1 });
      return;
    }
    remove(index);
  };

  const handlePlus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    update(index, { ...fields[index], quantity: fields[index].quantity + 1 });
  };

  return (
    <div className="flex flex-col h-full w-full relative space-y-2">
      {(!fields || fields.length === 0) && (
        <div className="flex flex-col h-full w-full grow items-center justify-center text-muted-foreground dark:text-background">
          <ShoppingBag className="w-20 h-20" />
        </div>
      )}
      {fields && fields.length > 0 && (
        <ScrollArea className="grow h-full -mx-4 px-4">
          <Accordion type="single" collapsible className="h-full space-y-2">
            {fields.map((field: any, i: number) => (
              <AccordionItem
                value={`item-${i}`}
                className="bg-background dark:bg-popover border-none rounded-md relative"
              >
                <AccordionTrigger asChild>
                  <div className="!py-0 hover:no-underline flex cursor-pointer">
                    <Avatar className="w-14 h-full rounded-md shrink-0 bg-border dark:bg-secondary">
                      <AvatarImage alt="@shadcn" />
                      <AvatarFallback className="bg-transparent text-muted-foreground rounded-md">
                        <Image className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid grid-cols-12 p-2 grow">
                      <div className="text-left col-span-9 space-y-1 text-sm font-normal  truncate">
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
                      <div className="col-span-3 space-y-1.5 h-full font-medium text-right">
                        <div>{Numeral(field.salePrice).format()}</div>
                        <div className=" line-through text-muted-foreground">
                          <div>
                            {Numeral(field.salePrice * field.discount).format()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="[&>div]:pb-0 ">
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-4 border-t pt-2">
                      <div className="space-y-1.5">
                        <Label>Price</Label>
                        <Input {...register(`lineItems.${i}.price`)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Discount (%)</Label>
                        <Input {...register(`lineItems.${i}.discount`)} />
                      </div>
                    </div>
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
            <div>{Numeral(form.getValues("subtotal")).format()}</div>
          </div>
          <div className="flex justify-between py-1">
            <div>Discount</div>
            <div>{Numeral(form.getValues("totalDiscount")).format()}</div>
          </div>
          <div className="flex justify-between py-1">
            <div>Tax</div>
            <div>{Numeral(form.getValues("totalTax")).format()}</div>
          </div>

          <div className="border-b-2 border-dashed my-2 " />

          <div className="flex justify-between py-1 text-lg font-medium">
            <div>Total</div>
            <div>{Numeral(form.getValues("total")).format()}</div>
          </div>
        </div>

        <div className="mt-2">
          <ProceedDialog />
        </div>
        <CartActions />
      </div>
    </div>
  );
};

export default Cart;
