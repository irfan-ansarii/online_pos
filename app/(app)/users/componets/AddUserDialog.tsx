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
import { Plus, User, UserCog, Loader2 } from "lucide-react";
import { userInviteValidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { useInviteUser } from "@/hooks/useUser";
const AddUserDialog = ({ className }: { className?: string }) => {
  const form = useForm<z.infer<typeof userInviteValidation>>({
    resolver: zodResolver(userInviteValidation),
    defaultValues: {
      role: "",
      email: "",
    },
  });

  const { mutate, isLoading } = useInviteUser();

  const onSubmit = (values: z.infer<typeof userInviteValidation>) => {
    console.log(values);
    mutate(values, {
      onSuccess: (res) => {
        toast.success(res.data.message);
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  };

  return (
    <Dialog>
      <Toaster richColors />
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
              Please enter the user's email you would like to invite.
            </CardDescription>
          </CardHeader>
          {/*  loading */}
          {isLoading && (
            <div className="absolute w-full h-full top-0 left-0 z-20"></div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pb-2 relative"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="admin"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel className="flex text-foreground gap-2 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <UserCog className="w-5 h-5" />
                            Admin
                          </FormLabel>
                        </FormItem>
                        <FormItem>
                          <FormControl>
                            <RadioGroupItem
                              value="user"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel className="flex gap-2 text-foreground cursor-pointer flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <User className="w-5 h-5" />
                            User
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="!mt-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl
                      className={
                        form.formState.errors?.email
                          ? "!ring-destructive/50 border-destructive"
                          : ""
                      }
                    >
                      <Input placeholder="email@domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isLoading ? (
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
