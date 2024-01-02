"use client";
import * as z from "zod";
import React from "react";
import { LineItem, Sale, Transaction } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { saleValidation } from "@/lib/validations/sale";

import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { Form } from "@/components/ui/form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import Inventory from "../../new/components/Inventory";
import Cart from "../../new/components/Cart";

interface Props extends Sale {
  lineItems: LineItem[];
  transactions: Transaction[];
}
const EditForm = ({ initialValue }: { initialValue: Props }) => {
  const {
    createdAt,
    customerId,
    employeeId,
    id,
    lineItems,
    lineItemsTotal,
    locationId,
    roundedOff,
    shippingAddress,
    status,
    subtotal,
    taxLines,
    taxType,
    title,
    total,
    totalDiscount,
    totalDue,
    totalTax,
    transactions,
  } = initialValue;

  const form = useForm<z.infer<typeof saleValidation>>({
    resolver: zodResolver(saleValidation),
    mode: "onChange",
    defaultValues: {
      lineItems: lineItems,
      taxType: "included",
      subtotal: 0,
      totalTax: 0,
      totalDiscount: 0,
      total: 0,
      totalDue: 0,
      taxLines: [],
      discountLine: { type: "percent", value: 0 },
      createdAt: new Date().toISOString(),
      taxAllocations: ["cgst", "sgst"],
      transactions: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const updatedLineItems = useWatch({
    control: form.control,
    name: "lineItems",
  });

  const onLineItemClick = (selected: any) => {
    const { id, product, variant, stock } = selected;

    const index = fields.findIndex((item) => item.itemId === selected.id);

    if (index === -1) {
      append({
        itemId: id,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantTitle: variant.title,
        sku: variant.sku,
        barcode: variant.barcode,
        stock: stock,
        imageSrc: product?.image?.src,
        price: variant.salePrice,
        taxRate: variant.taxRate,
        quantity: 1,
        totalDiscount: 0,
        totalTax: 0,
        total: variant.salePrice,
      });
      return;
    }

    update(index, {
      ...updatedLineItems[index],
      totalDiscount: updatedLineItems[index].totalDiscount || 0,
      quantity: Number(fields[index].quantity) + 1,
    });
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 xl:col-span-7 2xl:col-span-8 bg-background">
          <Inventory onSelect={onLineItemClick} />
        </div>

        {/* render on desktop */}
        <div className="hidden lg:block -mr-4 p-4 lg:col-span-6 xl:col-span-5 2xl:col-span-4 sticky bg-accent h-screen top-0 bottom-0 z-50">
          <Cart fields={fields} remove={remove} update={update} />
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
                {/* {fields.length} */}5
              </Badge>
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="h-[90%] p-4">
          <Cart fields={fields} remove={remove} update={update} />
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default EditForm;
