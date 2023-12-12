import React from "react";
import { MapPin, Settings2, Pencil, Loader2 } from "lucide-react";
import Numeral from "numeral";
import query from "india-pincode-search";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserSheet = ({ customer }: { customer: any }) => {
  const { locations } = useAuthContext();
  const [open, toggle] = useToggle();

  const form = useForm({
    defaultValues: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email,
      role: customer.role,
      locationId: customer?.locationId?.toString(),
    },
  });
  const { toast } = useToast();
  console.log(customer);
  const onSubmit = (values: any) => {
    // mutate(values, {
    //   onSuccess: (res) => {
    //     toast({
    //       variant: "success",
    //       title: "User been invited successfully!",
    //     });
    //     setOpen(false);
    //   },
    //   onError: (error: any) => {
    //     toast({
    //       variant: "error",
    //       title: error.response.data.message,
    //     });
    //   },
    // });
  };

  return (
    <SheetContent className="md:max-w-lg">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full relative"
        >
          {/* {isLoading && (
              <div className="absolute inset-0 bg-transparent z-20"></div>
            )} */}
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
              Save
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
};

export default UserSheet;
