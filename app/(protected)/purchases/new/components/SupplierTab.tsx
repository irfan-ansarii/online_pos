"use client";
import React from "react";
import { ArrowLeft, Check, Mail, Phone, Plus, Search } from "lucide-react";

import LoadingSmall from "@/components/shared/loading-sm";
import AddCustomerSheet from "../../../customers/(route)/components/AddCustomerSheet";
import { TabsContent } from "@/components/ui/tabs";
import {
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { useCustomers } from "@/hooks/useCustomers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SupplierTab = ({ setActive }: { setActive: (tab: string) => void }) => {
  const [search, setSearch] = React.useState("");
  const form = useFormContext();

  const {
    customers: suppliers,
    isLoading,
    mutate,
  } = useCustomers({
    search,
  });

  return (
    <TabsContent
      value="supplier"
      className="mt-0 focus-visible:ring-transparent"
    >
      <div className="flex flex-col h-[32rem]">
        <DialogHeader className="pb-6">
          <div className="flex item-center">
            <DialogTrigger asChild>
              <span className="pr-3 cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </span>
            </DialogTrigger>
            <DialogTitle>Supplier</DialogTitle>
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
        </div>

        <div className="overflow-y-auto relative scrollbox flex-1">
          {isLoading && <LoadingSmall />}

          {!isLoading && suppliers?.data?.length === 0 && (
            <div className="text-center py-4">No results found.</div>
          )}

          <FormField
            control={form.control}
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-1"
                  >
                    {suppliers?.data?.map((supplier) => (
                      <FormItem
                        className="space-y-0 relative"
                        key={supplier.id}
                      >
                        <FormControl className="peer sr-only">
                          <RadioGroupItem value={supplier.id} />
                        </FormControl>
                        <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                          <Check className="w-3 h-3" />
                        </div>
                        <FormLabel className="space-y-1 py-2 px-3 rounded-md border block cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent">
                          <div>{supplier.firstName}</div>
                          <div className="flex gap-4 text-xs items-center">
                            <div className="text-muted-foreground font-normal inline-flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {supplier.phone}
                            </div>
                            <div className="text-muted-foreground font-normal inline-flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {supplier.email}
                            </div>
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
          disabled={!form.getValues("supplierId")}
          onClick={() => setActive("receipt")}
        >
          Next
        </Button>
      </div>
    </TabsContent>
  );
};

export default SupplierTab;