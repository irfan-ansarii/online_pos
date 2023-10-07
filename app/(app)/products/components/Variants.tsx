"use client";
import React from "react";
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
  const formOptions = useWatch({
    name: "options",
    control: form.control,
    defaultValue: "simple",
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  function generateCombinations(arr) {
    function helper(index, currentCombination) {
      if (index === arr.length) {
        combinations.push([...currentCombination]);
        return;
      }

      const item = arr[index];
      for (const value of item.values) {
        currentCombination.push({ name: item.name, value });
        helper(index + 1, currentCombination);
        currentCombination.pop();
      }
    }

    const combinations = [];
    helper(0, []);
    return combinations;
  }

  React.useEffect(() => {
    console.log(generateCombinations(formOptions));
  }, [formOptions]);

  return (
    <ul className="flex flex-col gap-6">
      {fields.map((item, index) => (
        <li key={item.id} className="grid grid-cols-2 gap-4 bg-background p-6">
          <div className="text-muted-foreground items-center col-span-2 font-semibold  border-b-2 pb-2 flex justify-between">
            <span className="uppercase">{item.name}</span>
            <span>1290.00</span>
          </div>
          <FormField
            control={form.control}
            name={`variants.${index}.purchasePrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price</FormLabel>
                <FormControl>
                  <Input placeholder="Variant name" {...field} />
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
                  <Input placeholder="GN12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`variants.${index}.initialStock`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Initial Stock</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} defaultValue={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </li>
      ))}
    </ul>
  );
};

export default Variants;
