"use client";
import React from "react";
import Image from "next/image";
import * as z from "zod";
import Numeral from "numeral";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2, Minus, Plus, X } from "lucide-react";
import { transferValidation } from "@/lib/validations/product";
import { useFieldArray, useForm } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useCreateTransfer } from "@/hooks/useProduct";
import { useLocations } from "@/hooks/useUser";

import {
  Sheet,
  SheetHeader,
  SheetTrigger,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AutoComplete from "@/components/shared/search-product";
import { useSession } from "@/hooks/useAuth";

type Option = Record<"value" | "label", string> & Record<string, string>;
const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const { mutate, isLoading } = useCreateTransfer();
  const { data: session } = useSession();
  const { data: locations, isLoading: loading } = useLocations();
  const { toast } = useToast();
  const [open, toggle] = useToggle();

  const form = useForm<z.infer<typeof transferValidation>>({
    resolver: zodResolver(transferValidation),
    defaultValues: {
      toId: undefined,
      lineItems: [],
      totalItems: undefined,
      totalAmount: undefined,
    },
  });
  const locationId = React.useMemo(
    () => session?.data?.data?.locationId,
    [session]
  );

  const lineItems = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const onSelect = (value: Option) => {
    const items = form.getValues("lineItems");
    const index = items.findIndex((item) => item.id === value.id);

    if (index !== -1) {
      lineItems.update(index, {
        ...items[index],
        quantity: items[index].quantity + 1,
      });
      return;
    }

    lineItems.append({
      productId: value.product.id,
      variantId: value.variant.id,
      title: value.product.title,
      variantTitle: value.variant.title,
      sku: value.variant.sku,
      barcode: value.variant.barcode,
      price: value.salePrice,
      quantity: 1,
      total: value.variant.salePrice,
      imageSrc: value.product.image.src,
    });
  };

  const handlePlus = (e: React.MouseEvent, index: number) => {
    e.preventDefault();

    lineItems.update(index, {
      ...lineItems.fields[index],
      quantity: Number(lineItems.fields[index].quantity) + 1,
    });
  };

  const handleMinus = (e: React.MouseEvent, index: number) => {
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

  const onSubmit = (values: z.infer<typeof transferValidation>) => {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "Transfer created successfully!",
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
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full relative"
          >
            <SheetHeader>
              <SheetTitle>New Transfer</SheetTitle>
            </SheetHeader>

            {isLoading && (
              <div className="absolute w-full h-full top-0 left-0 z-20"></div>
            )}

            {loading ? (
              <div className="flex flex-col h-full items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : (
              <>
                <div className="pb-4 space-y-4">
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
                            {locations?.data.data.map((location: Option) =>
                              locationId === location.id ? null : (
                                <SelectItem
                                  value={`${location.id}`}
                                  key={location.id}
                                >
                                  {location.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 mb-1">
                  <FormLabel>Products</FormLabel>
                  <AutoComplete
                    onSelect={onSelect}
                    error={form.formState.errors.lineItems}
                  />
                </div>

                <div className="relative  grow max-h-full overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
                  {lineItems.fields.map((field, i) => (
                    <div
                      className="flex  rounded-md border p-2 pr-0 items-center snap-start"
                      key={field.id}
                    >
                      <div className="flex gap-3 items-center col-span-2">
                        <Avatar className="w-10 h-10 border-2">
                          <AvatarImage
                            asChild
                            src={`/${field.imageSrc}`}
                            className="object-cover"
                          >
                            <Image
                              src={`/${field.imageSrc}`}
                              alt={`/${field.imageSrc}`}
                              width={40}
                              height={40}
                            />
                          </AvatarImage>
                          <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                            <ImageIcon className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5 truncate">
                          <div className="font-semibold truncate">
                            {field.title}
                          </div>
                          {field.variantTitle && (
                            <Badge className="py-.5" variant="secondary">
                              {field.variantTitle}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="ml-auto flex items-center gap-6">
                        <div className="flex items-center w-20 justify-between">
                          <Button
                            onClick={(e) => handleMinus(e, i)}
                            size="icon"
                            variant="secondary"
                            className="rounded-full w-6 h-6"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="flex-1 truncate text-center block">
                            {field.quantity}
                          </span>
                          <Button
                            size="icon"
                            onClick={(e) => handlePlus(e, i)}
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
                          onClick={() => lineItems.remove(i)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </SheetFooter>
              </>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewSheet;
