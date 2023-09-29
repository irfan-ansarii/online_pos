"use client";
import React from "react";
import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
import { ImagePlus, Trash2, PlusCircle, Image } from "lucide-react";
import VariantValues from "./VariantValues";

const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const form = useForm({
    defaultValues: {
      image: "",
      title: "",
      description: "",
      type: "simple",
      sale_price: "",
      purchase_price: "",
      sku: "",
      reorder: "",
      variants: [{ name: "", values: [] }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const type = useWatch({
    name: "type",
    control: form.control,
    defaultValue: "simple",
  });

  const onSubmit = (v: any) => {
    console.log(v);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader>
              <SheetTitle>New product</SheetTitle>
            </SheetHeader>

            <ScrollArea className="grow -mx-6">
              <div className="px-6 flex flex-col gap-6 pb-6">
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
                    <div className="text-muted-foreground font-semibold uppercase border-b-2 pb-2">
                      Options
                    </div>
                    <ul className="flex flex-col gap-6">
                      {fields.map((item, index) => (
                        <li key={item.id} className="flex flex-col gap-4">
                          <div className="flex gap-2">
                            <div className="grow">
                              <FormField
                                control={form.control}
                                name={`variants.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        placeholder="Variant name"
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

                          <VariantValues control={form.control} index={index} />
                        </li>
                      ))}

                      <li>
                        <Button
                          className="border-dashed w-full"
                          variant="outline"
                          onClick={() => {
                            append({ name: "", values: [] });
                          }}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          Add Variant
                        </Button>
                      </li>
                    </ul>

                    <ul className="flex flex-col gap-6">
                      <div className="text-muted-foreground  col-span-2 font-semibold uppercase border-b-2 pb-2 flex justify-between">
                        Variants
                      </div>
                      {fields.map((item, index) => (
                        <li key={item.id} className="grid grid-cols-2 gap-4">
                          <div className="text-muted-foreground items-center col-span-2 font-semibold uppercase border-b-2 pb-2 flex justify-between">
                            <div className="flex gap-2 items-center">
                              <Avatar>
                                <AvatarImage> </AvatarImage>
                                <AvatarFallback>
                                  <Image className="w-5 h-5" />
                                </AvatarFallback>
                              </Avatar>
                              <span>variant</span>
                            </div>
                            <span>1290.00</span>
                          </div>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Purchase Price</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Variant name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sale Price</FormLabel>
                                <FormControl>
                                  <Input placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                  <Input placeholder="GN12345" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Barcode</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="0"
                                    {...field}
                                    defaultValue={5}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`purchase_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Price</FormLabel>
                          <FormControl>
                            <Input placeholder="Variant name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sale_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sale Price</FormLabel>
                          <FormControl>
                            <Input placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`sku`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="GN12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`reorder`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Threshold</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0"
                              {...field}
                              defaultValue={5}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </ScrollArea>
            <SheetFooter className="md:justify-between">
              <Button className="w-full" type="submit">
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewSheet;
