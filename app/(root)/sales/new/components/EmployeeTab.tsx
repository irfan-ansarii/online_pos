"use client";
import React from "react";
import { Check } from "lucide-react";
import SimpleBar from "simplebar-react";
import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import { Button } from "@/components/ui/button";

const EmployeeTab = ({ headerIcon }: { headerIcon?: React.ReactNode }) => {
  const [search, setSearch] = React.useState("");
  const form = useFormContext();
  const { isLoading, data, isError, refetch, isRefetching } = useUsers({
    search,
  });
  const users = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.data.data);
  }, [data]);

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
      <SimpleBar className="h-80">
        {isError && (
          <div>
            <div className="text-center">An error occurred!</div>
            <div className="text-muted-foreground text-center mb-3">
              click on the button bellow to refresh.
            </div>
            <Button className="w-full" onClick={() => refetch()}>
              {isRefetching ? "Loading..." : "Refresh"}
            </Button>
          </div>
        )}

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
        {!isLoading && users?.length === 0 && (
          <div className="text-center">No results found.</div>
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
                    <FormItem className="space-y-0 relative" key={user.id}>
                      <FormControl className="peer sr-only">
                        <RadioGroupItem value={user.id} />
                      </FormControl>
                      <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="w-3 h-3" />
                      </div>
                      <FormLabel className="flex gap-3 px-3 py-2 rounded-md border items-center cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent">
                        <Avatar>
                          <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="@shadcn"
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
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
      </SimpleBar>
    </TabsContent>
  );
};

export default EmployeeTab;
