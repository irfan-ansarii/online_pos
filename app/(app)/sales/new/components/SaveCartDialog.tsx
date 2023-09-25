import React from "react";

import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const SaveCartDialog = ({
  onOpenChange,
}: {
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (v: any) => {
    console.log(v);
  };

  return (
    <div className="relative">
      <CardHeader className="p-0 mb-6 space-y-0">
        <CardTitle className="text-lg">Save Cart</CardTitle>
        <CardDescription>Click on the button bellow to select.</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Example" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SaveCartDialog;
