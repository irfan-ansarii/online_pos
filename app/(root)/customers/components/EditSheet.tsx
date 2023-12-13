import React from "react";
import * as z from "zod";
import query from "india-pincode-search";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerValidation } from "@/lib/validations/customer";
import { Loader2, PlusCircle } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";
import { useForm, useFieldArray } from "react-hook-form";
import { useUpdateCustomer } from "@/hooks/useCustomer";
import { toast } from "@/components/ui/use-toast";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const UserSheet = ({
  customer,
  children,
}: {
  customer: any;
  children: React.ReactNode;
}) => {
  const [open, toggle] = useToggle();
  const { mutate, isLoading } = useUpdateCustomer();
  const form = useForm<z.infer<typeof customerValidation>>({
    resolver: zodResolver(customerValidation),
    defaultValues: {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email,
      addresses: customer.addresses,
    },
  });

  const addresses = useFieldArray({
    name: "addresses",
    control: form.control,
  });

  const onSubmit = (values: z.infer<typeof customerValidation>) => {
    console.log(values);
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "Updated successfully",
        });
        form.reset();
      },
      onError: (error: any) => {
        console.log("error", error);
        toast({
          variant: "error",
          title: error?.response?.data?.message || "Something went wrong",
        });
      },
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
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
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    className="w-full border-dashed !mt-2 !mb-4"
                    variant="link"
                    type="button"
                    onClick={() => addresses.remove(i)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                className="w-full"
                variant="secondary"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  addresses.append({
                    id: -1,
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
                  <Loader2 className="w-5 h-5 animate-spin" />
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

export default UserSheet;
