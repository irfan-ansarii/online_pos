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
import { Check, Mail, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = ["employee", "customer", "payment", "completed"];

const paymentOptions = ["cash", "credit/debit Card", "UPI", "Paytm"];
const ProceedDialog = ({ disabled }: { disabled: boolean }) => {
  const [open, setOpen] = useToggle(false);
  const [active, setActive] = React.useState(tabs[0]);

  const buttonText = React.useMemo(() => {
    const index = tabs.findIndex((tab) => tab === active);

    if (index === tabs.length - 1) return "Done";

    return "Next";
  }, [active]);

  const handleButtonClick = () => {
    const index = tabs.findIndex((tab) => tab === active) + 1;

    if (tabs[index] !== undefined) {
      setActive(tabs[index]);
    } else {
      setOpen(false);
    }
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
          <TabsContent value="employee">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Select sales executive</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="pb-6">
              <Input placeholder="Search..." className="bg-border" />
            </div>
            <RadioGroup
              defaultValue="card"
              className="grid grid-cols-1 gap-0 divide-y border-y"
            >
              {["Irfan Ansari", "John Doe", "Maria", "Debolina", "Guptil"].map(
                (el) => (
                  <div key={el} className="relative">
                    <RadioGroupItem
                      value={el}
                      id={el}
                      className="peer sr-only"
                    />
                    <div className="absolute text-muted-foreground right-0 inset-y-0 flex items-center h-full opacity-0 peer-data-[state=checked]:opacity-100">
                      <Check className="w-4 h-4" />
                    </div>
                    <Label htmlFor={el} className="block py-4 cursor-pointer">
                      <div className="truncate w-full">{el}</div>
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </TabsContent>
          <TabsContent value="customer">
            <DialogHeader className="text-left pb-6">
              <DialogTitle>Select customer</DialogTitle>
              <DialogDescription>
                Select the option bellow send or print invoice
              </DialogDescription>
            </DialogHeader>
            <div className="pb-6">
              <Input placeholder="Search..." className="bg-border" />
            </div>
            <RadioGroup
              defaultValue="card"
              className="grid grid-cols-1 gap-0 divide-y border-y"
            >
              {["Irfan Ansari", "John Doe", "Maria", "Debolina", "Guptil"].map(
                (el) => (
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

                      <div className="flex gap-4 text-xs items-center">
                        <div className="text-muted-foreground font-normal inline-flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          9958367688
                        </div>
                        <div className="text-muted-foreground font-normal inline-flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          example@domain.com
                        </div>
                      </div>
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </TabsContent>
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
            <TabsList className="mt-6 h-2 bg-transparent p-0 gap-1 flex">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-primary py-0 h-2 data-[state=active]:w-10 data-[state=active]:opacity-100 opacity-60 bg-secondary rounded-full"
                ></TabsTrigger>
              ))}
            </TabsList>
            <Button className="mt-6 w-full" onClick={handleButtonClick}>
              {buttonText}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
