"use client";
import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { ImagePlus, Trash2, PlusCircle, Loader2 } from "lucide-react";

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

import PerfectScrollbar from "react-perfect-scrollbar";

import OptionValues from "./OptionValues";
import Variants from "./Variants";

import { useToggle } from "@uidotdev/usehooks";

import { useToast } from "@/components/ui/use-toast";
import { useCreateProduct } from "@/hooks/useProduct";
const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const { mutate, isLoading } = useCreateProduct();
  const { toast } = useToast();
  const [open, toggle] = useToggle();
  const form = useForm({
    defaultValues: {
      image: "",
      title: "",
      description: "",
      purchasePrice: "",
      salePrice: "",
      sku: "",
      type: "simple",
      options: [{ name: "", values: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const type = useWatch({
    name: "type",
    control: form.control,
    defaultValue: "simple",
  });

  const onSubmit = (values: any) => {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "User been invited successfully!",
        });
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader className="md:pb-2">
              <SheetTitle>New product</SheetTitle>
            </SheetHeader>

            <PerfectScrollbar className="-mx-6 px-6 relative">
              {isLoading && (
                <div className="absolute w-full h-full top-0 left-0 z-20"></div>
              )}
              <div className="flex flex-col gap-6 grow">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative rounded-md bg-muted/40">
                        <span className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                          <ImagePlus className="w-10 h-10" />
                        </span>
                        <FormControl>
                          <Input
                            type="file"
                            {...field}
                            className="h-24 file:hidden opacity-0"
                          />
                        </FormControl>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Example" {...field} />
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

                {type === "variable" ? (
                  <>
                    <ul className="flex flex-col gap-4">
                      {fields.map((item, index) => (
                        <li key={item.id} className="flex flex-col gap-4">
                          <div className="flex gap-2">
                            <div className="grow">
                              <FormField
                                control={form.control}
                                name={`options.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Option name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <OptionValues control={form.control} index={index} />
                        </li>
                      ))}

                      <li>
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={() => {
                            append({ name: "", values: [] });
                          }}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add Variant
                        </Button>
                      </li>
                    </ul>
                    <Variants form={form} />
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
                  </div>
                )}
              </div>
            </PerfectScrollbar>

            <SheetFooter className="md:justify-between pt-4 md:pt-6">
              <Button className="w-full" type="submit">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
