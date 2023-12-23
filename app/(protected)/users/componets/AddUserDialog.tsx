"use client";
import * as z from "zod";
import React from "react";
import { CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
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
import { Plus, Loader2 } from "lucide-react";
import { userInviteValidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";

import { useAuthContext } from "@/hooks/useAuthContext";

const AddUserDialog = ({ className }: { className?: string }) => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const form = useForm<z.infer<typeof userInviteValidation>>({
    resolver: zodResolver(userInviteValidation),
    defaultValues: {
      role: "admin",
      email: "",
    },
  });
  const { toast } = useToast();

  const { locations } = useAuthContext();

  const onSubmit = (values: z.infer<typeof userInviteValidation>) => {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent>
        <div className="relative">
          <CardHeader className="p-0 mb-6 space-y-0">
            <CardTitle className="text-lg">Invite User</CardTitle>
            <CardDescription>
              Enter the user's email you would like to invite.
            </CardDescription>
          </CardHeader>
          {/*  loading */}
          {loading && (
            <div className="absolute w-full h-full top-0 left-0 z-20"></div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pb-2 relative"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@domain.com" {...field} />
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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

              <Button type="submit" className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Invite"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
