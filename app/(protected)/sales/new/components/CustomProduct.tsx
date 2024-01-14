import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { customItemValidation } from "@/lib/validations/sale";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogCancel,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";

const CustomProduct = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: (value: any) => void;
}) => {
  const [open, toggle] = useToggle(false);
  const form = useForm<z.infer<typeof customItemValidation>>({
    resolver: zodResolver(customItemValidation),
    defaultValues: {
      title: "",
      price: "",
      taxRate: "",
    },
  });

  const onSubmit = (values: z.infer<typeof customItemValidation>) => {
    const item = {
      product: { productId: null, title: values.title },
      productId: null,
      variantId: generateId(),
      variant: {
        title: null,
        salePrice: Number(values.price),
        purchasePrice: Number(values.price),
        barcode: generateId(),
        sku: null,
        taxRate: Number(values.taxRate),
      },
    };

    if (onSelect) onSelect(item);

    form.reset();
    toggle();
  };

  function generateId(length = 8) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
  }
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-0 mb-2 space-y-0">
          <DialogTitle className="text-lg">Add Custom Item</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="col-span-2 flex mt-2 justify-end">
              <DialogCancel className="flex-1 md:flex-none">
                Cancel
              </DialogCancel>
              <Button
                className="flex-1 md:flex-none min-w-[6rem]"
                type="submit"
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomProduct;
