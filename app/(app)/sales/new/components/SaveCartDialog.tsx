import React from "react";
import { BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SaveCartDialog = () => {
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
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-full">
              <BookmarkPlus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Save cart</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader className="p-0 mb-6 space-y-0">
          <DialogTitle className="text-lg">Save Cart</DialogTitle>
          <DialogDescription>
            Click on the button bellow to select.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Example" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCartDialog;
