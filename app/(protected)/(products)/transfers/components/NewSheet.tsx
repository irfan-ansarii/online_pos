"use client";
import React from "react";

import * as z from "zod";
import Numeral from "numeral";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { transferValidation } from "@/lib/validations/product";

import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useSheetToggle } from "@/hooks/useSheet";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import AutoComplete from "@/components/shared/search-product";

import { Badge } from "@/components/ui/badge";
import { AvatarItem } from "@/components/shared/avatar";
import { createTransfer } from "@/actions/transfer-actions";
import { useLocations } from "@/hooks/useLocations";

type Option = Record<string, any>;
interface ClickProps {
  e: React.MouseEvent<HTMLElement>;
  index: number;
}
const NewSheet = ({ session }: any) => {
  const router = useRouter();
  const { locations } = useLocations();
  const [loading, setLoading] = React.useState(false);
  const [open, toggle] = useSheetToggle("newSheet");

  const form = useForm<z.infer<typeof transferValidation>>({
    resolver: zodResolver(transferValidation),
    defaultValues: {
      toId: undefined,
      lineItems: [],
      totalItems: undefined,
      totalAmount: undefined,
      status: "completed",
    },
  });

  const lineItems = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const onSelect = (value: Option) => {
    const items = form.getValues("lineItems");

    const index = items.findIndex((item) => item.itemId === value.variantId);

    if (index !== -1) {
      lineItems.update(index, {
        ...items[index],
        quantity: items[index].quantity + 1,
        total: items[index].price * items[index].quantity,
      });

      return;
    }

    lineItems.append({
      itemId: value.variantId,
      productId: value.product.id,
      variantId: value.variantId,
      title: value.product.title,
      variantTitle: value.variant.title,
      sku: value.variant.sku,
      barcode: value.variant.barcode,
      price: value.variant.salePrice,
      quantity: 1,
      total: value.variant.salePrice,
      imageSrc: value?.product?.image?.src,
    });
  };

  const handlePlus = ({ e, index }: ClickProps) => {
    e.preventDefault();

    lineItems.update(index, {
      ...lineItems.fields[index],
      quantity: Number(lineItems.fields[index].quantity) + 1,
    });
  };

  const handleMinus = ({ e, index }: ClickProps) => {
    e.preventDefault();

    lineItems.update(index, {
      ...lineItems.fields[index],
      quantity: Number(lineItems.fields[index].quantity) - 1,
    });
  };

  React.useEffect(() => {
    const items = form.getValues("lineItems");
    const total = items.reduce(
      (acc, curr) => {
        acc.count += curr.quantity;
        acc.total += Number(curr.price) * Number(curr.quantity);

        return acc;
      },
      {
        count: 0,
        total: 0,
      }
    );
    form.setValue("totalItems", total.count);
    form.setValue("totalAmount", total.total);
  }, [form.watch("lineItems")]);

  const onSubmit = async (values: z.infer<typeof transferValidation>) => {
    try {
      setLoading(true);

      await createTransfer(values);

      toast({
        variant: "success",
        title: "Transfered successfully",
      });

      toggle();
      form.reset();
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
    <Sheet open={open} onOpenChange={toggle}>
      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col gap-4 h-full relative"
          >
            <SheetHeader className="mb-0">
              <SheetTitle>New Transfer</SheetTitle>
            </SheetHeader>

            {loading && (
              <div className="absolute w-full h-full top-0 left-0 z-20"></div>
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="toId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Destination</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Destination" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {locations?.data.map((location: Option) => {
                          if (session.locationId !== location.id)
                            return (
                              <SelectItem
                                value={`${location.id}`}
                                key={location.id}
                              >
                                {location.name}
                              </SelectItem>
                            );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-1">
              <AutoComplete onSelect={onSelect} />
              {form.formState.errors.lineItems ? (
                <p className="text-error">Required</p>
              ) : null}
            </div>

            <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox">
              {lineItems.fields.map(
                ({ itemId, title, variantTitle, imageSrc, quantity }, i) => (
                  <div
                    className="flex rounded-md border p-2 pr-0 items-center snap-start"
                    key={itemId}
                  >
                    <div className="flex gap-3 items-center col-span-2">
                      <AvatarItem src={imageSrc} />
                      <div className="space-y-0.5 truncate">
                        <div className="font-semibold truncate">{title}</div>
                        {variantTitle && (
                          <Badge className="py-.5" variant="secondary">
                            {variantTitle}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="ml-auto flex items-center gap-6">
                      <div className="flex items-center w-20 justify-between">
                        <Button
                          onClick={(e) => handleMinus({ e, index: i })}
                          size="icon"
                          variant="secondary"
                          className="rounded-full w-6 h-6"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="flex-1 truncate text-center block">
                          {quantity}
                        </span>
                        <Button
                          size="icon"
                          onClick={(e) => handlePlus({ e, index: i })}
                          variant="secondary"
                          className="rounded-full w-6 h-6"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-50 hover:opacity-100 hover:bg-background transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          lineItems.remove(i);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>
            <Separator className="h-0.5" />
            <SheetFooter className="pt-2 flex-col">
              <div className="flex">
                <div>Items</div>
                <div className="ml-auto">{form.watch("totalItems")}</div>
              </div>
              <div className="flex">
                <div>Amount</div>
                <div className="ml-auto">
                  {Numeral(form.watch("totalAmount")).format()}
                </div>
              </div>

              <Button className="w-full" type="submit">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewSheet;
