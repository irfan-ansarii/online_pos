"use client";
import React from "react";

import { Check, ListFilter, X } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    value: "refunded",
    label: "Refunded",
  },
  {
    value: "partialy_refunded",
    label: "Partialy Refunded",
  },
  {
    value: "returned",
    label: "Returned",
  },
];
const Filters = () => {
  const { queryParams, setQueryParams } = useQueryParams();
  const { customers } = useCustomers({ search: "" });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <ListFilter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Employee</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
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
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Customer</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
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
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
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
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Filters;
