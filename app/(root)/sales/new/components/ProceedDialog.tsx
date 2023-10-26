import React from "react";
import { useToggle } from "@uidotdev/usehooks";
import { useFormContext } from "react-hook-form";
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

import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeTab from "./EmployeeTab";
import CustomerTab from "./CustomerTab";

const paymentOptions = ["cash", "credit/debit Card", "UPI", "Paytm"];

const ProceedDialog = ({ disabled }: { disabled: boolean }) => {
  const form = useFormContext();

  const [open, setOpen] = useToggle(false);
  const [active, setActive] = React.useState("employee");

  const isNextEnabled = React.useMemo(() => {
    const values = form.watch();

    switch (active) {
      case "employee":
        return values.employeeId ? true : false;
      case "customer":
        return values.customerId ? true : false;
      default:
        return false;
    }
  }, [form.watch()]);

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

          <TabsContent value="payment">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Enter payment details</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <Accordion type="multiple" className="w-full border-t">
              {paymentOptions.map((item) => (
                <AccordionItem value={item} key={item}>
                  <AccordionTrigger className="capitalize">
                    {item}
                  </AccordionTrigger>
                  <AccordionContent className="overflow-visible">
                    <Input />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="completed">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Sale created successfully!</DialogTitle>
              <DialogDescription>
                Select the option bellow send or print invoice
              </DialogDescription>
            </DialogHeader>
            <RadioGroup
              defaultValue="card"
              className="grid grid-cols-1 gap-0 divide-y border-y"
            >
              {["Email", "Text", "What's App", "Print"].map((el) => (
                <div key={el} className="relative">
                  <RadioGroupItem value={el} id={el} className="peer sr-only" />
                  <div className="absolute text-muted-foreground right-0 inset-y-0 flex items-center h-full opacity-0 peer-data-[state=checked]:opacity-100">
                    <Check className="w-4 h-4" />
                  </div>
                  <Label htmlFor={el} className="block py-3 cursor-pointer">
                    <div className="truncate w-full text-left mb-1">{el}</div>

                    <div className="text-muted-foreground font-normal text-xs">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          <div>
            <TabsList className="mt-6 bg-transparent flex-col flex">
              <div className="flex gap-1">
                <TabsTrigger
                  value="employee"
                  className="data-[state=active]:bg-primary py-0 h-2 data-[state=active]:w-10 data-[state=active]:opacity-100 opacity-60 bg-secondary rounded-full"
                ></TabsTrigger>
                <TabsTrigger
                  value="customer"
                  className="data-[state=active]:bg-primary py-0 h-2 data-[state=active]:w-10 data-[state=active]:opacity-100 opacity-60 bg-secondary rounded-full"
                ></TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="data-[state=active]:bg-primary py-0 h-2 data-[state=active]:w-10 data-[state=active]:opacity-100 opacity-60 bg-secondary rounded-full"
                ></TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-primary py-0 h-2 data-[state=active]:w-10 data-[state=active]:opacity-100 opacity-60 bg-secondary rounded-full"
                ></TabsTrigger>
              </div>
            </TabsList>
            <Button className="w-full" disabled={!isNextEnabled}>
              Next
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
