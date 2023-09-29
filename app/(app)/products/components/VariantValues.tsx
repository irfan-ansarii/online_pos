import React from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { X, Plus } from "lucide-react";
const VariantValues = ({ control, index }) => {
  const { setValue } = useForm();
  const { fields, remove, update } = useFieldArray({
    control,
    name: `variants.${index}.values`,
  });
  return (
    <>
      {console.log(fields.length)}
      <div className="flex gap-2">
        <div className="grow"></div>
        <Button variant="secondary" size="icon" className="shrink-0">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      {fields.map((item, i) => (
        <FormField
          control={control}
          name={`variants.${index}.values.${i}.value`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Variant name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
    </>
  );
};

export default VariantValues;
