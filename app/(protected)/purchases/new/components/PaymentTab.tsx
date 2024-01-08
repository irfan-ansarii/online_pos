"use client";
import React from "react";
import { mutate } from "swr";

import Numeral from "numeral";
import { createPurchase } from "@/actions/purchase-actions";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useSheetToggle } from "@/hooks/useSheet";

import { TabsContent } from "@/components/ui/tabs";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PaymentTab = ({
  setActive,
  updateDue,
}: {
  setActive: (tab: string) => void;
  updateDue: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [_, toggle] = useSheetToggle("new");
  const form = useFormContext();

  // listen to transactions changes
  const transactions = useWatch({
    control: form.control,
    name: "transactions",
  });

  // handle form submit
  const handleNext = () => {
    form.handleSubmit(onSubmit, (e) =>
      toast({
        variant: "error",
        title: JSON.stringify(e),
      })
    )();
  };

  // update due amount
  React.useEffect(() => {
    updateDue();
  }, [transactions, form.watch("lineItems")]);

  /**
   * hanlde form submit
   * @param values
   */
  const onSubmit = async (values: any) => {
    values.roundedOff = Math.ceil(values.total) - values.total;
    values.total = Math.ceil(values.total);

    // transactions
    values.transactions = values.transactions
      ?.filter((transaction: any) => Number(transaction.amount) !== 0)
      .map((txn: any) => {
        return {
          ...txn,
          createdAt: values.createdAt,
        };
      });

    try {
      setLoading(true);
      await createPurchase(values);
      toast({
        variant: "success",
        title: "Purchase created successfully",
      });

      form.reset();
      toggle();
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
    <TabsContent value="payment" className="mt-0 ">
      <div className="flex flex-col h-[32rem]">
        <DialogHeader className="text-left pb-6">
          <div className="flex item-center mb-3">
            <span
              className="pr-3 cursor-pointer"
              onClick={() => setActive("receipt")}
            >
              <ArrowLeft className="w-5 h-5" />
            </span>
            <DialogTitle>Payment</DialogTitle>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="border p-3 space-y-1 rounded-md text-center">
              <div className="font-medium text-xs uppercase">TOTAL</div>
              <div className="font-medium text-lg">
                {Numeral(form.watch("total")).format()}
              </div>
            </div>
            <div className={`border p-3 space-y-1 rounded-md text-center`}>
              <div className="font-medium text-xs uppercase">{"due"}</div>
              <div className="font-medium text-lg">
                {Numeral(form.watch("totalDue")).format()}
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scrollbox">
          <Accordion
            type="single"
            className="w-full space-y-2"
            onValueChange={(v) => console.log(v)}
          >
            {transactions?.map((item: any, i: number) => (
              <AccordionItem
                value={`${item.id}`}
                className="px-3 rounded-md border hover:bg-accent transition duration-300 data-[state=open]:bg-accent"
              >
                <AccordionTrigger>
                  <FormLabel className="flex w-full cursor-pointer">
                    {item.label}

                    <span className="ml-auto text-muted-foreground">
                      {Numeral(form.watch(`transactions.${i}.amount`)).format()}
                    </span>
                  </FormLabel>
                </AccordionTrigger>
                <AccordionContent className="overflow-visible">
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`transactions.${i}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input className="bg-accent" {...field} />
                          </FormControl>
                          <FormMessage className="mb-2 -mt-1" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`transactions.${i}.refrenceNumber`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="bg-accent"
                              {...field}
                              placeholder="Refrence number"
                            />
                          </FormControl>
                          <FormMessage className="mb-2 -mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <Button className="w-full mt-8" type="submit" onClick={handleNext}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
        </Button>
      </div>
    </TabsContent>
  );
};

export default PaymentTab;
