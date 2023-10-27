"use client";
import React from "react";
import { Check } from "lucide-react";
import SimpleBar from "simplebar-react";
import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useUsers } from "@/hooks/useUser";
import { useFormContext } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";

const EmployeeTab = () => {
  const form = useFormContext();
  const { isLoading, data } = useUsers({});
  const users = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data);
  }, [data]);

  return (
    <TabsContent value="employee" className="mt-0">
      <DialogHeader className="text-left pb-6">
        <DialogTitle>Select sales executive</DialogTitle>
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
        <FormField
          control={form.control}
          name="employeeId"
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
                      <FormLabel className="font-normal py-3 block cursor-pointer">
                        {user.firstName}
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

export default EmployeeTab;
