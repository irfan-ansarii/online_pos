import React from "react";
import { useFieldArray } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface VariantProps {
  control: any;
  index: number;
}
const OptionValues = ({ control, index }: VariantProps) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `options.${index}.values`,
  });
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input && e.key === "Enter") {
        e.preventDefault();
        append({ value: input.value });
        input.value = "";
      }
    },
    []
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <div className="grow">
          <Input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            defaultValue=""
            placeholder="Option value"
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="shrink-0"
          onClick={() => {
            if (inputRef?.current?.value) {
              append({ value: inputRef?.current?.value });
              if (inputRef && inputRef.current) inputRef.current.value = "";
            }
          }}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {fields.map((item, i) => (
          <Badge
            className="pr-1 py-1 gap-2 overflow-hidden justify-between"
            variant="outline"
            key={i}
          >
            <span>{item && item.value}</span>
            <span
              onClick={() => remove(i)}
              className="bg-secondary hover:bg-destructive w-4 flex items-center justify-center h-4 rounded-full cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default OptionValues;
