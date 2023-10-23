import React from "react";
import { PenSquare } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const DiscountPopover = () => {
  const form = useFormContext();
  const [open, toggle] = useToggle(false);

  const { fields } = useFieldArray({
    control: form.control,
    name: "discountLines",
  });

  return (
    <Popover open={open} onOpenChange={toggle}>
      <PopoverTrigger asChild>
        <span className="ml-4 cursor-pointer text-muted-foreground">
          <PenSquare className="w-3 h-3" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-background flex flex-col space-y-4">
        <FormLabel>Add or Edit Discount</FormLabel>
        {fields.map((field, index) => (
          <>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name={`discountLines.${index}.type`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="flex space-x-4"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {[
                          { id: 1, value: "percent", label: "Percent" },
                          { id: 2, value: "fixed", label: "Fixed" },
                        ].map((el) => (
                          <FormItem
                            className="flex items-center justify-between space-x-2 space-y-0"
                            key={el.id}
                          >
                            <FormLabel className="font-normal flex-1 cursor-pointer">
                              {el.label}
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value={el.value} />
                            </FormControl>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2" key={field.id}>
              <FormField
                control={form.control}
                name={`discountLines.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name={`discountLines.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </>
        ))}
        <Button
          onClick={() => {
            toggle();
          }}
        >
          Apply
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default DiscountPopover;
