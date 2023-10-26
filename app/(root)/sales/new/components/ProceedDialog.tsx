import React from "react";
import { useToggle } from "@uidotdev/usehooks";
import { useFormContext } from "react-hook-form";
import ScrollBar from "react-perfect-scrollbar";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import EmployeeTab from "./EmployeeTab";
import CustomerTab from "./CustomerTab";

const paymentOptions = ["cash", "credit/debit Card", "UPI", "Paytm"];
const tabs = ["employee", "customer", "payment", "completed"];

const ProceedDialog = ({ disabled }: { disabled: boolean }) => {
  const form = useFormContext();

  const [open, setOpen] = useToggle(false);
  const [active, setActive] = React.useState("employee");

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
    if (active === "employee" && !form.watch("employeeId")) {
      return true;
    }
    if (active === "customer" && !form.watch("customerId")) {
      return true;
    }
    return false;
  };
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

          <TabsContent value="payment" className="flex flex-col h-full">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Enter payment details</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <ScrollBar className="h-72 w-full grow">
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
            </ScrollBar>
          </TabsContent>

          <TabsContent value="completed" className="flex flex-col h-full">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Sale created successfully!</DialogTitle>
              <DialogDescription>
                Select the option bellow send or print invoice
              </DialogDescription>
            </DialogHeader>
            <ScrollBar className="h-72 w-full grow">
              <RadioGroup
                defaultValue="card"
                className="grid grid-cols-1 gap-0 divide-y border-y"
              >
                {["Email", "Text", "What's App", "Print"].map((el) => (
                  <div key={el} className="relative">
                    <RadioGroupItem
                      value={el}
                      id={el}
                      className="peer sr-only"
                    />
                    <div className="absolute text-muted-foreground right-0 inset-y-0 flex items-center h-full opacity-0 peer-data-[state=checked]:opacity-100">
                      <Check className="w-4 h-4" />
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
            </ScrollBar>
          </TabsContent>

          {/* indicator */}
          <div className="flex gap-1 mt-3 justify-center">
            {tabs.map((el) => (
              <div
                key={el}
                className={`py-0 block h-2 rounded-full ${
                  active === el ? "bg-primary w-16" : "bg-secondary w-10"
                }`}
              />
            ))}
          </div>

          {/* handle step */}
          <div className="flex gap-2 mt-3">
            {!isFirst && !isLast && (
              <Button className="flex-1" onClick={handlePrev}>
                Prev
              </Button>
            )}

            <Button
              className="flex-1"
              disabled={isDisabled()}
              onClick={handleNext}
            >
              {isLast ? "Done" : "Next"}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
