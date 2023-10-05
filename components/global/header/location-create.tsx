"use client";
import * as z from "zod";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetHeader,
  SheetTrigger,
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { locationValidation } from "@/lib/validations/locations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateLocation } from "@/hooks/useUser";

const CreateWorkspace = ({
  trigger,
  refetch,
}: {
  trigger?: React.ReactNode;
  refetch: () => void;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { toast } = useToast();
  const { mutate, isLoading } = useCreateLocation();

  const form = useForm<z.infer<typeof locationValidation>>({
    resolver: zodResolver(locationValidation),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof locationValidation>) => {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "Location created successfully!",
        });

        setOpen(false);
        refetch();
      },
      onError: (err: any) => {
        toast({
          variant: "error",
          title: err.response.data.message,
        });
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="md:max-w-lg bg-background">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader className="md:pb-2">
              <SheetTitle>New location</SheetTitle>
            </SheetHeader>

            <ScrollArea className="grow -mx-6 h-full">
              <div className="flex flex-col gap-6 px-6 relative pb-4 md:pb-6">
                {isLoading && (
                  <div className="absolute w-full h-full transparent z-20"></div>
                )}

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Type</FormLabel>
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
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Name</FormLabel>
                      <div className="relative">
                        <FormControl
                          className={
                            form.formState.errors?.name
                              ? "!ring-destructive/50 border-destructive"
                              : ""
                          }
                        >
                          <Input type="text" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Phone</FormLabel>
                      <div className="relative">
                        <FormControl
                          className={
                            form.formState.errors?.phone
                              ? "!ring-destructive/50 border-destructive"
                              : ""
                          }
                        >
                          <Input {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <FormControl
                          className={
                            form.formState.errors?.email
                              ? "!ring-destructive/50 border-destructive"
                              : ""
                          }
                        >
                          <Input {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Address</FormLabel>
                      <div className="relative">
                        <FormControl
                          className={
                            form.formState.errors?.address
                              ? "!ring-destructive/50 border-destructive"
                              : ""
                          }
                        >
                          <Input {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address2"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Address2</FormLabel>
                      <div className="relative">
                        <FormControl
                          className={
                            form.formState.errors?.address
                              ? "!ring-destructive/50 border-destructive"
                              : ""
                          }
                        >
                          <Input {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>City</FormLabel>
                        <div className="relative">
                          <FormControl
                            className={
                              form.formState.errors?.city
                                ? "!ring-destructive/50 border-destructive"
                                : ""
                            }
                          >
                            <Input {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>State</FormLabel>
                        <div className="relative">
                          <FormControl
                            className={
                              form.formState.errors?.state
                                ? "!ring-destructive/50 border-destructive"
                                : ""
                            }
                          >
                            <Input {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>Zip</FormLabel>
                        <div className="relative">
                          <FormControl
                            className={
                              form.formState.errors?.zip
                                ? "!ring-destructive/50 border-destructive"
                                : ""
                            }
                          >
                            <Input {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col">
                        <FormLabel>Country</FormLabel>
                        <div className="relative">
                          <FormControl
                            className={
                              form.formState.errors?.country
                                ? "!ring-destructive/50 border-destructive"
                                : ""
                            }
                          >
                            <Input {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            <SheetFooter className="md:justify-between">
              <Button className="w-full" type="submit">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save"
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
