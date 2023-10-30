"use client";
import React from "react";
import { Check, Mail, Phone, Plus } from "lucide-react";
import SimpleBar from "simplebar-react";
import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { useCustomers } from "@/hooks/useCustomer";
import AddCustomerSheet from "@/app/(root)/customers/components/AddCustomerSheet";
import { Button } from "@/components/ui/button";

const CustomerTab = ({ headerIcon }: { headerIcon?: React.ReactNode }) => {
  const form = useFormContext();
  const { isLoading, data } = useCustomers({});
  const users = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data);
  }, [data]);

  return (
    <TabsContent value="customer" className="mt-0">
      <DialogHeader className="pb-6">
        <div className="flex item-center">
          {headerIcon}
          <DialogTitle>Select Customer</DialogTitle>
        </div>
      </DialogHeader>
      <div className="pb-6">
        <Input placeholder="Search..." className="bg-border" />
      </div>

      <SimpleBar className="h-80">
        {isLoading && (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                className="flex py-3 items-center rounded-md px-3 border"
                key={i}
              >
                <div className="space-y-2 grow">
                  <Skeleton className="w-32 h-3" />
                  <Skeleton className="w-48 h-2.5" />
                </div>
                <Skeleton className="w-4 h-4" />
              </div>
            ))}
          </div>
        )}

        {/* add customer sheet*/}
        {!isLoading && users?.length === 0 && (
          <div className="text-center space-y-4">
            <div>No results found.</div>
            <AddCustomerSheet
              button={
                <Button className="w-full">
                  <Plus className="w-5 h-5 mr-2" /> Create a new customer
                </Button>
              }
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col"
                >
                  {users?.map((user) => (
                    <FormItem className="space-y-0 relative" key={user.id}>
                      <FormControl className="peer sr-only">
                        <RadioGroupItem value={user.id} />
                      </FormControl>
                      <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="w-3 h-3" />
                      </div>
                      <FormLabel className="space-y-1.5 py-2 px-3 rounded-md border block cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent">
                        <div>{user.firstName}</div>
                        <div className="flex gap-4 text-xs items-center">
                          <div className="text-muted-foreground font-normal inline-flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phone}
                          </div>
                          <div className="text-muted-foreground font-normal inline-flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
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
      </SimpleBar>
    </TabsContent>
  );
};

export default CustomerTab;
