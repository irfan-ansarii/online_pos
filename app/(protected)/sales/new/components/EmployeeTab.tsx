"use client";
import React from "react";
import { Check, Search } from "lucide-react";

import { useFormContext } from "react-hook-form";
import { useUsers } from "@/hooks/useUsers";

import { AvatarItem } from "@/components/shared/avatar";
import LoadingSmall from "@/components/shared/loading-sm";

import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const EmployeeTab = ({ headerIcon }: { headerIcon?: React.ReactNode }) => {
  const [search, setSearch] = React.useState("");
  const form = useFormContext();
  const { users, isLoading } = useUsers({
    search,
  });

  return (
    <TabsContent
      value="employee"
      className="mt-0 focus-visible:ring-transparent"
    >
      <DialogHeader className="pb-6">
        <div className="flex item-center">
          {headerIcon}
          <DialogTitle>Select Employee</DialogTitle>
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
      </div>
      <div className="relative  overflow-y-auto scrollbox h-[21rem]">
        {isLoading && <LoadingSmall />}

        {!isLoading && users?.data?.length === 0 && (
          <div className="text-center py-4">No results found.</div>
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
                  {users?.data?.map((user) => (
                    <FormItem className="space-y-0 relative" key={user.id}>
                      <FormControl className="peer sr-only">
                        <RadioGroupItem value={user.id} />
                      </FormControl>
                      <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="w-3 h-3" />
                      </div>
                      <FormLabel className="flex gap-3 px-3 py-2 rounded-md border items-center cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent">
                        <AvatarItem src="" />
                        <div className="flex-1">{user.firstName}</div>
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
    </TabsContent>
  );
};

export default EmployeeTab;
