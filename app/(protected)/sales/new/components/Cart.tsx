"use client";
import React from "react";

import Numeral from "numeral";

import { useFormContext, useWatch } from "react-hook-form";
import { useSheetToggle } from "@/hooks/useSheet";
import { Plus, Minus, ShoppingBag, Trash2, PackageMinus } from "lucide-react";
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
  handleUpdate,
}: {
  fields: any;
  remove: (index: number) => void;
  handleUpdate: (index: number) => void;
}) => {
  const [open, toggle] = useSheetToggle("new");
  const form = useFormContext();

  /**
   * listen to lineitems changes
   */
  const watch = useWatch({
    control: form.control,
    name: "lineItems",
  });

  /**
   * handle minus quantity on line items
   * @param e
   * @param index
   * @returns
   */
  const handleMinus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const currentQuantity = fields[index].quantity;

    if (currentQuantity === 1) {
      remove(index);
      return;
    }

    form.setValue(`lineItems.${index}.quantity`, currentQuantity - 1);
    // handle update
    handleUpdate(index);
  };

  /**
   * handle plus quantity on line items
   * @param e
   * @param index
   */
  const handlePlus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const currentQuantity = fields[index].quantity;
    if (currentQuantity === -1) {
      form.setValue(`lineItems.${index}.quantity`, 1);
    } else {
      form.setValue(`lineItems.${index}.quantity`, currentQuantity + 1);
    }
    // handle update
    handleUpdate(index);
  };

  /**
   * handle return item
   * @param index
   */
  const handleReturn = (index: number) => {
    const lineItem = form.getValues(`lineItems.${index}`);
    const quantity =
      lineItem.quantity > 0 ? -lineItem.quantity : Math.abs(lineItem.quantity);
    const discount =
      lineItem.quantity > 0
        ? -lineItem.totalDiscount
        : Math.abs(lineItem.totalDiscount);

    form.setValue(`lineItems.${index}.quantity`, quantity);
    form.setValue(`lineItems.${index}.totalDiscount`, discount);
    handleUpdate(index);
  };

  /**
   * update cart values on line items changes
   */
  React.useEffect(() => {
    const saleType = form.getValues(`saleType`);
    const result = watch.reduce(
      (acc: any, curr: any) => {
        acc.subtotal += curr.beforeDiscount;
        acc.totalDiscount += Number(curr.totalDiscount || 0);
        acc.totalTax += curr.totalTax;
        acc.invoiceTotal += curr.total;

        return acc;
      },
      {
        subtotal: 0,
        totalTax: 0,
        totalDiscount: 0,
        invoiceTotal: 0,
      }
    );
    const { invoiceTotal } = result;

    result.roundedOff = Math.ceil(invoiceTotal) - invoiceTotal;
    result.total = invoiceTotal + result.roundedOff;

    result.taxLines = [
      { title: "CGST", amount: result.totalTax / 2 },
      { title: "SGST", amount: result.totalTax / 2 },
    ];
    if (saleType === "inter_state") {
      result.taxLines = [{ title: "IGST", amount: result.totalTax }];
    }

    Object.entries(result).map(([key, value]) => {
      form.setValue(key, value);
    });
  }, [watch]);

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {!fields || fields.length === 0 ? (
        <div className="flex flex-col h-full w-full grow items-center justify-center text-muted-foreground dark:text-background">
          <ShoppingBag className="w-20 h-20" />
        </div>
      ) : (
        <ScrollArea className="flex-1 -mx-4 px-4">
          <Accordion type="single" collapsible className="h-full divide-y">
            {fields.map(
              (
                {
                  id,
                  imageSrc,
                  quantity,
                  title,
                  beforeDiscount,
                  lineTotal,
                  total,
                  variantTitle,
                }: any,
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
                                className="inline-flex py-0 select-none"
                                variant="secondary"
                              >
                                {variantTitle}
                              </Badge>
                            )}

                            <Badge
                              className="shrink-0 px-0 py-0 min-w-[5rem] ml-auto"
                              variant={
                                quantity < 0 ? "destructive" : "secondary"
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
                              <span className="grow text-center shrink-0 min-w-8 block select-none">
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

                        <div className="flex flex-col justify-between pb-1 h-full font-medium text-right select-none">
                          <div className="line-through text-muted-foreground text-xs">
                            {beforeDiscount !== lineTotal &&
                              Numeral(beforeDiscount).format()}
                          </div>

                          <div className={lineTotal < 0 ? "text-error" : ""}>
                            {Numeral(lineTotal).format()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="[&>div]:pb-0">
                    <div className="py-1.5">
                      <div className="grid grid-cols-2 gap-3 border-t pt-2">
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
                                    onBlur={(e) => {
                                      return handleUpdate(i);
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
                                    onBlur={() => {
                                      return handleUpdate(i);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => handleReturn(i)}
                        >
                          <PackageMinus className="w-4 h-4 mr-2" /> Return
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1 bg-destructive/30"
                          onClick={() => remove(i)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Remove
                        </Button>
                      </div>
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
              <Popover handleUpdate={handleUpdate} />
            </div>
            <div>
              {Numeral(
                form.watch("totalDiscount") > 0
                  ? -Math.abs(form.watch("totalDiscount"))
                  : Math.abs(form.watch("totalDiscount"))
              ).format()}
            </div>
          </div>

          <div className="flex justify-between py-1">
            <div>
              Tax
              <span className="ml-2 text-muted-foreground capitalize">
                ({form.watch("taxType")})
              </span>
              <Popover handleUpdate={handleUpdate} />
            </div>
            <div>{Numeral(form.watch("totalTax")).format()}</div>
          </div>

          <div className="border-b-2 border-dashed my-2 " />

          <div className="flex items-center py-1 text-lg font-medium">
            <div>Total</div>
            <div
              className={`ml-auto ${
                form.watch("total") < 0 ? "text-error" : ""
              }`}
            >
              {Numeral(form.watch("total")).format()}
            </div>
          </div>
        </div>

        <div className="mt-2">
          <Button
            className="w-full"
            disabled={fields.length <= 0}
            onClick={toggle}
          >
            Checkout
          </Button>
        </div>
        <CartActions />
      </div>

      {open && <ProceedDialog />}
    </div>
  );
};

export default Cart;
