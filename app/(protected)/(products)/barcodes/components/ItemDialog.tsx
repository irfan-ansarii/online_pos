"use client";
import React from "react";
import * as z from "zod";
import { updateBarcode } from "@/actions/barcode-actions";
import { editBarcodeValidation } from "@/lib/validations/product";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useToggle } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";

import {
  DialogContent,
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";

const ItemDialog = ({
  item,
  children,
}: {
  item: any;
  children: React.ReactNode;
}) => {
  const [open, toggle] = useToggle();
  const [loading, toggleLoading] = useToggle();

  const router = useRouter();
  const form = useForm<z.infer<typeof editBarcodeValidation>>({
    resolver: zodResolver(editBarcodeValidation),
    defaultValues: {
      id: item.id,
      quantity: item.quantity,
      status: item.status,
    },
  });

  const handlePlus = () => {
    const value = form.getValues("quantity");
    const updatedValue = Number(value) + 1 || 1;
    form.setValue("quantity", updatedValue);
  };
  const handleMinus = () => {
    const value = form.getValues("quantity");
    const updatedValue = Number(value) > 1 ? Number(value) - 1 : 1;
    form.setValue("quantity", updatedValue);
  };

  const onSubmit = async (values: z.infer<typeof editBarcodeValidation>) => {
    try {
      toggleLoading();
      await updateBarcode(values);
      toast({
        variant: "success",
        title: "Updated successfully.",
      });

      router.refresh();
      toggle();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      toggleLoading();
    }
  };
  // React.useEffect(() => {
  //   form.reset();
  // }, [open]);
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {loading && (
          <div className="absolute w-full h-full top-0 left-0 z-20"></div>
        )}
        <DialogHeader>
          <DialogTitle>Edit barcode</DialogTitle>
          <DialogDescription>
            Make changes to item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full gap-6"
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <div className="relative rounded-md overflow-hidden">
                      <Input placeholder="0" {...field} />
                      <div className="absolute right-0 inset-y-0 flex flex-col">
                        <span
                          onClick={handlePlus}
                          className="flex-1 hover:bg-muted bg-muted/50 px-1 inline-flex items-center justify-center cursor-pointer"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </span>
                        <span
                          onClick={handleMinus}
                          className="flex-1 hover:bg-muted bg-muted/50 px-1 inline-flex items-center justify-center cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="printed">Printed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDialog;
