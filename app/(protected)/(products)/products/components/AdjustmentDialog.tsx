"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustmentValidation } from "@/lib/validations/product";
import { createAdjustment } from "@/actions/adjustment-actions";

import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Textarea } from "@/components/ui/textarea";

function AdjustmentDialog({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  const [open, toggle] = useToggle();
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof adjustmentValidation>>({
    resolver: zodResolver(adjustmentValidation),
    defaultValues: {
      lineItems: [{ ...data, itemId: data.productId }],
      reason: "Correction",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof adjustmentValidation>) => {
    const { reason, notes } = values;

    const formValues = values.lineItems.map((item) => ({
      ...item,
      reason: reason,
      notes: notes,
    }));

    try {
      setLoading(true);
      await createAdjustment(formValues);
      toast({
        variant: "success",
        title: "Stock updated",
      });
      form.reset();
      toggle();
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjustment</DialogTitle>
          <DialogDescription>
            Maanage inventory . Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="absolute w-full h-full top-0 left-0 z-20"></div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full gap-6"
          >
            <FormField
              control={form.control}
              name="lineItems.0.quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Correction">Correction</SelectItem>
                      <SelectItem value="Damaged">Damaged</SelectItem>
                      <SelectItem value="Received">Received</SelectItem>
                      <SelectItem value="Return restock">
                        Return restock
                      </SelectItem>
                      <SelectItem value="Theft or loss">
                        Theft or loss
                      </SelectItem>
                      <SelectItem value="Promotion or gift">
                        Promotion or gift
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                className="flex-1 md:flex-none"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggle();
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 md:flex-none min-w-[6rem]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdjustmentDialog;
