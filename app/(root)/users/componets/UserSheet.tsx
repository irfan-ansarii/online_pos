"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserValidation } from "@/lib/validations/user";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useUpdateUser } from "@/hooks/useUser";
import {
  Sheet,
  SheetContent,
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

const UserSheet = ({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) => {
  const { locations } = useAuthContext();
  const [open, toggle] = useToggle();
  const { mutate, isLoading } = useUpdateUser();
  const form = useForm<z.infer<typeof updateUserValidation>>({
    resolver: zodResolver(updateUserValidation),
    defaultValues: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
      locationId: user?.locationId?.toString(),
    },
  });

  const onSubmit = (values: z.infer<typeof updateUserValidation>) => {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: "Updated successfully",
        });
        form.reset();
        toggle();
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: error?.response?.data?.message || "Something went wrong",
        });
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full relative"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-transparent z-20"></div>
            )}
            <SheetHeader className="md:pb-2">
              <SheetTitle>Edit user</SheetTitle>
            </SheetHeader>
            <div className="space-y-6  flex-1 overflow-auto snap-y snap-mandatory -mx-6 px-6 scrollbox mb-4">
              <div className="flex [&>div]:flex-1 gap-4">
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
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="9876543210" disabled />
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
                      <Input
                        placeholder="email@domain.com"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                            <RadioGroupItem value="admin" />
                          </FormControl>
                          <FormLabel className="flex font-normal p-3 border rounded-md cursor-pointer">
                            Admin
                          </FormLabel>
                        </FormItem>

                        <FormItem className="relative space-y-0">
                          <FormControl className="absolute right-3 top-1/2 -translate-y-1/2">
                            <RadioGroupItem value="user" />
                          </FormControl>
                          <FormLabel className="flex font-normal p-3 border rounded-md cursor-pointer">
                            User
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={`active`}>Active</SelectItem>
                        <SelectItem value={`blocked`}>Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations?.map((location: any) => (
                          <SelectItem value={`${location.id}`}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              {isLoading ? <Loader2 className="w-5 h-5" /> : "Save"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
