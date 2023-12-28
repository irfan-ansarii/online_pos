"use client";
import React, { lazy, Suspense } from "react";
import { mutate } from "swr";
import Numeral from "numeral";

import { useToggle } from "@uidotdev/usehooks";
import { useWatch, useFormContext, useFieldArray } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { usePayments } from "@/hooks/usePayments";

const EmployeeTab = lazy(() => import("./EmployeeTab"));
const CustomerTab = lazy(() => import("./CustomerTab"));

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Check,
  Loader2,
  Mail,
  MessageCircle,
  Printer,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { createSale } from "@/actions/sale-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const tabs = ["employee", "customer", "payment", "completed"];

const invoiceOptions = [
  {
    key: 1,
    name: "Email",
    icon: <Mail className="w-4 h-4" />,
  },
  {
    key: 2,
    name: "Whats App",
    icon: <MessageCircle className="w-4 h-4" />,
  },
  { key: 3, name: "Print", icon: <Printer className="w-4 h-4" /> },
];

const ProceedDialog = ({ disabled }: { disabled: boolean }) => {
  const form = useFormContext();
  const [loading, setLoading] = React.useState(false);
  const { payments } = usePayments();
  const [open, toggle] = useToggle(false);
  const [active, setActive] = React.useState("employee");

  // listen to transactions changes
  const transactions = useWatch({
    control: form.control,
    name: "transactions",
  });

  /**
   * update due amount
   */
  const updateDue = () => {
    const total = form.getValues("total");
    const received = transactions?.reduce((acc: any, curr: any) => {
      acc += parseFloat(curr.amount || 0);
      return acc;
    }, 0);
    form.setValue("totalDue", total - received);
  };

  React.useEffect(() => {
    updateDue();
  }, [transactions, form.watch("lineItems")]);

  // handle form submit
  const handleNext = () => {
    form.handleSubmit(onSubmit, (e) => console.log("error:", e))();
  };
  /**
   * hanlde form submit
   * @param values
   */
  const onSubmit = async (values: any) => {
    values.createdAt = new Date(values.createdAt);
    values.roundedOff = Math.ceil(values.total) - values.total;
    values.total = Math.ceil(values.total);

    // line item total
    values.lineItemsTotal = values.lineItems.reduce((acc: any, curr: any) => {
      return (acc += curr.total);
    }, 0);

    // line items tax
    values.lineItems = values.lineItems.map((item: any) => {
      return {
        ...item,
        createdAt: values.createdAt,
        taxLines: values.taxAllocations.map((tax: any) => {
          return {
            name: tax,
            amount:
              Math.round((item.totalTax / values.taxAllocations.length) * 100) /
              100,
          };
        }),
      };
    });

    // tax lines
    values.taxLines = values.taxAllocations.map((tax: string) => {
      return {
        title: tax,
        amount:
          Math.round((values.totalTax / values.taxAllocations.length) * 100) /
          100,
      };
    });

    // transactions
    values.transactions = values.transactions
      ?.filter((transaction: any) => Number(transaction.amount) > 0)
      .map((txn: any) => {
        return {
          ...txn,
          createdAt: values.createdAt,
        };
      });

    // payment status
    if (values.totalDue <= 0) {
      values.status = "paid";
    } else if (values.totalDue > 0 && values.totalDue < values.total) {
      values.status = "partialy_paid";
    }

    try {
      setLoading(true);
      await createSale(values);
      toast({
        variant: "success",
        title: "Sale created successfully",
      });

      form.reset();
      setActive("completed");
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
      await mutate("/inventory?search=");
    }
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={disabled}
          onClick={() => {
            setActive("employee");
            updateDue();
          }}
        >
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="focus-visible:ring-transparent">
        {loading && (
          <div className="absolute rounded-md inset-0 z-20 bg-accent/10 flex flex-col justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        <Tabs value={active} onValueChange={setActive}>
          {/* dialog loading  */}
          <Suspense
            fallback={
              <div className="flex flex-col h-[32rem] bg-background relative z-50 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }
          >
            <EmployeeTab setActive={setActive} />
            <CustomerTab setActive={setActive} />
          </Suspense>

          <TabsContent value="payment" className="mt-0 ">
            <div className="flex flex-col h-[32rem]">
              <DialogHeader className="text-left pb-6">
                <div className="flex item-center mb-3">
                  <span
                    className="pr-3 cursor-pointer"
                    onClick={() => setActive("customer")}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </span>
                  <DialogTitle>Collect Payment</DialogTitle>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="border p-3 space-y-1 rounded-md text-center">
                    <div className="font-medium text-xs uppercase">TOTAL</div>
                    <div className="font-medium text-lg">
                      {Numeral(form.watch("total")).format()}
                    </div>
                  </div>
                  <div
                    className={`border p-3 space-y-1 rounded-md text-center ${
                      form.watch("totalDue") < 0 ? "border-destructive" : ""
                    } `}
                  >
                    <div className="font-medium text-xs uppercase">due</div>
                    <div className="font-medium text-lg">
                      {Numeral(form.watch("totalDue")).format()}
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto scrollbox">
                <Accordion type="single" className="w-full space-y-2">
                  {payments?.data?.map((item: any, i: number) => (
                    <FormField
                      key={`${item.id}`}
                      control={form.control}
                      name={`transactions.${i}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            {...form.register(`transactions.${i}.name`)}
                            className="hidden"
                            defaultValue={item.name}
                          />
                          <Input
                            {...form.register(`transactions.${i}.label`)}
                            className="hidden"
                            defaultValue={item.label}
                          />
                          <AccordionItem
                            value={`${item.id}`}
                            className="px-3 rounded-md border hover:bg-accent transition duration-300 data-[state=open]:bg-accent"
                          >
                            <AccordionTrigger>
                              <FormLabel className="flex w-full cursor-pointer">
                                {item.label}

                                <span className="ml-auto text-muted-foreground">
                                  {Numeral(
                                    form.watch(`transactions.${i}.amount`)
                                  ).format()}
                                </span>
                              </FormLabel>
                            </AccordionTrigger>
                            <FormControl>
                              <AccordionContent className="overflow-visible">
                                <Input
                                  className="bg-accent"
                                  {...field}
                                  defaultValue="0"
                                />
                              </AccordionContent>
                            </FormControl>
                            <FormMessage />
                          </AccordionItem>
                        </FormItem>
                      )}
                    />
                  ))}
                </Accordion>
              </div>
              <Button
                className="w-full mt-8"
                type="submit"
                onClick={handleNext}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create Sale"
                )}
              </Button>
            </div>
          </TabsContent>

          {/* sale created tab */}
          <TabsContent
            value="completed"
            className="mt-0 focus-visible:ring-transparent"
          >
            <div className="flex flex-col h-[32rem]">
              <DialogHeader className="text-left pb-6">
                <DialogTitle>Sale created</DialogTitle>
                <DialogDescription>
                  Select the option bellow to send or print invoice
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto scrollbox">
                <RadioGroup defaultValue="card" className="flex flex-col">
                  {invoiceOptions.map((el) => (
                    <div key={el.key} className="relative">
                      <RadioGroupItem
                        value={el.name}
                        id={`${el.key}`}
                        className="peer sr-only"
                      />
                      <div className="absolute w-5 h-5 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                        <Check className="w-3 h-3" />
                      </div>
                      <Label
                        htmlFor={`${el.key}`}
                        className="flex gap-3 px-3 py-2 rounded-md border items-center cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent"
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{el.icon}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="truncate w-full text-left mb-1">
                            {el.name}
                          </div>
                          <div className="text-muted-foreground font-normal text-xs">
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit.
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button className="w-full mt-10" type="button">
                Send Invoice
              </Button>
            </div>
          </TabsContent>

          {/* indicator */}
          <div className="flex gap-1 justify-center absolute bottom-20 inset-x-0">
            {tabs.map((el) => (
              <div
                key={el}
                className={`py-0 block h-2 rounded-full ${
                  active === el ? "bg-primary w-10" : "bg-secondary w-6"
                }`}
              />
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
