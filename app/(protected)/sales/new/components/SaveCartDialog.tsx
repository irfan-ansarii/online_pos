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
  DialogFooter,
  DialogCancel,
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

  const values = watch();
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
      title: "Cart saved successfully!",
    });
    toggle(false);
  };

  React.useEffect(() => {
    if (values.total > 0 || values.lineItems?.length > 0) {
      const json = JSON.parse(savedCarts);

      const ind = json.findIndex((js: any) => js.name === "current");
      if (ind === -1) {
        json.push({
          name: "current",
          cart: values,
          total: values.total,
          createdAt: new Date(),
        });
      } else {
        json[ind] = {
          ...json[ind],
          name: "current",
          cart: values,
          total: values.total,
        };
      }
      saveCart(JSON.stringify(json));
    }
  }, [values]);

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="w-full text-foreground"
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
            <div className="flex justify-end gap-4">
              <DialogCancel className="flex-1 md:flex-none">
                Cancel
              </DialogCancel>
              <Button type="submit" className="flex-1 md:flex-none">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCartDialog;
