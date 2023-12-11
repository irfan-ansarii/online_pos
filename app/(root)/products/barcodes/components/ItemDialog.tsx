"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { DialogContent, Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const ItemDialog = ({
  item,
  children,
}: {
  item: any;
  children: React.ReactNode;
}) => {
  const form = useForm();
  const onSubmit = () => {
    console.log("submit");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <div className="absolute w-full h-full top-0 left-0 z-20"></div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full"
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Reason..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Reason..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
