"use client";
import React from "react";
import { mutate } from "swr";

import Numeral from "numeral";
import { createSale } from "@/actions/sale-actions";

import { ArrowLeft, Loader2 } from "lucide-react";

import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

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
import { Badge } from "@/components/ui/badge";

const PaymentTab = ({
  setActive,
  updateDue,
}: {
  setActive: (tab: string) => void;
  updateDue: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);

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
              <div className="font-medium text-xs uppercase">
                {form.watch("total") < 0 ? "refund" : "due"}
              </div>
              <div className="font-medium text-lg">
                {Numeral(Math.abs(form.watch("totalDue"))).format()}
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scrollbox">
          <Accordion type="single" className="w-full space-y-2">
            {transactions?.map((item: any, i: number) => (
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

                          <span className="ml-auto text-muted-foreground">
                            {Numeral(
                              form.watch(`transactions.${i}.amount`)
                            ).format()}
                          </span>
                        </FormLabel>
                      </AccordionTrigger>
                      <FormControl>
                        <AccordionContent className="overflow-visible">
                          <Input className="bg-accent" {...field} />
                        </AccordionContent>
                      </FormControl>
                      <FormMessage className="mb-2 -mt-1" />
                    </AccordionItem>
                  </FormItem>
                )}
              />
            ))}
          </Accordion>
        </div>

        {/* store credit */}
        {/* <div className="rounded-md border flex p-2 items-center">
          <div className="space-y-0.5">
            <div className="font-medium">Store Credit</div>
            <div>
              <span className="text-muted-foreground">Available Balance -</span>
              <span className="font-medium"> 1290</span>
            </div>
          </div>
          <div className="ml-auto">
            <Badge className="rounded-md cursor-pointer">Apply</Badge>
          </div>
        </div> */}

        <Button className="w-full mt-8" type="submit" onClick={handleNext}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
        </Button>
      </div>
    </TabsContent>
  );
};

export default PaymentTab;
