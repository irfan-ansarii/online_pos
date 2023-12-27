"use client";
import React, { lazy, Suspense } from "react";

import Numeral from "numeral";

import { useToggle } from "@uidotdev/usehooks";
import { useWatch, useFormContext } from "react-hook-form";
import { useSession } from "@/hooks/useSession";
import { usePayments } from "@/hooks/usePayments";
import { toast } from "@/components/ui/use-toast";

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
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const tabs = ["employee", "customer", "payment", "completed"];

const ProceedDialog = ({ disabled }: { disabled: boolean }) => {
  const form = useFormContext();
  const [loading, setLoading] = React.useState(false);
  const { session } = useSession();
  const { payments } = usePayments();
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
  const onSubmit = async (values: any) => {
    const locationId = session.location.id;

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
          label: txn.label,
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
    // mutate(values, {
    //   onSuccess: () => {
    //     toast({
    //       variant: "success",
    //       title: "Sale created successfully!",
    //     });
    //     form.reset();
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

  /**
   * handle next step disabled/enabled
   */
  const isDisabled =
    (active === tabs[0] && !form.watch("employeeId")) ||
    (active === tabs[1] && !form.watch("customerId"));

  /** button text */
  const buttonText = loading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    {
      payment: "Create Sale",
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
    const received = transactions?.reduce((acc: any, curr: any) => {
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
      <DialogContent className="focus-visible:ring-transparent">
        {loading && (
          <div className="absolute rounded-md inset-0 z-20 bg-accent/50"></div>
        )}

        <Tabs value={active} onValueChange={setActive}>
          <Suspense
            fallback={
              <div className="flex flex-col h-96 my-8 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }
          >
            <EmployeeTab headerIcon={headerIcon} />
            <CustomerTab headerIcon={headerIcon} />
          </Suspense>

          <TabsContent value="payment" className="mt-0">
            <DialogHeader className="text-left pb-6">
              <div className="flex item-center mb-3">
                {headerIcon}
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
            <div className="h-72">
              <Accordion type="single" className="w-full space-y-2">
                {payments?.data?.map((item: any, i: number) => (
                  <>
                    <Input
                      {...form.register(`transactions.${i}.name`)}
                      className="hidden"
                    />
                    <Input
                      {...form.register(`transactions.${i}.label`)}
                      className="hidden"
                    />

                    <FormField
                      key={`${item.id}`}
                      control={form.control}
                      name={`transactions.${i}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <AccordionItem
                            value={`${item.id}`}
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
                                  className="bg-accent"
                                  {...field}
                                  defaultValue={0}
                                />
                              </AccordionContent>
                            </FormControl>
                            <FormMessage />
                          </AccordionItem>
                        </FormItem>
                      )}
                    />
                  </>
                ))}
              </Accordion>
            </div>
          </TabsContent>

          {/* sale created tab */}
          <TabsContent value="completed" className="mt-0">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Sale created successfully!</DialogTitle>
              <DialogDescription>
                Select the option bellow send or print invoice
              </DialogDescription>
            </DialogHeader>
            <div className="h-80">
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
            </div>
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
