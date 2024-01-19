"use client";
import React from "react";
import * as z from "zod";
import { Product, File, Variant } from "@prisma/client";
import { editProductValidation } from "@/lib/validations/product";
import { Check, ImagePlus, PenSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import MediaLibrary from "@/components/media-library/media-library";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Options from "./Options";
import Variants from "./Variants";

interface EditProductProps extends Product {
  image: File;
  variants: Variant[];
}

const EditSheet = ({ product }: { product: EditProductProps }) => {
  const [open, toggle] = useToggle();
  const form = useForm<z.infer<typeof editProductValidation>>({
    defaultValues: {
      id: product.id,
      title: product.title,
      description: product.description,
      imageId: product.imageId || undefined,
      imageSrc: product.image?.src,
      type: product.type,
      status: product.status,
      options: product.options,
      variants: product.variants.map((v) => ({
        itemId: v.id,
        title: v.title,
        option: v.option,
        purchasePrice: v.purchasePrice,
        salePrice: v.salePrice,
        sku: v.sku,
        hsn: v.hsn,
        taxRate: v.taxRate,
      })),
      purchasePrice: product.variants[0].purchasePrice,
      salePrice: product.variants[0].salePrice,
      sku: product.variants[0].sku,
      hsn: product.variants[0].hsn,
      taxRate: product.variants[0].taxRate,
    },
  });

  const onSubmit = (values: z.infer<typeof editProductValidation>) => {
    console.log(values);
  };

  const onSelect = (selected: any) => {
    console.log("selected", selected);
  };
  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="">
          <PenSquare className="w-4 h-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log(errors)
            )}
            className="flex flex-col h-full"
          >
            <SheetHeader>
              <SheetTitle>Edit Product</SheetTitle>
            </SheetHeader>

            <div className="relative max-h-full overflow-y-auto scrollbox -mx-6 px-6">
              <div className="flex flex-col gap-6 grow pb-2 md:pb-4">
                <MediaLibrary
                  onSelect={onSelect}
                  selected={form.getValues("imageId")}
                >
                  <div>
                    <div
                      className={`relative rounded-md bg-accent h-24 flex items-center justify-center text-muted-foreground border ${
                        form?.formState?.errors?.imageId
                          ? "border-destructive"
                          : ""
                      }`}
                    >
                      <Avatar className="w-full h-full">
                        <AvatarImage
                          className="w-full h-full object-contain"
                          src={form.getValues("imageSrc")}
                        ></AvatarImage>
                        <AvatarFallback className="bg-transparent">
                          <ImagePlus className="w-10 h-10" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {form.formState.errors?.imageId?.message && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        Image is required
                      </p>
                    )}
                  </div>
                </MediaLibrary>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Type here..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="simple"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent  peer-data-[state=checked]:border-primary ">
                              Simple
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="variable"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent  peer-data-[state=checked]:border-primary">
                              Variable
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("type") === "variable" ? (
                  <>
                    <ul className="flex flex-col gap-4">
                      <Options />
                    </ul>
                    <Variants />
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price</FormLabel>
                          <FormControl>
                            <Input placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hsn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HSN Code</FormLabel>
                          <FormControl>
                            <Input placeholder="6104" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate</FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="flex shrink-0">
              Update
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditSheet;
