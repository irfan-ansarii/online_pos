"use client";
import React from "react";
import Link from "next/link";
import StickyHeader from "@/components/shared/sticky-header";
import { ListFilter, Plus, Search } from "lucide-react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Filters = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

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
};

export default Filters;
