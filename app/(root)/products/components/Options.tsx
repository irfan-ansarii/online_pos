import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { X, Plus, Trash2, PlusCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
const Options = () => {
  const form = useFormContext();

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: `options`,
  });

  const setValues = (value: string, index: number) => {
    if (!value) return;
    const values = form.getValues(`options.${index}.values`);
    if (values.includes(value)) {
      form.setError(`options.${index}.value`, {
        type: "custom",
        message: "Value already exist",
      });
      return;
    }
    form.setValue(`options.${index}.values`, [...values, value]);
    form.setValue(`options.${index}.value`, "");
    form.setFocus(`options.${index}.value`);
  };

  const handleKeyDown = React.useCallback((e: any, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setValues(e.target.value, index);
    }
  }, []);

  const handleRemove = (optionIndex: number, valueIndex: number) => {
    const values = form.getValues(`options.${optionIndex}.values`);
    values.splice(valueIndex, 1);
    form.setValue(`options.${optionIndex}.values`, [...values]);
  };

  return (
    <>
      {fields.map((item, index) => (
        <li key={item.id} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="grow">
              <FormField
                control={form.control}
                name={`options.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Option name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              variant="secondary"
              size="icon"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full space-y-4">
            <div className="flex gap-2">
              <div className="grow">
                <FormField
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Option value"
                          onKeyDown={(e) => handleKeyDown(e, index)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                variant="secondary"
                size="icon"
                disabled={!form.watch(`options.${index}.value`)}
                className="shrink-0"
                onClick={() => {
                  const value = form.getValues(`options.${index}.value`);
                  setValues(value, index);
                }}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {form
                .getValues(`options.${index}.values`)
                .map((item: string, i: number) => (
                  <Badge
                    className="pr-1 py-1 gap-2 overflow-hidden justify-between"
                    variant="outline"
                    key={`${item}${i}`}
                  >
                    <span>{item}</span>
                    <span
                      onClick={() => {
                        handleRemove(index, i);
                      }}
                      className="bg-secondary hover:bg-destructive w-4 flex items-center justify-center h-4 rounded-full cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </span>
                  </Badge>
                ))}
            </div>
          </div>
        </li>
      ))}

      <li>
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => {
            append({ name: "", values: [], value: "" });
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </li>
    </>
  );
};

export default Options;
