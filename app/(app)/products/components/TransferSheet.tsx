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
const TransferSheet = ({ children }: { children: React.ReactNode }) => {
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
              <SheetTitle>Transfer</SheetTitle>
            </SheetHeader>
            <ScrollArea className="grow -mx-6">
              {[...Array(10)].map(() => (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="px-6 mb-6">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Example" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
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

export default TransferSheet;
