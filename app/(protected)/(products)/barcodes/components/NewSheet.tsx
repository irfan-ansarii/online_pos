"use client";
import React from "react";

import { Loader2, Plus, X, Minus } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { barcodeValidation } from "@/lib/validations/product";

import { createBarcode } from "@/actions/barcode-actions";

import { useRouter } from "next/navigation";
import { useSheetToggle } from "@/hooks/useSheet";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

import AutoComplete from "@/components/shared/search-product";

import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import { Form} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvatarItem } from "@/components/shared/avatar";

type Option = Record<string, any>;

const NewSheet = () => {
  const [open, toggle] = useSheetToggle("newSheet");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof barcodeValidation>>({
    resolver: zodResolver(barcodeValidation),
    defaultValues: {
      lineItems: [],
    },
  });

  const lineItems = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const onSelect = (value: Option) => {
    const items = form.getValues("lineItems");
    const index = items.findIndex(
      (item) => item.itemId === Number(value.itemId)
    );

    if (index !== -1) {
      lineItems.update(index, {
        ...items[index],
        quantity: Number(items[index].quantity) + 1,
      });
      return;
    }

    lineItems.append({
      itemId: value.id,
      productId: value.product.id,
      variantId: value.variant.id,
      title: value.product.title,
      variantTitle: value.variant.title,
      barcode: value.variant.barcode,
      quantity: 1,
      imageSrc: value.product.image.src,
    });
  };

  const handlePlus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();

    lineItems.update(index, {
      ...lineItems.fields[index],
      quantity: Number(lineItems.fields[index].quantity) + 1,
    });
  };

  const handleMinus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const count = Number(lineItems.fields[index].quantity);
    if (count === 1) return;
    lineItems.update(index, {
      ...lineItems.fields[index],
      quantity: count - 1,
    });
  };

  const onSubmit = async (values: z.infer<typeof barcodeValidation>) => {
    const { lineItems } = values;

    try {
      setLoading(false);
      await createBarcode(lineItems);
      toast({
        variant: "success",
        title: "Added to list",
      });

      form.reset();
      toggle();
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetContent className="md:max-w-lg">
        {loading && (
          <div className="absolute w-full h-full top-0 left-0 z-20"></div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col gap-4 h-full"
          >
            <SheetHeader className="mb-0">
              <SheetTitle>Add to print list</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1">
            
            <AutoComplete onSelect={onSelect}/>
             {
             form.formState.errors.lineItems ? <p className="text-error">Required</p> : null
           }
          </div>
            <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox">
              {lineItems.fields.map((field, i) => (
                <div
                  className="flex rounded-md border p-2 pr-0 items-center snap-start"
                  key={field.id}
                >
                  <div className="flex gap-3 items-center col-span-2">
                    <AvatarItem src={field.imageSrc} />
                    <div className="space-y-0.5 truncate">
                      <div className="font-semibold truncate">
                        {field.title}
                      </div>
                      {field.variantTitle && (
                        <Badge className="py-0" variant="secondary">
                          {field.variantTitle}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-6">
                    <div className="flex items-center w-20 justify-between">
                      <Button
                        onClick={(e) => handleMinus(e, i)}
                        size="icon"
                        variant="secondary"
                        className="rounded-full w-6 h-6"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="flex-1 truncate text-center block">
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
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-50 hover:opacity-100 hover:bg-background transition"
                      onClick={() => lineItems.remove(i)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter className="pt-2 flex-col">
              <Button className="w-full" type="submit">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewSheet;
