"use client";
import React from "react";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";

import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

const ReceiptTab = ({ setActive }: { setActive: (tab: string) => void }) => {
  const form = useFormContext();

  return (
    <TabsContent
      value="receipt"
      className="mt-0 focus-visible:ring-transparent"
    >
      <div className="flex flex-col h-[32rem]">
        <DialogHeader className="pb-6">
          <div className="flex item-center">
            <span
              className="pr-3 cursor-pointer"
              onClick={() => setActive("supplier")}
            >
              <ArrowLeft className="w-5 h-5" />
            </span>
            <DialogTitle>Receipt</DialogTitle>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto relative scrollbox flex-1 -mx-4 px-4 space-y-6">
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd MMM, yyyy")
                        ) : (
                          <span>Select date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receipt No.</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          className="w-full mt-10"
          type="button"
          disabled={!form.getValues("supplierId")}
          onClick={() => setActive("payment")}
        >
          Next
        </Button>
      </div>
    </TabsContent>
  );
};

export default ReceiptTab;
