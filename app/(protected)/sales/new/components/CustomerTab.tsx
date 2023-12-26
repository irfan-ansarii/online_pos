"use client";
import React from "react";
import { Check, Mail, Phone, Plus, Search } from "lucide-react";

import { AvatarItem } from "@/components/shared/avatar";
import LoadingSmall from "@/components/shared/loading-sm";
import AddCustomerSheet from "../../../customers/(base)/components/AddCustomerSheet";
import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { useCustomers } from "@/hooks/useCustomers";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomerTab = ({ headerIcon }: { headerIcon?: React.ReactNode }) => {
  const [search, setSearch] = React.useState("");
  const form = useFormContext();

  const { customers, isLoading, mutate } = useCustomers({
    search,
  });

  return (
    <TabsContent value="customer" className="mt-0">
      <DialogHeader className="pb-6">
        <div className="flex item-center">
          {headerIcon}
          <DialogTitle>Select Customer</DialogTitle>
        </div>
      </DialogHeader>

      <div className="relative">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="h-full">
              <FormControl>
                {/* command starts here */}
                <Command className="bg-background relative">
                  <span className="absolute left-3 text-muted-foreground top-0 h-11 inline-flex items-center">
                    <Search className="w-5 h-5" />
                  </span>
                  <Input
                    placeholder="Search..."
                    className="h-11 pl-10 focus-visible:ring-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <AddCustomerSheet
                    onSuccess={(value) => {
                      mutate();
                      form.setValue("customerId", value.id);
                      setSearch(value.phone);
                    }}
                  >
                    <Button
                      variant="link"
                      size="icon"
                      className="absolute top-0.5 right-0"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </AddCustomerSheet>

                  <CommandList className="mt-2">
                    {isLoading && <LoadingSmall />}

                    {!isLoading && customers?.data?.length === 0 && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}

                    <CommandGroup className="p-0 [&>div]:space-y-1">
                      {customers?.data?.map((customer) => (
                        <CommandItem
                          className="border flex gap-2 relative rounded-md"
                          key={customer.id}
                          onSelect={() => {
                            form.setValue("customerId", customer.id);
                          }}
                        >
                          <AvatarItem src="" />
                          <div>
                            <div>{customer.firstName}</div>
                            <div className="flex gap-4 text-xs items-center">
                              {customer.phone && (
                                <div className="text-muted-foreground font-normal inline-flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {customer.phone}
                                </div>
                              )}
                              {customer.email && (
                                <div className="text-muted-foreground font-normal inline-flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {customer.email}
                                </div>
                              )}
                            </div>
                          </div>
                          {field.value === customer.id && (
                            <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-100">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
                {/* command ends here */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
};

export default CustomerTab;
