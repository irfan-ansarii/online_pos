import React from "react";
import { MapPin, Settings2 } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StockCard = ({ variant }) => {
  console.log(variant);
  return (
    <Dialog>
      <div className="divide-y px-4">
        {variant?.inventory?.map((_, i) => (
          <div className="flex py-3 items-center" key={i}>
            <div className="text-muted-foreground mr-2">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1"> Lorem ipsum dolor sit.</div>
            <div className="ml-auto flex gap-2 items-center">
              <div>10</div>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
            </div>
          </div>
        ))}
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input placeholder="0"></Input>
          </div>
          <div className="space-y-2">
            <Label>Reason</Label>
            <Input placeholder="0"></Input>
          </div>
          <Button>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StockCard;
