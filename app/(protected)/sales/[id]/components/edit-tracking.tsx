import React from "react";
import { cn } from "@/lib/utils";
import { COURIERS } from "@/config/app";
import { format } from "date-fns";

import { useFormContext } from "react-hook-form";

import { Calendar as CalendarIcon } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TabsContent } from "@/components/ui/tabs";

const EditTracking = () => {
  const form = useFormContext();

  // update tracking link
  React.useEffect(() => {
    const courier = form.getValues("carrier");
    const awb = form.getValues("awb");
    const selected = COURIERS.find((c) => c.name === courier);
    if (courier) form.setValue("trakingUrl", `${selected?.url}${awb}`);
  }, [form.watch("carrier"), form.watch("awb")]);

  return (
    <TabsContent
      value="tracking"
      className="mt-0 focus-visible:ring-transparent"
    >
      <div className="flex flex-col h-[34rem] gap-4">
        <DialogHeader className="mb-4">
          <DialogTitle>Add/Edit Tracking</DialogTitle>
        </DialogHeader>

        <div className="scrollbox grid gap-4 grid-cols-1 overflow-auto -mx-4 px-4 grow">
          {/* items */}
          <FormField
            control={form.control}
            name="carrier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Courier</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COURIERS.map((courier) => (
                      <SelectItem value={courier.name} key={courier.name}>
                        {courier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={`awb`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Awb</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`charges`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courier Charge</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name={`trakingUrl`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Traking URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="m@example.com">m@example.com</SelectItem>
                    <SelectItem value="m@google.com">m@google.com</SelectItem>
                    <SelectItem value="m@support.com">m@support.com</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Shipping Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {format(new Date(field.value), "dd-MM-yyyy")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date()}
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
              name="deliveryAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Delivery Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "justify-start font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {format(new Date(field.value), "dd-MM-yyyy")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="w-full" type="submit">
            Save
          </Button>
        </DialogFooter>
      </div>
    </TabsContent>
  );
};

export default EditTracking;
