"use client";

import React from "react";
import PropTypes from "prop-types";

import { useFieldArray, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const Variants = ({ form }) => {
  const options = useWatch({
    name: "options",
    control: form.control,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function generateVariants(options) {
    remove();
    function generate(current, index) {
      if (index === options.length) {
        append({ name: current.join("/") });
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
    <div>
      <ul className="flex flex-col gap-1 overflow-x-auto">
        {/* header row */}
        {fields && fields.length > 0 && (
          <li className="flex items-center bg-background">
            <div className="sticky left-0 p-3 pl-6 w-28 shrink-0 z-10 bg-background border-r">
              <div className="font-medium text-muted-foreground truncate uppercase">
                Variant
              </div>
            </div>
            <div className="flex w-full">
              <div className="basis-2/5 shrink-0 bg-background p-3">
                <div className="truncate font-medium text-muted-foreground text-center uppercase">
                  Purchase Price
                </div>
              </div>
              <div className="basis-2/5 shrink-0 bg-background p-3">
                <div className="truncate font-medium text-muted-foreground text-center uppercase">
                  Sale Price
                </div>
              </div>
              <div className="basis-2/5 shrink-0 bg-background p-3">
                <div className="truncate font-medium text-muted-foreground text-center  uppercase">
                  SKU
                </div>
              </div>
            </div>
          </li>
        )}

        {/* data row */}
        {fields.map((item, index) => (
          <li key={index} className="flex items-center bg-background">
            <div className="sticky left-0 p-3 pl-6 w-28 shrink-0 z-10 bg-background border-r">
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex w-full">
              <div className="basis-2/5 shrink-0 bg-background p-3">
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
              <div className="basis-2/5 shrink-0 bg-background p-3">
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
              <div className="basis-2/5 shrink-0 bg-background p-3">
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Variants;
