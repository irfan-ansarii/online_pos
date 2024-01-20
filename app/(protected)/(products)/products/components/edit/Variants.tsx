"use client";

import React from "react";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Variants = () => {
  const form = useFormContext();
  const options = useWatch({
    name: "options",
    control: form.control,
  });

  const {
    fields: variants,
    insert,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function generateVariants(options: [{ name: string; values: string[] }]) {
    const hasAllOptions = options.every(
      (opt) => opt.name && opt.values.length > 0
    );
    if (!hasAllOptions) return null;

    const generatedVariants: any[] = [];

    function generate(current: string[], index: number) {
      if (index === options.length) {
        const option = current.map((value, i) => ({
          name: options[i].name,
          value,
        }));

        const title = current.join("/");
        generatedVariants.push({
          title,
          option,
        });
      }
      if (options[index]?.name) {
        for (const value of options[index]?.values) {
          generate([...current, value], index + 1);
        }
      }
    }

    generate([], 0);
    return generatedVariants;
  }

  const updateVariants = (generated: any) => {
    if (!generated) return;

    const existingVariants = form.watch("variants");

    for (let i = variants.length - 1; i >= 0; i--) {
      //@ts-ignore
      const { title } = variants[i];
      const index = generated.findIndex((v: any) => v.title === title);
      if (index === -1) remove(i);
    }

    for (let i = 0; i < generated.length; i++) {
      const variant = generated[i];
      const index = existingVariants.findIndex(
        (v: any) => v.title === variant.title
      );

      if (index === -1)
        insert(
          i,
          {
            ...variant,
            purchasePrice: "",
            salePrice: "",
            sku: "",
            hsn: "",
            taxRate: "",
          },
          { shouldFocus: false }
        );
    }
  };

  React.useEffect(() => {
    const generated = generateVariants(options);
    updateVariants(generated);
  }, [options]);

  return (
    <div className="space-y-4">
      {variants.length > 0 && (
        <div className="text-lg font-semibold text-muted-foreground">
          Variants
        </div>
      )}
      {variants.map((variant: any, index) => (
        <div className="rounded-md border overflow-hidden" key={variant.id}>
          <Badge
            variant="secondary"
            className="w-full rounded-none p-3 bg-accent"
          >
            <span className="mr-2">{index + 1}.</span>
            {form.watch(`variants.${index}.title`)}
            {!variant?.itemId && <Badge className="ml-auto">New</Badge>}
          </Badge>

          <div className="p-4 grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`variants.${index}.purchasePrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${index}.salePrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${index}.sku`}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.hsn`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HSN Code</FormLabel>
                  <FormControl>
                    <Input placeholder="610400" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`variants.${index}.taxRate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Variants;
