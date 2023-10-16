"use client";

import React from "react";
import PropTypes from "prop-types";
import { useFieldArray, useWatch } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Variants = ({ form }: { form: any }) => {
  const options = useWatch({
    name: "options",
    control: form.control,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function generateVariants(
    options: [{ name: string; values: [{ value: string }] }]
  ) {
    remove();
    function generate(current: string[], index: number) {
      if (index === options.length) {
        append({ title: current.join("/") });
        return;
      }

      for (const value of options[index].values) {
        generate([...current, value.value], index + 1);
      }
    }

    generate([], 0);
  }

  React.useEffect(() => {
    generateVariants(options);
  }, [options]);

  return (
    <div className="divide-y border-y">
      {/* header */}
      {fields && fields.length > 0 && (
        <div className="grid grid-cols-4 gap-2 font-medium text-muted-foreground">
          <div className="py-3 truncate">Variant</div>
          <div className="py-3 truncate">Purchase Price</div>
          <div className="py-3 truncate">Sale Price</div>
          <div className="py-3 truncate">SKU</div>
        </div>
      )}

      {/* row */}
      {fields.map((field, index) => (
        <div className="grid grid-cols-4 gap-2">
          <div className="py-2 inline-flex items-center truncate font-medium">
            {field?.title}
          </div>
          <div className="py-2">
            <FormField
              control={form.control}
              name={`variants.${index}.purchasePrice`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-2">
            <FormField
              control={form.control}
              name={`variants.${index}.salePrice`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="py-2">
            <FormField
              control={form.control}
              name={`variants.${index}.sku`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="ABC1234" {...field} />
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
