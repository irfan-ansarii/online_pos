"use client";
import React from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { productValidation } from "@/lib/validations/product";
import { useForm } from "react-hook-form";

import { store } from "@/lib/utils";
import { useAtom } from "jotai";
import { toast } from "@/components/ui/use-toast";

import { ImagePlus, Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Options from "./Options";
import Variants from "./Variants";
import MediaLibrary from "@/components/media-library/media-library";

import { postData } from "@/lib/actions";

const NewSheet = () => {
  const [state, setState] = useAtom(store);
  const router = useRouter();
  const [preview, setPreview] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
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

    try {
      setLoading(true);
      await postData({
        endpoint: "/products",
        data: values,
      });
      toast({
        variant: "success",
        title: "Product created successfully!",
      });
      form.reset();
      setState({ ...state, open: false });
      setPreview("");
      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (file: any) => {
    setPreview(file.src);
    form.setValue("imageId", file.id);
  };

  return (
    <Sheet
      open={state.open}
      onOpenChange={() => setState({ ...state, open: false })}
    >
      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full relative"
          >
            {loading && (
              <div className="absolute w-full h-full top-0 left-0 z-20"></div>
            )}
            <SheetHeader className="md:pb-2">
              <SheetTitle>New product</SheetTitle>
            </SheetHeader>

            <div className="relative  max-h-full overflow-y-auto scrollbox -mx-6 px-6">
              <div className="flex flex-col gap-6 grow pb-2 md:pb-4">
                <MediaLibrary
                  onSelect={onSelect}
                  selected={form.getValues("imageId")}
                >
                  <div>
                    <div
                      className={`relative rounded-md bg-accent h-24 flex items-center justify-center text-muted-foreground border ${
                        form.formState.errors.imageId
                          ? "border-destructive"
                          : ""
                      }`}
                    >
                      <Avatar className="w-full h-full">
                        <AvatarImage
                          className="w-full h-full object-contain"
                          src={preview}
                        ></AvatarImage>
                        <AvatarFallback className="bg-transparent">
                          <ImagePlus className="w-10 h-10" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {form.formState.errors.imageId?.message && (
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
                            <FormLabel className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
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
                            <FormLabel className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
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

            <SheetFooter className="pt-2">
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
