import React, { type KeyboardEvent } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, Plus } from "lucide-react";
const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
];

const SearchCustomer = () => {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = React.useState<string>("");

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Keep the options displayed when the user is typing
      if (!open) {
        setOpen(true);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === "Enter" && input.value !== "") {
      }

      if (event.key === "Escape") {
        input.blur();
      }
    },
    [open]
  );

  const handleBlur = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible">
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={handleBlur}
          onFocus={() => setOpen(true)}
          placeholder="Search..."
          className="text-base border-none"
        />
      </div>
      <div className="relative">
        {open && (
          <div className="absolute top-1 bg-accent border z-50 w-full rounded-md overflow-hidden outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                <CommandItem>hello</CommandItem>
                <CommandItem>hello</CommandItem>
                <CommandItem>hello</CommandItem>
                <CommandItem>hello</CommandItem>
                <DropdownMenuSeparator />
                <CommandItem>
                  <Plus className="w-5 h-5 mr-2" /> Add Customer
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  );
};

export default SearchCustomer;
