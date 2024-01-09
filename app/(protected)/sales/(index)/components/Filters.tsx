"use client";
import React from "react";

import { Check, ListFilter, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { useQueryParams } from "@/hooks/useQueryParams";
import { cn } from "@/lib/utils";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useCustomers } from "@/hooks/useCustomers";

const status = [
  {
    value: "pending",
    label: "Due",
  },
  {
    value: "paid",
    label: "Paid",
  },
  {
    value: "partialy_paid",
    label: "Partialy Paid",
  },
  {
    value: "partialy_refunded",
    label: "Partialy Refunded",
  },
  {
    value: "refunded",
    label: "Refunded",
  },
];
const Filters = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  const { customers } = useCustomers({ search: "" });

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-32 truncate justify-start">
            <ListFilter className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">
              {queryParams.employee
                ? customers?.data?.find((st) => st.id == queryParams.employee)
                    ?.firstName
                : "Employee"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="h-44 overflow-y-auto">
              {customers?.data?.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={`${supplier.id}`}
                  onSelect={(value) => {
                    setQueryParams({ employee: value });
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      queryParams.employee == supplier.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {supplier?.firstName}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setQueryParams({ employee: null });
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-32 truncate justify-start">
            <ListFilter className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">
              {queryParams.customer
                ? customers?.data?.find((st) => st.id == queryParams.customer)
                    ?.firstName
                : "Customer"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="h-44 overflow-y-auto">
              {customers?.data?.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={`${supplier.id}`}
                  onSelect={(value) => {
                    setQueryParams({ customer: value });
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      queryParams.customer == supplier.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {supplier?.firstName}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setQueryParams({ customer: null });
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-28 truncate justify-start">
            <ListFilter className="w-4 h-4 mr-2 shrink-0" />
            <span className="truncate">
              {queryParams.status
                ? status.find((st) => st.value === queryParams.status)?.label
                : "Status"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {status.map((st) => (
                <CommandItem
                  key={st.value}
                  value={st.value}
                  onSelect={(currentValue) => {
                    setQueryParams({ status: currentValue });
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      queryParams.status === st.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {st.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setQueryParams({ status: null });
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Filters;
