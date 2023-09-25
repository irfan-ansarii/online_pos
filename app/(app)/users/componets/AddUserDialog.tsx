"use client";
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
import { Plus } from "lucide-react";
const AddUserDialog = () => {
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (v: any) => {
    console.log(v);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
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
              Please enter the user's information you would like to invite.
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 pb-2"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Example" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Invite
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
