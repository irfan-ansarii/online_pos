"use client";
import React from "react";

import Numeral from "numeral";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Plus,
  Minus,
  ShoppingBag,
  Image,
  Pencil,
  PenSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ProceedDialog from "./ProceedDialog";
import CartActions from "./CartActions";

const Cart = ({ lineItems }: { lineItems: any }) => {
  const form = useFormContext();

  const { fields, remove, update } = lineItems;

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

  const calculate = () => {
    fields.map((curr: any, i: number) => {
      const total =
        parseFloat(curr.price) * parseFloat(curr.quantity) -
        (parseFloat(curr.totalDiscount) || 0);

      form.setValue(`lineItems.${i}.total`, total);
    });
  };

  React.useEffect(() => {
    calculate();
  }, [fields]);

  React.useEffect(() => {
    const result = watch.reduce(
      (acc: any, curr: any, i: number) => {
        const total =
          parseFloat(curr.price) * parseFloat(curr.quantity) -
          (parseFloat(curr.totalDiscount) || 0);

        const totalTax = total - total / (12 / 100 + 1);

        acc.subtotal += total - totalTax;
        acc.totalTax += totalTax;
        acc.total += total;
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
  }, [watch, fields]);

  return (
    <div className="flex flex-col h-full w-full relative space-y-2">
      {(!fields || fields.length === 0) && (
        <div className="flex flex-col h-full w-full grow items-center justify-center text-muted-foreground dark:text-background">
          <ShoppingBag className="w-20 h-20" />
        </div>
      )}
      {fields && fields.length > 0 && (
        <ScrollArea className="grow h-full -mx-4">
          <Accordion type="single" collapsible className="h-full divide-y px-4">
            {fields.map((field: any, i: number) => (
              <AccordionItem
                key={field.id}
                value={field.id}
                className="border-b-0 py-1 first:pt-0 last:pb-0 relative"
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
                      <div className="text-left col-span-9 space-y-1 text-sm font-normal truncate">
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
                        <div>{Numeral(watch[i]?.total).format()}</div>
                        {watch[i]?.total <
                          parseFloat(watch[i]?.total) +
                            parseFloat(watch[i]?.totalDiscount) && (
                          <div className="line-through text-muted-foreground">
                            {Numeral(
                              parseFloat(watch[i]?.total) +
                                parseFloat(watch[i]?.totalDiscount)
                            ).format()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="[&>div]:pb-0">
                  <div className="py-1">
                    <div className="grid grid-cols-2 gap-4 border-t pt-2">
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
                                    form.setValue(
                                      `lineItems.${i}.total`,
                                      (parseFloat(e.target.value) || 0) *
                                        watch[i].quantity -
                                        watch[i].totalDiscount
                                    );

                                    return field.onChange(e);
                                  }}
                                  onBlur={(e) =>
                                    field.onChange(e.target.value || 0)
                                  }
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
                                    form.setValue(
                                      `lineItems.${i}.total`,
                                      parseFloat(watch[i].price) *
                                        watch[i].quantity -
                                        (parseFloat(e.target.value) || 0)
                                    );
                                    return field.onChange(e);
                                  }}
                                  onBlur={(e) =>
                                    field.onChange(e.target.value || 0)
                                  }
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
            <Popover>
              <PopoverTrigger asChild>
                <span className="ml-4 cursor-pointer text-muted-foreground">
                  <PenSquare className="w-3 h-3" />
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-background flex flex-col space-y-4">
                <div className="space-y-2">
                  <FormLabel>Amount</FormLabel>
                  <Input />
                </div>
                <div className="space-y-2">
                  <FormLabel>Reason</FormLabel>
                  <Input />
                </div>
                <Button>Apply</Button>
              </PopoverContent>
            </Popover>
            <div className="ml-auto">
              {Numeral(form.watch("totalDiscount")).format()}
            </div>
          </div>

          <div className="border-b-2 border-dashed my-2 " />

          <div className="flex items-center py-1 text-lg font-medium">
            <div>Total</div>
            <Popover>
              <PopoverTrigger asChild>
                <span className="ml-4 cursor-pointer text-muted-foreground inline-flex items-center">
                  <span className="text-sm font-normal">(Tax Inclusive)</span>
                  <PenSquare className="w-3 h-3 ml-2" />
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-52 bg-background flex flex-col space-y-4">
                <RadioGroup defaultValue="Inclusive" className="space-y-2">
                  {["Inclusive", "Exclusive"].map((el) => (
                    <FormLabel
                      htmlFor={el}
                      key={el}
                      className="block cursor-pointer flex justify-between"
                    >
                      <div className="truncate w-full">{el}</div>
                      <RadioGroupItem
                        value={el}
                        id={el}
                        className="opacity-0 data-[state=checked]:opacity-100"
                      />
                    </FormLabel>
                  ))}
                </RadioGroup>
              </PopoverContent>
            </Popover>
            <div className="ml-auto">
              {Numeral(form.watch("total")).format()}
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
