"use client";
import React from "react";
import * as z from "zod";
import Image from "next/image";

import { Loader2, X, Image as ImageIcon, Minus, Plus } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { adjustmentValidation } from "@/lib/validations/product";

import { useFieldArray, useForm } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useCreateAdjustment } from "@/hooks/useProduct";

import {
  Sheet,
  SheetHeader,
  SheetTrigger,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import AutoComplete from "@/components/shared/product-autocomplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = Record<string, string>;

const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const { mutate, isLoading } = useCreateAdjustment();

  const { toast } = useToast();
  const [open, toggle] = useToggle();

  const form = useForm<z.infer<typeof adjustmentValidation>>({
    resolver: zodResolver(adjustmentValidation),
    defaultValues: {
      lineItems: [],
      reason: "Correction",
    },
  });

  const lineItems = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const onSelect = (value: Option) => {
    const items = form.getValues("lineItems");
    const index = items.findIndex(
      (item) => item.variantId === Number(value.variantId)
    );

    if (index !== -1) {
      lineItems.update(index, {
        ...items[index],
        quantity: Number(items[index].quantity) + 1,
      });
      return;
    }

    lineItems.append({
      title: value.title,
      variantTitle: value.variantTitle,
      sku: value.sku,
      quantity: 1,
      variantId: Number(value.variantId),
      imageSrc: value.imageSrc,
      imageId: Number(value.imageId),
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

  const onSubmit = (values: z.infer<typeof adjustmentValidation>) => {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          description: "Stock adjusted successfully.",
        });
        form.reset();
        toggle();
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: error.response.data.message || "Something went wrong",
        });
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        {isLoading && (
          <div className="absolute w-full h-full top-0 left-0 z-20"></div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader>
              <SheetTitle>New Adjustment</SheetTitle>
            </SheetHeader>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="mb-6">
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
                      <SelectItem value="Return restock">
                        Return restock
                      </SelectItem>
                      <SelectItem value="Internal transfer">
                        Internal transfer
                      </SelectItem>
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

            <div className="flex flex-col gap-2 mb-2">
              <FormLabel>Products</FormLabel>
              <AutoComplete
                onSelect={onSelect}
                error={form.formState.errors.lineItems}
              />
            </div>
            <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
              {lineItems.fields.map((field, i) => (
                <div
                  className="flex rounded-md border p-2 pr-0 items-center snap-start"
                  key={field.id}
                >
                  <div className="flex gap-3 items-center col-span-2">
                    <Avatar className="w-10 h-10 border-2">
                      <AvatarImage
                        asChild
                        src={`/${field.imageSrc}`}
                        className="object-cover"
                      >
                        <Image
                          src={`/${field.imageSrc}`}
                          alt={`/${field.imageSrc}`}
                          width={40}
                          height={40}
                        />
                      </AvatarImage>
                      <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
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
                {isLoading ? (
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
