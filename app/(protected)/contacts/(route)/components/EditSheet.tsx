"use client";
import React from "react";
import * as z from "zod";
// @ts-expect-error
import query from "india-pincode-search";

import { updateContact } from "@/actions/contact-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactValidation } from "@/lib/validations/contact";

import { Loader2, PenSquare, PlusCircle } from "lucide-react";

import { useToggle } from "@uidotdev/usehooks";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

const contactSheet = ({ contact }: { contact: any }) => {
  const [open, toggle] = useToggle(false);
  const [loading, toggleLoading] = useToggle(false);

  const form = useForm<z.infer<typeof contactValidation>>({
    resolver: zodResolver(contactValidation),
    defaultValues: {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone || "",
      email: contact.email || "",
      role: contact.role || "",
      status: contact.status || "",
      addresses: contact.addresses,
    },
  });

  const addresses = useFieldArray({
    name: "addresses",
    control: form.control,
  });

  const onSubmit = async (values: z.infer<typeof contactValidation>) => {
    try {
      toggleLoading();
      await updateContact(values);
      toast({
        variant: "success",
        title: "Updated successfully",
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      toggleLoading();
    }
  };

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="">
          <PenSquare className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full  relative"
          >
            {loading && (
              <div className="absolute inset-0 bg-transparent z-20"></div>
            )}

            <SheetHeader>
              <SheetTitle className="text-lg">Edit Contact</SheetTitle>
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

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <FormItem className="relative space-y-0">
                              <FormControl className="absolute right-3 top-1/2 -translate-y-1/2">
                                <RadioGroupItem value="customer" />
                              </FormControl>
                              <FormLabel className="flex font-normal p-3 border rounded-md cursor-pointer">
                                Customer
                              </FormLabel>
                            </FormItem>

                            <FormItem className="relative space-y-0">
                              <FormControl className="absolute right-3 top-1/2 -translate-y-1/2">
                                <RadioGroupItem value="supplier" />
                              </FormControl>
                              <FormLabel className="flex font-normal p-3 border rounded-md cursor-pointer">
                                Supplier
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
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
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="blocked">Inactive</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {addresses.fields.map((field, i) => (
                <div key={field.id} className="space-y-4 border-b !mb-4">
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
                  <FormField
                    control={form.control}
                    name={`addresses.${i}.gstin`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GSTIN</FormLabel>
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
                          <FormLabel>PIN Code</FormLabel>
                          <FormControl
                            onChange={(e) => {
                              field.onChange(e);

                              // @ts-ignore
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
                    company: "",
                    gstin: "",
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
                {loading ? (
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

export default contactSheet;
