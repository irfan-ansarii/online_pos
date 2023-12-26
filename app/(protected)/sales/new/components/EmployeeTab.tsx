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
  FormMessage,
} from "@/components/ui/form";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const EmployeeTab = ({ headerIcon }: { headerIcon?: React.ReactNode }) => {
  const [search, setSearch] = React.useState("");
  const form = useFormContext();
  const { users, isLoading } = useUsers({
    search,
  });

  return (
    <TabsContent value="employee" className="mt-0">
      <DialogHeader className="pb-6">
        <div className="flex item-center">
          {headerIcon}
          <DialogTitle>Select Sales Executive</DialogTitle>
        </div>
      </DialogHeader>

      <div className="relative  max-h-full overflow-y-auto scrollbox h-96">
        <FormField
          control={form.control}
          name="employeeId"
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
                  <CommandList className="mt-2">
                    {isLoading ? (
                      <LoadingSmall />
                    ) : (
                      <>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="p-0 [&>div]:space-y-1">
                          {users?.data?.map((user) => (
                            <CommandItem
                              className="border flex gap-2 relative rounded-md"
                              value={user.id}
                              key={user.id}
                              onSelect={() => {
                                form.setValue("employeeId", user.id);
                              }}
                            >
                              <AvatarItem src="" />
                              <span>{user.firstName}</span>

                              {field.value === user.id && (
                                <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-100">
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
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

export default EmployeeTab;
