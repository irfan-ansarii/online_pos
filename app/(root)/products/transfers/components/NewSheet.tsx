"use client";
import React from "react";
import Image from "next/image";
import * as z from "zod";
import Numeral from "numeral";
import SimpleBar from "simplebar-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { transferValidation } from "@/lib/validations/product";
import { useFieldArray, useForm } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useCreateProduct } from "@/hooks/useProduct";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AutoComplete from "@/components/shared/product-autocomplete";
import { Input } from "@/components/ui/input";

type Option = Record<string, string>;

const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const { mutate, isLoading } = useCreateProduct();
  const { data: locations, isLoading: loading } = useLocations();
  const { toast } = useToast();
  const [open, toggle] = useToggle();

  const form = useForm<z.infer<typeof transferValidation>>({
    resolver: zodResolver(transferValidation),
    defaultValues: {
      fromId: 0,
      toId: 0,
      lineItems: [],
      status: "pending",
      totalItems: 0,
      totalAmount: 0,
    },
  });

  const lineItems = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const onSelect = (value: Option) => {
    const items = form.getValues("lineItems");
    const index = items.findIndex((item) => item.variantId === value.variantId);

    if (index !== -1) {
      lineItems.update(index, {
        ...items[index],
        quantity: items[index].quantity + 1,
      });
      return;
    }

    lineItems.append({
      title: value.title,
      variantTitle: value.variantTitle,
      sku: value.sku,
      price: value.salePrice,
      quantity: 1,
      total: value.salePrice,
      variantId: value.variantId,
      image: value.image,
    });
  };

  React.useEffect(() => {
    const items = form.getValues("lineItems");
    const total = items.reduce(
      (acc, curr) => {
        acc.count += curr.quantity;
        acc.amount += curr.total;
        return acc;
      },
      {
        count: 0,
        amount: 0,
      }
    );
    form.setValue("totalAmount", total.amount);
    form.setValue("totalItems", total.count);
  }, [form.watch("lineItems")]);

  const onSubmit = (values: z.infer<typeof transferValidation>) => {
    // mutate(values, {
    //   onSuccess: (res) => {
    //     toast({
    //       variant: "success",
    //       title: "Product created successfully!",
    //     });
    //     form.reset();
    //     setPreview("");
    //     toggle();
    //   },
    //   onError: (error: any) => {
    //     toast({
    //       variant: "error",
    //       title: error.response.data.message || "Something went wrong",
    //     });
    //   },
    // });
  };

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full"
          >
            <SheetHeader className="md:pb-2">
              <SheetTitle>New Transfer</SheetTitle>
            </SheetHeader>

            <div className="pb-4 space-y-4">
              <FormField
                control={form.control}
                name="fromId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Source" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={`${field.value}`}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {locations?.data.data.map((location: Option) => (
                          <SelectItem
                            value={`${location.id}`}
                            key={location.id}
                          >
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <AutoComplete
                  onSelect={onSelect}
                  error={form.formState.errors.lineItems}
                />
              </div>
            </div>

            <SimpleBar className="-mx-6 px-6 relative  grow max-h-full overflow-y-auto">
              <div className="space-y-2">
                {lineItems.fields.map((field, i) => (
                  <div
                    className="flex rounded-md border p-2 items-center"
                    key={field.id}
                  >
                    <div className="flex gap-3 items-center col-span-2">
                      <Avatar className="w-10 h-10 border-2">
                        <AvatarImage
                          asChild
                          src={`/${field.image}`}
                          className="object-cover"
                        >
                          <Image
                            src={`/${field.image}`}
                            alt={`/${field.image}`}
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
                        <div className="text-muted-foreground text-xs">
                          {field.sku}
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div>{field.quantity}</div>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => lineItems.remove(i)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </SimpleBar>

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
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default NewSheet;
