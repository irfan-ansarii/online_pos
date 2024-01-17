"use client";
import React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPurchaseValidation } from "@/lib/validations/purchase";

import { useForm, useFieldArray } from "react-hook-form";

import { ShoppingBag } from "lucide-react";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

import Inventory from "../../../sales/new/components/Inventory";
import Cart from "./Cart";

const CartForm = ({ initialValues }: { initialValues: any }) => {
  const form = useForm<z.infer<typeof editPurchaseValidation>>({
    resolver: zodResolver(editPurchaseValidation),
    mode: "onChange",
    defaultValues: initialValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const onLineItemClick = (selected: any) => {
    const { product, variant, variantId } = selected;

    const index = fields.findIndex((item) => item.barcode == variant.barcode);

    if (index >= 0) {
      const { quantity = 0 } = fields[index];

      form.setValue(`lineItems.${index}.quantity`, Number(quantity) + 1);

      handleUpdate(index);

      return;
    }
    append({
      itemId: null,
      kind: "purchase",
      productId: product.id,
      variantId: variantId,
      title: product.title,
      variantTitle: variant.title,
      sku: variant.sku,
      barcode: variant.barcode,
      imageSrc: product?.image?.src,
      price: variant.salePrice,
      taxRate: variant.taxRate,
      originalQuantity: null,
      originalKind: null,
      quantity: 1,
      totalDiscount: 0,
    });
    handleUpdate(fields.length);
  };

  /**
   * Calculate line items total
   * This function gets triggered on
   * price, quantity and discount change
   *
   * @param name @string
   * @param index  @number
   */
  const handleUpdate = (index: number) => {
    const lineItem = form.getValues(`lineItems.${index}`);
    const taxType = form.getValues("taxType");
    const saleType = form.getValues("purchaseType");

    const { price = 0, quantity = 0, totalDiscount = 0, taxRate } = lineItem;

    const beforeDiscount = parseFloat(price) * parseFloat(quantity);
    const lineTotal = beforeDiscount - totalDiscount * quantity;

    const includedTax = lineTotal - lineTotal / (1 + taxRate / 100);
    const excludedTax = lineTotal * (taxRate / 100);

    const taxableValue =
      taxType === "included" ? lineTotal - includedTax : lineTotal;

    const totalTax = taxType === "included" ? includedTax : excludedTax;

    const total = taxableValue + totalTax;

    let taxLines = [
      { title: "CGST", amount: totalTax / 2 },
      { title: "SGST", amount: totalTax / 2 },
    ];

    if (saleType === "inter_state") {
      taxLines = [{ title: "IGST", amount: totalTax }];
    }

    const updatedLineItem = {
      ...lineItem,
      beforeDiscount,
      lineTotal,
      taxableValue,
      totalTax: totalTax,
      taxLines,
      total: total,
    };

    update(index, updatedLineItem);
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 2xl:col-span-8 bg-background">
          <Inventory onSelect={onLineItemClick} />
        </div>

        {/* render on desktop */}
        <div className="hidden lg:block -mr-4 p-4 lg:col-span-6 xl:col-span-5 2xl:col-span-4 sticky bg-accent h-screen top-0 bottom-0 z-50">
          <Cart fields={fields} remove={remove} handleUpdate={handleUpdate} />
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative">
            <Button
              size="icon"
              className="rounded-full fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
            >
              <ShoppingBag className="w-5 h-5" />

              <Badge
                variant="secondary"
                className="absolute -top-2 py-0 px-2 -right-2"
              >
                {fields.length}
              </Badge>
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="h-[90%] p-4">
          <Cart fields={fields} remove={remove} handleUpdate={handleUpdate} />
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default CartForm;
