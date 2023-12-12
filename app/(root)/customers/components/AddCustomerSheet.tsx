"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import query from "india-pincode-search";
import * as z from "zod";
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetContent,
  SheetTitle,
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
import { Plus } from "lucide-react";
import { customerValidation } from "@/lib/validations/customer";
import { useCreateCustomer } from "@/hooks/useCustomer";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AddUserDialog = ({
  className,
  button,
}: {
  className?: string;
  button?: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof customerValidation>>({
    resolver: zodResolver(customerValidation),
    defaultValues: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
    },
  });
  const { mutate, isLoading } = useCreateCustomer();
  const onSubmit = (values: z.infer<typeof customerValidation>) => {
    mutate(values, {
      onSuccess: () => {
        setOpen(false);
        toast({
          variant: "success",
          title: "Customer created successfully",
        });
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
      {button ? (
        <SheetTrigger asChild>{button}</SheetTrigger>
      ) : (
        <SheetTrigger asChild>
          <div className={className}>
            <Button
              size="icon"
              className="rounded-full md:hidden fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button className="hidden md:flex">
              <Plus className="w-5 h-5 mr-2" />
              New
            </Button>
          </div>
        </SheetTrigger>
      )}
      <SheetContent className="flex flex-col h-full md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full relative"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-transparent z-20"></div>
            )}
            <SheetHeader>
              <SheetTitle className="text-lg">New Customer</SheetTitle>
            </SheetHeader>

            <div className="grow space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
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
                      <FormLabel>Email</FormLabel>
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip</FormLabel>
                      <FormControl
                        onChange={(e) => {
                          field.onChange();
                          const value = e.target.value;

                          if (!value || value.length !== 6) {
                            form.setValue("city", "");
                            form.setValue("state", "");
                            form.setError("zip", {
                              type: "custom",
                              message: "custom message",
                            });
                            return;
                          }
                          const res = query.search(value);

                          if (res && res.length > 0) {
                            const { city, state } = res[0];
                            form.setValue("city", city);
                            form.setValue("state", state);
                            form.clearErrors("zip");
                          } else {
                            form.setError("zip", {
                              message: "custom message",
                            });
                          }
                        }}
                      >
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  disabled={true}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  disabled={true}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  disabled={true}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <SheetFooter className="md:justify-between pt-4">
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

export default AddUserDialog;
