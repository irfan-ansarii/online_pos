"use client";
import React from "react";
import { ArrowLeft, Check, Mail, Phone, Plus, Search } from "lucide-react";

import LoadingSmall from "@/components/shared/loading-sm";
import AddContactSheet from "../../../contacts/(route)/components/AddContactSheet";
import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { useContacts } from "@/hooks/useContacts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CustomerTab = ({ setActive }: { setActive: (tab: string) => void }) => {
  const [search, setSearch] = React.useState("");
  const form = useFormContext();

  const { contacts, isLoading, mutate } = useContacts({
    search,
    role: "customer",
  });

  const setCustomer = (id: any) => {
    const customer = contacts?.data?.find((c) => c.id === Number(id));

    if (!customer) return;

    const { addresses, firstName, lastName, phone, email } = customer;
    const hasAddress = Array.isArray(addresses) && addresses.length > 0;

    const billing = [`${firstName} ${lastName}`];

    if (hasAddress) {
      const { company, address, address2, city, state, zip, gstin } =
        addresses[0];
      billing[1] = `${company}`;
      billing[2] = `${address} ${address2 ? address2 : ""}`;
      billing[3] = `${city} ${state} ${zip}`;
      billing[4] = `${gstin}`;
    }

    billing[5] = `${phone}`;
    billing[6] = `${email}`;

    form.setValue("billingAddress", billing);
    form.setValue("shippingAddress", billing);
  };

  return (
    <TabsContent
      value="customer"
      className="mt-0 focus-visible:ring-transparent"
    >
      <div className="flex flex-col h-[32rem]">
        <DialogHeader className="pb-6">
          <div className="flex item-center">
            <span
              className="pr-3 cursor-pointer"
              onClick={() => setActive("employee")}
            >
              <ArrowLeft className="w-5 h-5" />
            </span>
            <DialogTitle>Customer</DialogTitle>
          </div>
        </DialogHeader>

        <div className="relative mb-2">
          <span className="absolute left-3 text-muted-foreground top-0 h-11 inline-flex items-center">
            <Search className="w-5 h-5" />
          </span>
          <Input
            placeholder="Search..."
            className="h-11 pl-10 bg-secondary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AddContactSheet
            onSuccess={(value) => {
              if (value.role === "customer") {
                setCustomer(value);
                form.setValue("customerId", value.id);
                setActive("payment");
              }
              mutate();
            }}
            role="customer"
          >
            <Button
              variant="link"
              size="icon"
              className="absolute top-0.5 right-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </AddContactSheet>
        </div>

        <div className="overflow-y-auto relative scrollbox flex-1">
          {isLoading && <LoadingSmall />}

          {!isLoading && contacts?.data?.length === 0 && (
            <div className="text-center py-4">No results found.</div>
          )}

          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={(e) => {
                      field.onChange(e);
                      setCustomer(e);
                    }}
                    defaultValue={field.value}
                    className="flex flex-col gap-1"
                  >
                    {contacts?.data?.map((customer: any) => (
                      <FormItem
                        className="space-y-0 relative"
                        key={customer.id}
                      >
                        <FormControl className="peer sr-only">
                          <RadioGroupItem value={customer.id} />
                        </FormControl>
                        <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                          <Check className="w-3 h-3" />
                        </div>
                        <FormLabel className="space-y-1 py-2 px-3 rounded-md border block cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent">
                          <div>{customer.firstName}</div>
                          <div className="flex gap-4 text-xs items-center">
                            <div className="text-muted-foreground font-normal inline-flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {customer.phone}
                            </div>
                            {customer.email && (
                              <div className="text-muted-foreground font-normal inline-flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {customer.email}
                              </div>
                            )}
                          </div>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="w-full mt-10"
          type="button"
          disabled={!form.getValues("customerId")}
          onClick={() => setActive("payment")}
        >
          Next
        </Button>
      </div>
    </TabsContent>
  );
};

export default CustomerTab;
