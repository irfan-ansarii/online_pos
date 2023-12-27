import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ListFilter } from "lucide-react";

export default function Filters() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="border-dashed">
          <ListFilter className="w-4 h-4 mr-2" />
          Filters
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
  );
}
