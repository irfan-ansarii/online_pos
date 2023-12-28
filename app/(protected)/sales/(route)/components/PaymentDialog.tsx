import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const PaymentDialog = () => {
  const form = useForm();
  const { payments } = usePayments();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-6 bg-primary/30" variant="ghost">
          Collect Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form>
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

                                {/* {parseFloat(
                                  form.watch(`transactions.${i}.amount`) || 0
                                ) > 0 && (
                                  <span className="ml-auto text-muted-foreground">
                                    {Numeral(
                                      form.watch(`transactions.${i}.amount`)
                                    ).format()}
                                  </span>
                                )} */}
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
            <Button className="w-full" type="submit">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
