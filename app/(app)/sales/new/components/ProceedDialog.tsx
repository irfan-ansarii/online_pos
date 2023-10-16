import React from "react";
import { useToggle } from "@uidotdev/usehooks";
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
import { Badge } from "@/components/ui/badge";
import { User2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProceedDialog = () => {
  const [open, setOpen] = useToggle(false);
  const [value, setValue] = React.useState("employee");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" onClick={() => setOpen(true)}>
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md md:top-[10%]">
        <Tabs value={value} onValueChange={setValue}>
          <TabsContent value="employee">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Select sales executive</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
              {["Card ", "Razorpay", "Cash", "Paytm"].map((el) => (
                <div key={el} className="relative">
                  <RadioGroupItem
                    value={el}
                    id={el}
                    className="peer absolute right-3 top-3 opacity-0 data-[state=checked]:opacity-100"
                  />

                  <Label
                    htmlFor={el}
                    className="flex flex-col items-center gap-4 rounded-md border-2 border-muted  p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary "
                  >
                    <Badge className="w-10 h-10">
                      <User2 className="w-5 h-5" />
                    </Badge>
                    <div className="truncate w-full text-center">{el}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          <TabsContent value="payment">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Select payment option</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="cash">
                <AccordionTrigger>Cash</AccordionTrigger>
                <AccordionContent className="overflow-visible">
                  <Input />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="card">
                <AccordionTrigger>Credit/Debit Card</AccordionTrigger>
                <AccordionContent className="overflow-visible">
                  <Input />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="upi">
                <AccordionTrigger>UPI</AccordionTrigger>
                <AccordionContent className="overflow-visible">
                  <Input />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          <TabsContent value="completed">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Sale created successfully!</DialogTitle>
              <DialogDescription>
                Select the option bellow send or print invoice
              </DialogDescription>
            </DialogHeader>
            <RadioGroup defaultValue="card" className="grid grid-cols-1 gap-4">
              {["Email", "Text", "What's App", "Print"].map((el) => (
                <div key={el} className="relative">
                  <RadioGroupItem
                    value={el}
                    id={el}
                    className="peer absolute right-3 top-3 opacity-0 data-[state=checked]:opacity-100"
                  />

                  <Label
                    htmlFor={el}
                    className="flex items-center gap-4 rounded-md border-2 border-muted  p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary "
                  >
                    <Badge className="w-10 h-10">
                      <User2 className="w-5 h-5" />
                    </Badge>
                    <div>
                      <div className="truncate w-full text-left mb-1">{el}</div>
                      <p className="text-muted-foreground font-normal">
                        Lorem ipsum dolor sit.
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          <TabsList className="mt-6 h-2 bg-transparent p-0 gap-1 flex">
            <TabsTrigger
              value="employee"
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
          </TabsList>
          <Button className="mt-6 w-full" onClick={() => setValue("payment")}>
            Next
          </Button>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
