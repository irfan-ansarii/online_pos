"use client";
import * as z from "zod";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { validation } from "@/lib/validations/workspace";

const CreateWorkspace = ({ trigger }: { trigger?: React.ReactNode }) => {
  const [open, setOpen] = React.useState<boolean>(false);

  const { mutate, isLoading } = {};

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: { name: string; description: string }) => {
    mutate(values, {
      onSuccess: () => {
        console.log("success");
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader className="text-left pb-4">
          <DialogTitle className="text-xl">Create a new workspace</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col justify-start gap-8 relative"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {isLoading && (
              <div className="absolute w-full h-full transparent z-20"></div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Name</FormLabel>
                  <div className="relative">
                    <FormControl
                      placeholder="Workspace name"
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
              name="description"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col">
                  <FormLabel>Description</FormLabel>
                  <div className="relative">
                    <FormControl
                      placeholder="Type here..."
                      className={
                        form.formState.errors?.name
                          ? "!ring-destructive/50 border-destructive"
                          : ""
                      }
                    >
                      <Textarea {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Workspace"
              )}
            </Button>
          </form>
        </Form>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
