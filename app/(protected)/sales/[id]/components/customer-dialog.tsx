"use client";
import React from "react";
import { updateCustomer } from "@/actions/sale-actions";
// @ts-ignore
import query from "india-pincode-search";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { Loader2, PenSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogCancel,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { useToggle } from "@uidotdev/usehooks";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

interface Props {
  saleId: number;
  customer: any;
}

const CustomerDialog = ({ saleId, customer }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [open, toggle] = useToggle(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      address: [
        {
          name: "billing",
          company: "hello",
          gstin: "65745",
          address: "",
          address2: "4645",
          zip: "465",
        },
        {
          name: "shipping",
          company: "hello",
          gstin: "65745",
          address: "",
          address2: "4645",
          zip: "465",
        },
      ],
    },
  });

  const onSubmit = async () => {
    setLoading(true);

    try {
      //   await updateNotes(saleId, value as string);
      toast({
        title: "Notes saved.",
        variant: "success",
      });
      toggle(false);
      router.refresh();
    } catch (error: any) {
      toast({
        title: error?.message,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="w-auto h-auto ml-auto"
          onClick={() => toggle(true)}
        >
          <PenSquare className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <DialogHeader className="text-left">
              <DialogTitle>Edit Address</DialogTitle>
              <DialogDescription>Update the address</DialogDescription>
            </DialogHeader>

            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="shipping"
            >
              {form.getValues("address").map((address) => (
                <AccordionItem value={address.name}>
                  <AccordionTrigger className="capitalize">
                    {address.name} Address
                  </AccordionTrigger>
                  <AccordionContent className="scrollbox overflow-auto h-[20rem]">
                    <div className="grid grid-cols-1 gap-4  overflow-visible">
                      <FormField
                        control={form.control}
                        name={`${address}.company`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`${address}.gstin`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GSTIN</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`${address}.address`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`${address}.address2`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address2</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`${address}.zip`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Zip</FormLabel>
                              <FormControl
                                onChange={(e) => {
                                  field.onChange(e);

                                  //@ts-ignore
                                  const value = e.target.value;
                                  const res = query.search(value);

                                  if (res && res.length > 0) {
                                    const { city, state } = res[0];
                                    form.setValue(`${address}.city`, city);
                                    form.setValue(`${address}.state`, state);
                                  } else {
                                    form.setValue(`billing.city`, "");
                                    form.setValue(`${address}.state`, "");
                                  }
                                }}
                              >
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`${address}.city`}
                          disabled={true}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`${address}.state`}
                          disabled={true}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`${address}.country`}
                          disabled={true}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <DialogFooter className="flex-col md:flex-row">
              <DialogCancel className="order-1">Cancel</DialogCancel>
              <Button className="md:order-2 w-full md:w-28" onClick={onSubmit}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
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

export default CustomerDialog;
