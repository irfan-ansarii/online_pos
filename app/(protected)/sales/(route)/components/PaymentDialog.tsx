import * as z from "zod";
import React from "react";
import Numeral from "numeral";
import { Sale } from "@prisma/client";
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
import { useForm } from "react-hook-form";
import { usePayments } from "@/hooks/usePayments";
import { Button } from "@/components/ui/button";
import { createTransactions } from "@/actions/sale-actions";

const PaymentDialog = ({ sale }: { sale: Sale }) => {
  const [open, toggle] = useSheetToggle("new");
  const [loading, setLoading] = React.useState(false);

  const { payments } = usePayments();
  const router = useRouter();
  const form = useForm<z.infer<typeof collectPayementValidation>>({
    resolver: zodResolver(collectPayementValidation),
    defaultValues: {
      due: sale.totalDue,
      saleId: sale.id,
      transactions: [],
    },
  });

  const onSubmit = async (
    values: z.infer<typeof collectPayementValidation>
  ) => {
    const { saleId, transactions } = values;

    try {
      setLoading(true);
      await createTransactions({ saleId, transactions });

      toast({
        variant: "success",
        title: "Payment collected successfully",
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

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Collect Payment</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto relative scrollbox snap-y snap-mandatory h-96">
              <Accordion type="single" className="w-full space-y-2">
                {payments?.data?.map((item: any, i: number) => (
                  <>
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

                    <Input
                      {...form.register(`transactions.${i}.kind`)}
                      defaultValue="sale"
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
                                  defaultValue="0"
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
            <DialogFooter className="flex justify-between md:justify-end gap-4">
              <DialogCancel className="flex 1 md:flex-none">
                Cancel
              </DialogCancel>

              <Button className="flex 1 md:flex-none md:w-28" type="submit">
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
