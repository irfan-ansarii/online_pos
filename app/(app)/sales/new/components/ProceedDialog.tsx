import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User2, Check } from "lucide-react";
const ProceedDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Proceed</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-md md:top-[10%]">
        <DialogHeader className="text-left pb-4">
          <DialogTitle className="text-md">Sales executive</DialogTitle>
          <DialogDescription>
            Add a new payment method to your account.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
          {["Card", "Razorpay", "Cash", "Paytm"].map((el) => (
            <div key={el} className="relative">
              <RadioGroupItem value={el} id={el} className="peer sr-only" />
              <Label
                htmlFor={el}
                className="flex flex-col items-center gap-4 rounded-md border-2 border-muted  p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary "
              >
                <Badge className="w-10 h-10">
                  <User2 className="w-5 h-5" />
                </Badge>
                {el}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Button className="mt-4">Complete Sale</Button>
      </DialogContent>
    </Dialog>
  );
};

export default ProceedDialog;
