"use client";
import React from "react";
import * as z from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseValidation } from "@/lib/validations/expense";

import { createExpense, updateExpense } from "@/actions/expense-actions";
import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogTrigger,
  DialogHeader,
  DialogContent,
  DialogCancel,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const expenseCategories = [
  "Maintenance",
  "Marketing",
  "Packaging",
  "Salaries",
  "Shipping",
  "Utilities",
  "Other",
];

const ExpenseDialog = ({
  children,
  defaultValues,
}: {
  children: React.ReactNode;
  defaultValues?: z.infer<typeof expenseValidation>;
}) => {
  const [open, toggle] = useToggle();
  const [loading, toggleLoading] = useToggle();
  const router = useRouter();

  const form = useForm<z.infer<typeof expenseValidation>>({
    resolver: zodResolver(expenseValidation),
    defaultValues: defaultValues
      ? defaultValues
      : {
          id: null,
          name: "",
          category: "",
          notes: "",
          amount: 0,
          createdAt: new Date().toISOString(),
        },
  });

  const id = defaultValues?.id;

  const onSubmit = async (values: z.infer<typeof expenseValidation>) => {
    toggleLoading();

    try {
      if (id) {
        await updateExpense(values);
      } else {
        await createExpense(values);
      }
      toast({
        variant: "success",
        title: `${id ? "Updated" : "Created"} successfully`,
      });
      router.refresh();
      form.reset();
      toggle();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong!",
      });
    } finally {
      toggleLoading();
    }
  };

  React.useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValues]);

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>{id ? "Update" : "Create"} Expense</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-4 h-full"
            onSubmit={form.handleSubmit(onSubmit, (error) =>
              console.log(error)
            )}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map((item) => (
                          <SelectItem value={item} key={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="createdAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {format(new Date(field.value), "dd MMM, yyyy")}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2 flex-col md:flex-row">
              <Button type="submit" className="md:order-2 md:w-28">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <DialogCancel>Cancel</DialogCancel>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseDialog;
