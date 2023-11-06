"use client";
import React from "react";
import Numeral from "numeral";
import { useToggle } from "@uidotdev/usehooks";
import { useWatch, useFormContext } from "react-hook-form";
import { useCreateSale } from "@/hooks/useSale";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@/hooks/useAuth";
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
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import EmployeeTab from "./EmployeeTab";
import CustomerTab from "./CustomerTab";

const tabs = ["employee", "customer", "payment", "completed"];

const ProceedDialog = ({ disabled }: { disabled: boolean }) => {
  const form = useFormContext();
  const session = useSession();

  const { isLoading, mutate } = useCreateSale();
  const { toast } = useToast();
  const [open, toggle] = useToggle(false);
  const [active, setActive] = React.useState("employee");

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
    } else {
      toggle();
    }
  };

  /**
   * hanlde form submit
   * @param values
   */
  const onSubmit = (values: any) => {
    const locationId = session?.data?.data?.data.locationId;

    values.title = "GN1234";
    values.locationId = locationId;
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
        locationId,
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
      ?.filter((transaction: any) => parseFloat(transaction.amount) > 0)
      .map((txn: any) => {
        return {
          locationId,
          name: txn.name,
          kind: "sale",
          status: "success",
          amount: Math.round(txn.amount * 100) / 100,
          createdAt: values.createdAt,
        };
      });

    // payment status
    if (values.totalDue <= 0) {
      values.status = "paid";
    } else if (values.totalDue > 0 && values.totalDue < values.total) {
      values.status = "partialy_paid";
    }

    // call react query mutation
    mutate(values, {
      onSuccess: () => {
        toast({
          variant: "success",
          title: "Sale created successfully!",
        });
        form.reset();
        toggle();
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: error.response.data.message || "Something went wrong",
        });
      },
    });
  };

  /**
   * handle next step disabled/enabled
   */
  const isDisabled =
    (active === tabs[0] && !form.watch("employeeId")) ||
    (active === tabs[1] && !form.watch("customerId"));

  /** button text */
  const buttonText = isLoading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    {
      payment: "Create",
      complete: "Done",
    }[active] || "Next"
  );

  /** header icon */
  const headerIcon = (
    <span className="pr-3 cursor-pointer" onClick={handlePrev}>
      <ArrowLeft className="w-5 h-5" />
    </span>
  );

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

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          disabled={disabled}
          onClick={() => {
            setActive("employee");
            updateDue();
            toggle();
          }}
        >
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Tabs value={active} onValueChange={setActive}>
          <EmployeeTab headerIcon={headerIcon} />

          <CustomerTab headerIcon={headerIcon} />

          {/* payment and create sale tab */}
          <TabsContent value="payment" className="mt-0">
            {isLoading && (
              <div className="absolute rounded-md inset-0 z-20"></div>
            )}
            <DialogHeader className="text-left pb-6">
              <div className="flex item-center mb-3">
                {headerIcon}
                <DialogTitle>Collect Payment</DialogTitle>
              </div>

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
                {form.getValues("transactions").map((item: any, i: number) => (
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
                              <Input className="bg-accent" {...field} />
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

          {/* sale created tab */}
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
              <Button
                className="flex-1"
                type="button"
                onClick={handleNext}
                disabled={isDisabled}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
