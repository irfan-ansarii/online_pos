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
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function generateVariants(options: [{ name: string; values: string[] }]) {
    remove();
    function generate(current: string[], index: number) {
      console.log(current);
      if (index === options.length) {
        append({ title: current.join("/") });
        return;
      }

      for (const value of options[index].values) {
        generate([...current, value], index + 1);
      }
    }

    generate([], 0);
  }

  React.useEffect(() => {
    generateVariants(options);
  }, [options]);

  return (
    <div className="divide-y border-y">
      {variants.map((_, index) => (
        <div className="grid grid-cols-2 gap-4 py-4 last:pb-0">
          <div className="col-span-2 inline-flex items-center truncate font-medium">
            <Badge variant="secondary" className="w-full rounded-md py-2">
              {form.watch(`variants.${index}.title`)}
            </Badge>
          </div>

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
            rules={{ required: "Required" }}
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
          <FormField
            control={form.control}
            name={`variants.${index}.sku`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="ABC1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};

export default Variants;
