"use client";
import React from "react";
import Link from "next/link";
import StickyHeader from "@/components/shared/sticky-header";
import { Plus, Search } from "lucide-react";
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
import FacetFilter from "./FacetFilter";
const Filters = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  return (
    <StickyHeader>
      <div className="grid grid-cols-2 items-center">
        <div className="relative">
          <span className="absolute inset-y-0 inline-flex items-center pr-4 text-muted-foreground">
            <Search className="w-5 h-5" />
          </span>
          <Input
            className="bg-transparent rounded-none border-none pl-8 focus-visible:ring-transparent"
            placeholder="Search..."
          />
        </div>
        <div className="relative flex gap-4 justify-end">
          <FacetFilter />
          <div className={cn("grid gap-2", className)}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="secondary"
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Button asChild>
            <Link href="/sales/new">
              <Plus className="w-5 h-5 mr-2" />
              New
            </Link>
          </Button>
        </div>
      </div>
    </StickyHeader>
  );
};

export default Filters;
