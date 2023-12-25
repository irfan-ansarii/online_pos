"use client";
import React from "react";
import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

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

import { useUsers } from "@/hooks/useUsers";

import { Skeleton } from "@/components/ui/skeleton";
import { AvatarItem } from "@/components/shared/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
      <div className="pb-6">
        <Input
          placeholder="Search..."
          className="bg-border"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="relative  max-h-full overflow-y-auto scrollbox h-80">
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
                <Skeleton className="w-4 h-4 rounded-full" />
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
                {/* command starts here */}
                <Command className="bg-background">
                  <CommandInput
                    placeholder="Search..."
                    value={search}
                    onValueChange={(e) => setSearch(e)}
                  />
                  <CommandList className="mt-2">
                    {!isLoading && (
                      <CommandEmpty>No results found.</CommandEmpty>
                    )}
                    <CommandGroup className="p-0 [&>div]:space-y-1">
                      {users?.data?.map((user) => (
                        <CommandItem
                          className="border flex gap-2 relative"
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
