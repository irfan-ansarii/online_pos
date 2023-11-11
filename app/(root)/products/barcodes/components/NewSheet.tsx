"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productValidation } from "@/lib/validations/product";
import { useForm } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useCreateProduct } from "@/hooks/useProduct";

import { ArrowUpDown, ImagePlus, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full"
          >
            <SheetHeader className="md:pb-2">
              <SheetTitle>New Transfer</SheetTitle>
            </SheetHeader>

            <SimpleBar className="-mx-6 px-6 relative grow max-h-full overflow-y-auto">
              {isLoading && (
                <div className="absolute w-full h-full top-0 left-0 z-20"></div>
              )}

              <div className="flex flex-col gap-6 grow pb-2 md:pb-4">
                <div>
                  <FormField
                    control={form.control}
                    name="fromId"
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-center mt-3">
                    <Button size="icon" variant="secondary" className="mx-auto">
                      <ArrowUpDown className="w-5 h-5" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="toId"
                    rules={{ required: "Required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </SimpleBar>

            <SheetFooter className="pt-2 flex-col">
              <div>
                <div className="flex">
                  <div>Items</div>
                  <div className="ml-auto">4</div>
                </div>
                <div className="flex">
                  <div>Items</div>
                  <div className="ml-auto">4</div>
                </div>
              </div>
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
