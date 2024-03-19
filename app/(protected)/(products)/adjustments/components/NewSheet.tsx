"use client";
import React from "react";
import * as z from "zod";

import { createAdjustment } from "@/actions/adjustment-actions";
import { Loader2, X, Minus, Plus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { adjustmentValidation } from "@/lib/validations/product";

import { useSheetToggle } from "@/hooks/useSheet";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import AutoComplete from "@/components/shared/search-product";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarItem } from "@/components/shared/avatar";
import { Textarea } from "@/components/ui/textarea";

type Option = Record<string, any>;

const NewSheet = () => {
  const [loading, setLoading] = React.useState(false);
  const [open, toggle] = useSheetToggle("newSheet");
  const router = useRouter();
  const form = useForm<z.infer<typeof adjustmentValidation>>({
    resolver: zodResolver(adjustmentValidation),
    defaultValues: {
      lineItems: [],
      reason: "Correction",
      notes: "",
    },
  });

  const lineItems = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const onSelect = (value: Option) => {
    const items = form.getValues("lineItems");
    console.log(value);
    const index = items.findIndex((item) => item.itemId === value.variantId);

    if (index !== -1) {
      lineItems.update(index, {
        ...items[index],
        quantity: Number(items[index].quantity) + 1,
      });
      return;
    }

    lineItems.append({
      itemId: value.variantId,
      productId: value.product.id,
      variantId: value.variantId,
      title: value.product.title,
      variantTitle: value.variant.title,
      barcode: value.variant.barcode,
      quantity: 1,
      imageSrc: value?.product?.image?.src,
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
    lineItems.update(index, {
      ...lineItems.fields[index],
      quantity: Number(lineItems.fields[index].quantity) - 1,
    });
  };

  const onSubmit = async (values: z.infer<typeof adjustmentValidation>) => {
    const { reason, notes } = values;
    const formValues = values.lineItems.map((item) => ({
      locationId: undefined,
      productId: Number(item.productId),
      variantId: Number(item.variantId),
      quantity: Number(item.quantity),
      reason: reason,
      notes: notes,
    }));

    try {
      setLoading(true);
      await createAdjustment(formValues);
      toast({
        variant: "success",
        title: "Stock adjusted successfully.",
      });
      toggle();
      form.reset();
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full gap-4 relative"
          >
            {loading && (
              <div className="absolute w-full h-full top-0 left-0 z-20"></div>
            )}

            <SheetHeader className="mb-0">
              <SheetTitle>New Adjustment</SheetTitle>
            </SheetHeader>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Correction">Correction</SelectItem>
                      <SelectItem value="Damaged">Damaged</SelectItem>
                      <SelectItem value="Received">Received</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="Theft or loss">
                        Theft or loss
                      </SelectItem>
                      <SelectItem value="Promotion or gift">
                        Promotion or gift
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>

                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-1">
              <AutoComplete onSelect={onSelect} />
              {form.formState.errors.lineItems ? (
                <p className="text-error">Required</p>
              ) : null}
            </div>
            <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
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
