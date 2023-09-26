"use client";
import React from "react";
import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetContent,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
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
import { ImagePlus, Trash2 } from "lucide-react";

const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (v: any) => {
    console.log(v);
  };
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader>
              <SheetTitle>New product</SheetTitle>
            </SheetHeader>
            <ScrollArea className="grow -mx-6 mt-2 mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="px-6 mb-6">
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
                name="name"
                render={({ field }) => (
                  <FormItem className="px-6 mb-6">
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
                name="name"
                render={({ field }) => (
                  <FormItem className="px-6 mb-6">
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
                name="product_type"
                render={({ field }) => (
                  <FormItem className="px-6 space-y-0 mb-6">
                    <FormLabel>Type</FormLabel>
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

              {/* <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-6 mb-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Price</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder Threshold</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
              <div className="px-6 space-y-6">
                <div className="flex gap-4">
                  <div className="space-y-6 grow">
                    <Input />
                    <Input />
                  </div>

                  <Button
                    size="icon"
                    className="shrink-0"
                    variant="destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </ScrollArea>
            <SheetFooter className="md:justify-between">
              <Button className="w-full" type="submit">
                Create
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewSheet;
