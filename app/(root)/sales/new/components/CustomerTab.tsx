"use client";
import React from "react";
import { Check, Mail, Phone } from "lucide-react";

import { TabsContent } from "@/components/ui/tabs";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";

import ScrollBar from "react-perfect-scrollbar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { useCustomers } from "@/hooks/useCustomer";
const CustomerTab = () => {
  const form = useFormContext();
  const { isLoading, data } = useCustomers({});
  const users = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data);
  }, [data]);

  return (
    <TabsContent value="customer">
      <DialogHeader className="text-left pb-6">
        <DialogTitle>Select sales executive</DialogTitle>
        <DialogDescription>
          Select the option bellow send or print invoice
        </DialogDescription>
      </DialogHeader>
      <div className="pb-6">
        <Input placeholder="Search..." className="bg-border" />
      </div>

      <ScrollBar className="h-full max-h-[17rem]">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col divide-y border-y gap-0"
                >
                  {users?.map((user) => (
                    <FormItem className="space-y-0 relative" key={user.id}>
                      <FormControl className="peer sr-only">
                        <RadioGroupItem value={user.id} />
                      </FormControl>
                      <div className="absolute text-muted-foreground right-0 inset-y-0 flex items-center h-full opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="w-4 h-4" />
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
      </ScrollBar>
    </TabsContent>
  );
};

export default CustomerTab;
