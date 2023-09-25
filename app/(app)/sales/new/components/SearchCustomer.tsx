import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  return (
    <div className="relative grow ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-start w-full"
          >
            <User className="w-5 h-5 mr-2" />
            Select customer...
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search customer..." />
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  onSelect={(currentValue) => {
                    setOpen(false);
                  }}
                >
                  {framework.label}
                </CommandItem>
              ))}
              <DropdownMenuSeparator />
              <CommandItem>
                <Plus className="w-5 h-5 mr-2" /> Add Customer
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SearchCustomer;
