"use client";
import React from "react";
import Numeral from "numeral";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useToggle } from "@uidotdev/usehooks";
import { useFormContext, useWatch } from "react-hook-form";
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

  const [open, setOpen] = useToggle(false);
  const [active, setActive] = React.useState("employee");

  const transactions = useWatch({
    control: form.control,
    name: "transactions",
  });
  const handleNext = () => {
    const current = tabs.findIndex((tab) => tab === active);

    if (current < tabs.length - 1) {
      setActive(tabs[current + 1]);
    } else {
      setOpen();
      setActive(tabs[0]);
    }
  };

  const handlePrev = () => {
    const current = tabs.findIndex((tab) => tab === active);
    if (current > 0) {
      setActive(tabs[current - 1]);
    }
  };

  const isFirst = active === "employee";
  const isLast = active === "completed";

  const isDisabled = () => {
    if (active === tabs[0] && !form.watch("employeeId")) {
      return true;
    }
    if (active === tabs[1] && !form.watch("customerId")) {
      return true;
    }
    return false;
  };

  React.useEffect(() => {
    const total = form.getValues("total");
    const received = transactions.reduce((acc: any, curr: any) => {
      acc += parseFloat(curr.amount || 0);
      return acc;
    }, 0);
    form.setValue("totalDue", total - received);
  }, [transactions]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md md:top-[10%] min-h-[60vh]">
        <Tabs
          value={active}
          onValueChange={setActive}
          className="flex flex-col h-full justify-between"
        >
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
            <SimpleBar className="h-64">
              <Accordion type="single" className="w-full space-y-2">
                {form.watch("transactions").map((item: any, i: number) => (
                  <FormField
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
            <SimpleBar className="h-72">
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

          {/* indicator */}
          <div className="flex gap-1 mt-3 justify-center">
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
          <div className="flex gap-4 mt-3">
            {!isFirst && !isLast && (
              <Button className="flex-1" onClick={handlePrev}>
                Prev
              </Button>
            )}

            {active === "payment" ? (
              <Button className="flex-1" type="submit">
                Next
              </Button>
            ) : (
              <Button
                className="flex-1"
                disabled={isDisabled()}
                onClick={handleNext}
              >
                {isLast ? "Done" : "Next"}
              </Button>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
