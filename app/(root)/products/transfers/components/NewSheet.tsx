"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferValidation } from "@/lib/validations/product";
import { useForm } from "react-hook-form";
import { useToggle } from "@uidotdev/usehooks";
import { useToast } from "@/components/ui/use-toast";
import { useCreateProduct } from "@/hooks/useProduct";

import { Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import {
  Sheet,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
  SheetContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AutoComplete } from "@/components/shared/autocomplete";

const NewSheet = ({ children }: { children: React.ReactNode }) => {
  const { mutate, isLoading } = useCreateProduct();
  const { toast } = useToast();
  const [open, toggle] = useToggle();

  const form = useForm<z.infer<typeof transferValidation>>({
    resolver: zodResolver(transferValidation),
    defaultValues: {
      fromId: 0,
      toId: 0,
      items: [],
      status: "pending",
      totalItems: 0,
      totalAmount: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof transferValidation>) => {
    // mutate(values, {
    //   onSuccess: (res) => {
    //     toast({
    //       variant: "success",
    //       title: "Product created successfully!",
    //     });
    //     form.reset();
    //     setPreview("");
    //     toggle();
    //   },
    //   onError: (error: any) => {
    //     toast({
    //       variant: "error",
    //       title: error.response.data.message || "Something went wrong",
    //     });
    //   },
    // });
  };

  return (
    <Sheet open={open} onOpenChange={toggle}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="md:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}
            className="flex flex-col h-full"
          >
            <SheetHeader className="md:pb-2">
              <SheetTitle>New Transfer</SheetTitle>
            </SheetHeader>

            <div className="pb-4 space-y-4">
              <FormField
                control={form.control}
                name="toId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Branch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="m@example.com">
                          m@example.com
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <AutoComplete onSelect={(v) => console.log(v)} />
              </div>
            </div>

            <SimpleBar className="-mx-6 px-6 relative  grow max-h-full overflow-y-auto">
              <div className="space-y-2">
                {form.watch("items").map(() => (
                  <div className="flex rounded-md border p-2 items-center">
                    <div className="flex gap-3 items-center col-span-2">
                      <Avatar className="w-10 h-10 border-2">
                        <AvatarFallback className="rounded-none  md:rounded-l-md object-cover text-muted-foreground">
                          <ImageIcon className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5 truncate">
                        <div className="font-semibold truncate">
                          Lorem, ipsum dolor.
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Lorem ipsum dolor sit amet.
                        </div>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div>10</div>
                      <Button size="icon" variant="secondary" className="">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </SimpleBar>

            <SheetFooter className="pt-2 flex-col">
              <div className="flex">
                <div>Items</div>
                <div className="ml-auto">4</div>
              </div>

              <Button className="w-full" type="submit">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
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

export default NewSheet;
