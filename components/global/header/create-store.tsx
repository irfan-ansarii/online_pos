"use client";
import * as z from "zod";

import React from "react";
import { useRouter } from "next/navigation";
import { createLocation } from "@/actions/store-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationValidation } from "@/lib/validations/locations";

import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { useSheetToggle } from "@/hooks/useSheet";

import { Loader2 } from "lucide-react";

import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateWorkspace = () => {
  const [loading, setLoading] = React.useState(false);

  const [open, toggleOpen] = useSheetToggle("storeModal");
  const router = useRouter();
  const form = useForm<z.infer<typeof locationValidation>>({
    resolver: zodResolver(locationValidation),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof locationValidation>) => {
    try {
      setLoading(true);
      await createLocation(values);
      toast({
        variant: "success",
        title: "Store created successfully!",
      });

      router.refresh();
      toggleOpen();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={toggleOpen}>
      <SheetContent className="md:max-w-lg bg-background">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader className="md:pb-2">
              <SheetTitle>New Store</SheetTitle>
            </SheetHeader>

            <div className="space-y-4 flex-1 overflow-auto snap-y snap-mandatory -mx-6 px-6 scrollbox mb-4">
              <div className="flex flex-col gap-6 relative pb-4 md:pb-6">
                {loading && (
                  <div className="absolute w-full h-full transparent z-20"></div>
                )}

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem className="relative space-y-0">
                            <FormControl className="absolute right-3 top-1/2 -translate-y-1/2 ">
                              <RadioGroupItem value="store" />
                            </FormControl>
                            <FormLabel className="flex text-foreground font-normal p-3 border rounded-md cursor-pointer">
                              Store
                            </FormLabel>
                          </FormItem>
                          <FormItem className="relative space-y-0">
                            <FormControl className="absolute right-3 top-1/2 -translate-y-1/2">
                              <RadioGroupItem value="warehouse" />
                            </FormControl>
                            <FormLabel className="flex  text-foreground font-normal p-3 border rounded-md  cursor-pointer">
                              Warehouse
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address2</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="md:justify-between">
              <Button className="w-full" type="submit">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateWorkspace;
