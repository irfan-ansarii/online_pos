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
const EmployeeTab = () => {
  const form = useFormContext();
  const { isLoading, data } = useUsers({});
  const users = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data);
  }, [data]);

  return (
    <>
      <TabsContent value="employee">
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

      {/* <TabsTrigger
        value="employee"
        className="data-[state=active]:bg-primary py-0 h-2 data-[state=active]:w-10 data-[state=active]:opacity-100 opacity-60 bg-secondary rounded-full"
      ></TabsTrigger> */}
    </>
  );
};

export default EmployeeTab;
