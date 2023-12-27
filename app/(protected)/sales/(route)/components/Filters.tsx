import * as React from "react";

import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ListFilter } from "lucide-react";

export default function Filters() {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="border-dashed">
            <ListFilter className="w-4 h-4 mr-2" />
            Employee
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="search" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup></CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="border-dashed">
            <ListFilter className="w-4 h-4 mr-2" />
            Customer
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="search" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup></CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="border-dashed">
            <ListFilter className="w-4 h-4 mr-2" />
            Status
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="search" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup></CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
