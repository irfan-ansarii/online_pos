"use client";
import React from "react";
import query from "india-pincode-search";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerValidation } from "@/lib/validations/customer";

import { Plus, Loader2, PlusCircle, Loader } from "lucide-react";

import { useFieldArray, useForm } from "react-hook-form";
import { useCreateCustomer } from "@/hooks/useCustomer";
import { toast } from "@/components/ui/use-toast";

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
import { Button } from "@/components/ui/button";

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
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      addresses: [],
    },
  });

  const addresses = useFieldArray({
    name: "addresses",
    control: form.control,
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

      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full  relative"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-transparent z-20"></div>
            )}
            <SheetHeader>
              <SheetTitle className="text-lg">Edit customer</SheetTitle>
            </SheetHeader>

            <div className="relative flex-1 max-h-full -mx-6 px-6 overflow-auto snap-y snap-mandatory space-y-2 scrollbox mb-4">
              <div className="grid grid-cols-2 gap-6 mb-6">
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

              {addresses.fields.map((field, i) => (
                <div key={field.id} className="space-y-6 border-b !mb-4">
                  <FormField
                    control={form.control}
                    name={`addresses.${i}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`addresses.${i}.address`}
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
                      name={`addresses.${i}.address2`}
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
                      name={`addresses.${i}.zip`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip</FormLabel>
                          <FormControl
                            onChange={(e) => {
                              field.onChange(e);

                              const value = e.target.value;
                              const res = query.search(value);

                              if (res && res.length > 0) {
                                const { city, state } = res[0];
                                form.setValue(`addresses.${i}.city`, city);
                                form.setValue(`addresses.${i}.state`, state);
                              } else {
                                form.setValue(`addresses.${i}.city`, "");
                                form.setValue(`addresses.${i}.state`, "");
                              }
                            }}
                          >
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`addresses.${i}.city`}
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
                      name={`addresses.${i}.state`}
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
                      name={`addresses.${i}.country`}
                      disabled={true}
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
                  <Button
                    className="w-full border-dashed !mt-2 !mb-4"
                    variant="link"
                    onClick={() => addresses.remove(i)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                className="w-full"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  addresses.append({
                    address: "",
                    address2: "",
                    zip: "",
                    city: "",
                    state: "",
                    country: "India",
                  });
                }}
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add Address
              </Button>
            </div>

            <SheetFooter className="md:justify-between pt-4">
              <Button className="w-full" type="submit">
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-apin" />
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
