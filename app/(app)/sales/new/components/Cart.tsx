"use client";
import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { fields } = form;

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
            {fields.map((field, i) => (
              <AccordionItem
                value={`item-${i}`}
                className="bg-background dark:bg-popover border-none rounded-md relative"
              >
                <AccordionTrigger asChild>
                  <div className="!py-0 hover:no-underline flex cursor-pointer">
                    <Avatar className="w-14 h-full rounded-md shrink-0 bg-border dark:bg-secondary">
                      <AvatarImage alt="@shadcn" />
                      <AvatarFallback className="bg-transparent rounded-md">
                        CN
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid grid-cols-12 p-2 grow">
                      <div className="text-left col-span-9 space-y-1 text-sm font-normal  truncate">
                        <div className="truncate">{field.title}</div>
                        <div className="flex justify-between">
                          <Badge
                            className="inline-flex py-0"
                            variant="secondary"
                          >
                            S
                          </Badge>
                          <Badge
                            className="shrink-0 px-0 py-0 min-w-[5rem] bg-secondary/80"
                            variant="secondary"
                          >
                            <Button
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
                              variant="secondary"
                              className="rounded-full w-6 h-6"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </Badge>
                        </div>
                      </div>
                      <div className="col-span-3 space-y-1.5 h-full font-medium text-right">
                        <div>1,490.05</div>
                        <div className=" line-through text-muted-foreground">
                          1,490.05
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="[&>div]:pb-0 ">
                  <div className="p-2">
                    <div className="grid grid-cols-2 gap-4 border-t pt-2">
                      <Input></Input>

                      <Input></Input>
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
            <div>0.00</div>
          </div>
          <div className="flex justify-between py-1">
            <div>Discount</div>
            <div>0.00</div>
          </div>
          <div className="flex justify-between py-1">
            <div>Tax</div>
            <div>0.00</div>
          </div>

          <div className="border-b-2 border-dashed my-2 " />

          <div className="flex justify-between py-1 text-lg font-medium">
            <div>Total</div>
            <div>0.00</div>
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
