"use client";
import React from "react";
import { BookmarkPlus } from "lucide-react";
import { useForm, useFormContext } from "react-hook-form";
import { useToggle, useLocalStorage } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SaveCartDialog = () => {
  const { toast } = useToast();
  const [open, toggle] = useToggle(false);

  const [savedCarts, saveCart] = useLocalStorage("carts", JSON.stringify([]));

  const { watch, reset } = useFormContext();

  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = ({ name }: { name: string }) => {
    const json = JSON.parse(savedCarts);
    const cart = watch();
    json.push({
      name: name,
      cart: cart,
      total: cart.total,
      createdAt: new Date(),
    });

    saveCart(JSON.stringify(json));
    reset();
    toast({
      variant: "success",
      description: "Cart saved successfully!",
    });
    toggle(false);
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full"
              disabled={!watch("lineItems") || watch("lineItems").length < 1}
            >
              <BookmarkPlus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader className="p-0 mb-6 space-y-0">
          <DialogTitle className="text-lg">Save Cart</DialogTitle>
          <DialogDescription>
            Click on the button bellow to select.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required." }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
      </DialogContent>
    </Dialog>
  );
};

export default SaveCartDialog;
