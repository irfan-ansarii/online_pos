"use client";
import React from "react";
import { Check } from "lucide-react";

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
    <TabsContent value="employee" className="flex flex-col h-full">
      <DialogHeader className="text-left pb-6">
        <DialogTitle>Select sales executive</DialogTitle>
        <DialogDescription>
          Select the option bellow send or print invoice
        </DialogDescription>
      </DialogHeader>
      <div className="pb-6">
        <Input placeholder="Search..." className="bg-border" />
      </div>
      <ScrollBar className="max-h-[18rem] h-72 w-full grow">
        {isLoading && (
          <div className="divide-y border-y">
            {[...Array(4)].map((_, i) => (
              <div className="flex py-3 items-center" key={i}>
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
      </ScrollBar>
    </TabsContent>
  );
};

export default EmployeeTab;
