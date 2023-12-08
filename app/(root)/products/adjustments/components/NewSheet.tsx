"use client";
import React from "react";
import * as z from "zod";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { productValidation } from "@/lib/validations/product";
import { useForm } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useCreateProduct } from "@/hooks/useProduct";

import { Loader2, X, Image as ImageIcon } from "lucide-react";

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

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AutoComplete from "@/components/shared/product-autocomplete";
import { Badge } from "@/components/ui/badge";

const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const [preview, setPreview] = React.useState("");
  const { mutate, isLoading } = useCreateProduct();
  const { toast } = useToast();
  const [open, toggle] = useToggle();

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      status: "active",
      title: "",
      description: "",
      type: "simple",
      purchasePrice: 0,
      salePrice: 0,
      sku: "",
      taxRate: 0,
      options: [{ name: "", values: [], value: "" }],
      variants: [],
    },
  });

  const onSubmit = (values: z.infer<typeof productValidation>) => {
    if (values.type === "simple") {
      values.variants = [
        {
          option: null,
          title: "Default",
          purchasePrice: Number(values.purchasePrice),
          salePrice: Number(values.purchasePrice),
          sku: values.sku,
          taxRate: Number(values.taxRate),
        },
      ];
    }

    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "Product created successfully!",
        });
        form.reset();
        setPreview("");
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

  const onSelect = (file: any) => {
    setPreview(file.src);
    form.setValue("imageId", file.id);
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
              <SheetTitle>New Adjustment</SheetTitle>
            </SheetHeader>

            <FormField
              control={form.control}
              name="reason"
              rules={{ required: "Required" }}
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Input placeholder="Reason..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2 mb-2">
              <FormLabel>Products</FormLabel>
              <AutoComplete onSelect={onSelect} error={""} />
            </div>
            <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
              {[...Array(0)].map((field, i) => (
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
                        <Badge className="py-.5" variant="secondary">
                          {field.variantTitle}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="ml-auto flex items-center gap-6">
                    <div>{field.quantity}</div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="opacity-50 hover:opacity-100 hover:bg-background transition"
                      // onClick={() => lineItems.remove(i)}
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
