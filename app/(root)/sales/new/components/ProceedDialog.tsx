"use client";
import React from "react";
import Numeral from "numeral";
import { useToggle } from "@uidotdev/usehooks";
import { useWatch, useFormContext } from "react-hook-form";
import SimpleBar from "simplebar-react";
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
import { Check } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import EmployeeTab from "./EmployeeTab";
import CustomerTab from "./CustomerTab";

const tabs = ["employee", "customer", "payment", "completed"];

const ProceedDialog = ({ disabled }: { disabled: boolean }) => {
  const form = useFormContext();
  const [open, toggle] = useToggle(false);
  const [active, setActive] = React.useState("employee");
  const isFirst = active === "employee";
  const isLast = active === "completed";

  // listen to transactions changes
  const transactions = useWatch({
    control: form.control,
    name: "transactions",
  });

  /**
   * handle next step click
   */
  const handleNext = () => {
    if (active === "employee") {
      setActive("customer");
    } else if (active === "customer") {
      setActive("payment");
    } else if (active === "payment") {
      form.handleSubmit(onSubmit, (e) => console.log("error:", e))();
    } else {
      toggle();
    }
  };

  /**
   * handle prev step click
   */
  const handlePrev = () => {
    const index = tabs.indexOf(active);
    if (index > 0) {
      setActive(tabs[index - 1]);
    }
  };

  /**
   * handle next step disabled/enabled
   */
  const isDisabled = () => {
    if (active === tabs[0] && !form.watch("employeeId")) {
      return true;
    }
    if (active === tabs[1] && !form.watch("customerId")) {
      return true;
    }
    return false;
  };

  /**
   * update due amount
   */
  const updateDue = () => {
    const total = form.getValues("total");
    const received = transactions.reduce((acc: any, curr: any) => {
      acc += parseFloat(curr.amount || 0);
      return acc;
    }, 0);
    form.setValue("totalDue", total - received);
  };

  /**
   * update due amount useEffect
   */
  React.useEffect(() => {
    updateDue();
  }, [transactions, form.watch("lineItems")]);

  /**
   * hanlde form submit
   * @param values
   */
  const onSubmit = (values: any) => {
    // tax lines
    values.taxLines = values.taxAllocations.map((tax: string) => {
      return {
        title: tax,
        amount: values.totalTax / values.taxAllocations.length,
      };
    });

    // transactions
    values.transactions = values.transactions
      .filter((transaction: any) => parseFloat(transaction.amount) > 0)
      .map((transaction: any) => {
        return {
          name: transaction.name,
          kind: "sale",
          amount: parseFloat(transaction.amount),
          status: "success",
        };
      });

    // payment status
    values.status = "pending";
    if (values.totalDue === values.total) {
      values.status = "paid";
    } else if (values.totalDue > 0 && values.totalDue < values.total) {
      values.status = "partialy_paid";
    }
    // call react query mutation
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={disabled}
          onClick={() => {
            toggle();
            updateDue();
          }}
        >
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md md:top-[10%]">
        <Tabs value={active} onValueChange={setActive}>
          <EmployeeTab />

          <CustomerTab />

          <TabsContent value="payment" className="mt-0">
            <DialogHeader className="text-left pb-6">
              <DialogTitle className="mb-3">Collect Payment</DialogTitle>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-border p-3 space-y-1 rounded-md text-center">
                  <div className="font-medium text-xs uppercase">TOTAL</div>
                  <div className="font-medium text-lg">
                    {Numeral(form.watch("total")).format()}
                  </div>
                </div>
                <div className="bg-border p-3 space-y-1 rounded-md text-center">
                  <div className="font-medium text-xs uppercase">DUE</div>
                  <div className="font-medium text-lg">
                    {Numeral(form.watch("totalDue")).format()}
                  </div>
                </div>
              </div>
            </DialogHeader>
            <SimpleBar className="h-72">
              <Accordion type="single" className="w-full space-y-2">
                {form.watch("transactions").map((item: any, i: number) => (
                  <FormField
                    key={`${item.name}${i}`}
                    control={form.control}
                    name={`transactions.${i}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <AccordionItem
                          value={`${item.name}${i}`}
                          className="px-3 rounded-md border hover:bg-accent transition duration-300 data-[state=open]:bg-accent"
                        >
                          <AccordionTrigger>
                            <FormLabel className="flex w-full cursor-pointer">
                              {item.label}

                              {parseFloat(
                                form.watch(`transactions.${i}.amount`) || 0
                              ) > 0 && (
                                <span className="ml-auto text-muted-foreground">
                                  {Numeral(
                                    form.watch(`transactions.${i}.amount`)
                                  ).format()}
                                </span>
                              )}
                            </FormLabel>
                          </AccordionTrigger>
                          <FormControl>
                            <AccordionContent className="overflow-visible">
                              <Input
                                placeholder="shadcn"
                                className="bg-accent"
                                {...field}
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
            </SimpleBar>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Sale created successfully!</DialogTitle>
              <DialogDescription>
                Select the option bellow send or print invoice
              </DialogDescription>
            </DialogHeader>
            <SimpleBar className="h-80">
              <RadioGroup defaultValue="card" className="flex flex-col">
                {["Email", "Text", "What's App", "Print"].map((el) => (
                  <div key={el} className="relative">
                    <RadioGroupItem
                      value={el}
                      id={el}
                      className="peer sr-only"
                    />
                    <div className="absolute w-5 h-5 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                      <Check className="w-3 h-3" />
                    </div>
                    <Label htmlFor={el} className="block py-3 cursor-pointer">
                      <div className="truncate w-full text-left mb-1">{el}</div>

                      <div className="text-muted-foreground font-normal text-xs">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit.
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </SimpleBar>
          </TabsContent>
          <div className="space-y-3 mt-3">
            {/* indicator */}
            <div className="flex gap-1 justify-center">
              {tabs.map((el) => (
                <div
                  key={el}
                  className={`py-0 block h-2 rounded-full ${
                    active === el ? "bg-primary w-10" : "bg-secondary w-6"
                  }`}
                />
              ))}
            </div>

            {/* handle step */}
            <div className="flex gap-4">
              {!isFirst && !isLast && (
                <Button className="flex-1" type="button" onClick={handlePrev}>
                  Prev
                </Button>
              )}

              <Button
                className="flex-1"
                type="button"
                onClick={handleNext}
                disabled={isDisabled()}
              >
                {isLast ? "Done" : "Next"}
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
