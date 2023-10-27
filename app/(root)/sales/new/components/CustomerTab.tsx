"use client";
import React from "react";
import { Check, Mail, Phone } from "lucide-react";
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

const CustomerTab = () => {
  const form = useFormContext();
  const { isLoading, data } = useCustomers({});
  const users = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data);
  }, [data]);

  return (
    <TabsContent value="customer" className="mt-0">
      <DialogHeader className="text-left pb-6">
        <DialogTitle>Select Customer</DialogTitle>
      </DialogHeader>
      <div className="pb-6">
        <Input placeholder="Search..." className="bg-border" />
      </div>

      <SimpleBar className="h-72">
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
                <Skeleton className="w-16 h-3" />
              </div>
            ))}
          </div>
        )}
        {/* add customer sheet*/}
        {users && users.length === 0 && <AddCustomerSheet />}

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
                    <FormItem
                      className="space-y-0 px-3 rounded-md border relative"
                      key={user.id}
                    >
                      <FormControl className="peer sr-only">
                        <RadioGroupItem value={user.id} />
                      </FormControl>
                      <div className="absolute w-5 h-5 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="w-3 h-3" />
                      </div>
                      <FormLabel className="font-normal py-2 block cursor-pointer">
                        <div className="mb-1.5">{user.firstName}</div>
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