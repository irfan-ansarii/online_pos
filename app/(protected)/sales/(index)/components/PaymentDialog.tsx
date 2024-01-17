import * as z from "zod";
import React from "react";
import Numeral from "numeral";
import { Payment, Sale } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectPayementValidation } from "@/lib/validations/sale";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSheetToggle } from "@/hooks/useSheet";

import { Loader2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogCancel,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import { usePayments } from "@/hooks/usePayments";
import { Button } from "@/components/ui/button";
import { createTransactions } from "@/actions/sale-actions";

const PaymentDialog = ({
  sale,
  payments,
}: {
  sale: Sale;
  payments: Payment[];
}) => {
  const [open, toggle] = useSheetToggle("new");
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof collectPayementValidation>>({
    resolver: zodResolver(collectPayementValidation),
    mode: "onChange",
    defaultValues: {
      total: sale.totalDue,
      totalDue: sale.totalDue,
      saleId: sale.id,
      kind: sale.totalDue < 0 ? "refund" : "sale",
      transactions: payments.map((pay) => ({
        id: pay.id,
        name: pay.name,
        label: pay.label,
        amount: "0",
      })),
    },
  });

  const transactions = useWatch({
    name: "transactions",
    control: form.control,
  });
  const onSubmit = async (
    values: z.infer<typeof collectPayementValidation>
  ) => {
    const { saleId, transactions } = values;

    const transactionsData = transactions.filter(
      (txn) => !isNaN(parseFloat(txn.amount)) && parseFloat(txn.amount) > 0
    );
    try {
      setLoading(true);
      await createTransactions({ saleId, data: transactionsData });

      toast({
        variant: "success",
        title: "Payment updated",
      });

      router.refresh();
      toggle();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const total = form.getValues("total");
    const transactions = form.getValues("transactions");

    const received = transactions?.reduce((acc: any, curr: any) => {
      acc += Number(curr.amount || 0);
      return acc;
    }, 0);

    form.setValue(
      "totalDue",
      received > Math.abs(total)
        ? total
        : total + (total < 0 ? received : -received)
    );
  }, [transactions]);

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Collect Payment</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="border p-3 space-y-1 rounded-md text-center">
                <div className="font-medium text-muted-foreground">Total</div>
                <div className="font-medium text-lg">
                  {Numeral(form.watch("total")).format()}
                </div>
              </div>
              <div className={`border p-3 space-y-1 rounded-md text-center`}>
                <div className="font-medium text-muted-foreground">
                  {sale.total < 0 ? "Refund" : "Due"}
                </div>
                <div className="font-medium text-lg">
                  {Numeral(Math.abs(form.watch("totalDue"))).format()}
                </div>
              </div>
            </div>

            <div className="overflow-y-auto relative scrollbox snap-y snap-mandatory h-80">
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
            </div>
            <DialogFooter className="flex justify-between md:justify-end gap-4">
              <DialogCancel className="flex-1 md:flex-none">
                Cancel
              </DialogCancel>

              <Button className="flex-1 md:flex-none md:w-28" type="submit">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
