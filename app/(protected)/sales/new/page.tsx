"use client";
import React from "react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saleValidation } from "@/lib/validations/sale";

import { ShoppingBag } from "lucide-react";

import { useForm, useFieldArray, useWatch } from "react-hook-form";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import InventoryProducts from "@/components/shared/inventory-products";
import Cart from "./components/Cart";

const Page = () => {
  const form = useForm<z.infer<typeof saleValidation>>({
    resolver: zodResolver(saleValidation),
    mode: "onChange",
    defaultValues: {
      lineItems: [],
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
      transactions: [
        {
          name: "cash",
          label: "Cash",
          amount: 0,
        },
        {
          name: "card",
          label: "Credit/Debit Card",
          amount: 0,
        },
        {
          name: "upi",
          label: "UPI",
          amount: 0,
        },
        {
          name: "paytm",
          label: "Paytm Wallet",
          amount: 0,
        },
      ],
    },
    shouldUnregister: false,
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const updatedLineItems = useWatch({
    control: form.control,
    name: "lineItems",
  });

  const onLineItemClick = (selected) => {
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
        price: variant.salePrice,
        taxRate: variant.taxRate,
        imageSrc: product.image.src,
        totalDiscount: 0,
        quantity: 1,
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
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <Form {...form}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 2xl:col-span-8 bg-background">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
                >
                  <ShoppingBag className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="h-[90%] bg-accent p-4">
                <Cart fields={fields} remove={remove} update={update} />
              </DialogContent>
            </Dialog>

            <InventoryProducts onSelect={onLineItemClick} />
          </div>

          {/* render on desktop */}
          <div className="hidden lg:block -mr-4 p-4 lg:col-span-6 xl:col-span-5 2xl:col-span-4 sticky bg-accent h-screen top-0 bottom-0 z-50">
            <Cart fields={fields} remove={remove} update={update} />
          </div>
        </div>
      </Form>
    </main>
  );
};

export default Page;
