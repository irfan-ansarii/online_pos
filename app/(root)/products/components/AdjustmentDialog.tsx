"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { adjustmentValidation } from "@/lib/validations/product";

import { useToggle } from "@uidotdev/usehooks";
import { useCreateAdjustment } from "@/hooks/useProduct";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

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

function AdjustmentDialog({
  children,
  data,
}: {
  children: React.ReactNode;
  data: any;
}) {
  const [open, toggle] = useToggle(false);
  const { mutate, isLoading } = useCreateAdjustment();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof adjustmentValidation>>({
    resolver: zodResolver(adjustmentValidation),
    defaultValues: {
      locationId: data.locationId,
      lineItems: [{ ...data }],
      reason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof adjustmentValidation>) => {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "Stock adjusted successfully.",
        });
        form.reset();
        toggle();
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: error.response.data.message || "Something went wrong",
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjustment</DialogTitle>
          <DialogDescription>
            Make changes stock. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {isLoading && (
          <div className="absolute w-full h-full top-0 left-0 z-20"></div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <FormField
              control={form.control}
              name="lineItems.0.quantity"
              render={({ field }) => (
                <FormItem className="mb-6">
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
                      <SelectItem value="Internal transfer">
                        Internal transfer
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

            <DialogFooter>
              <Button type="submit" className="w-full">
                {isLoading ? (
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
