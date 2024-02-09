import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogCancel,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const ShippingDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full"> Ship Now</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="text-left pb-6">
          <DialogTitle>Select Courier</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur. Lorem, ipsum dolor.
          </DialogDescription>
        </DialogHeader>
        {/* <RadioGroup className="flex flex-col gap-1">
          {[...Array(20)].map((customer: any, i) => (
            <>
              <RadioGroupItem value={`${i}`} />

              <div className="absolute text-primary-foreground w-4 h-4 bg-primary top-1/2 -translate-y-1/2 right-3 rounded-full inline-flex items-center justify-center opacity-0 peer-data-[state=checked]:opacity-100">
                <Check className="w-3 h-3" />
              </div>

              <Label className="space-y-1 py-2 px-3 rounded-md border block cursor-pointer hover:bg-accent transition duration-300 peer-data-[state=checked]:bg-accent">
                <div>Name</div>
                <div className="flex gap-4 text-xs items-center">
                  <div className="text-muted-foreground font-normal inline-flex items-center">
                  
                    Phone
                  </div>

                  <div className="text-muted-foreground font-normal inline-flex items-center">
                  
                    EMail
                  </div>
                </div>
              </Label>
            </>
          ))}
        </RadioGroup> */}

        <RadioGroup defaultValue="option-one">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option-one" id="option-one" />
            <Label htmlFor="option-one">Option One</Label>
          </div>
        </RadioGroup>

        <DialogFooter className="flex-col md:flex-row">
          <DialogCancel className="order-1">Cancel</DialogCancel>
          <Button className="md:order-2"> Ship Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingDialog;
