"use client";
import React from "react";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { barcodeValidation } from "@/lib/validations/product";

import { useFieldArray, useForm } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useCreateBarcode } from "@/hooks/useProduct";

import { Image as ImageIcon, Loader2, Plus, X, Minus } from "lucide-react";

import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import { Form, FormLabel } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import AutoComplete from "@/components/shared/search-product";

type Option = Record<string, string>;

const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const { mutate, isLoading } = useCreateBarcode();
  const { toast } = useToast();
  const [open, toggle] = useToggle();

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

  const onSubmit = (values: z.infer<typeof barcodeValidation>) => {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "Added to list successfully.",
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
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full"
          >
            <SheetHeader>
              <SheetTitle>Add to print list</SheetTitle>
            </SheetHeader>
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
