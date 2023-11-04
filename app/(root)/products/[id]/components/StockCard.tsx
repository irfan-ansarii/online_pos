import React from "react";
import { MapPin, Settings2 } from "lucide-react";
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
const StockCard = () => {
  return (
    <DrawerRoot>
      <div className="divide-y px-4">
        {[...Array(3)].map((_, i) => (
          <div className="flex py-3 items-center" key={i}>
            <div className="text-muted-foreground mr-2">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1"> Lorem ipsum dolor sit.</div>
            <div className="ml-auto flex gap-2">
              <div>10</div>
              <DrawerTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Settings2 className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
            </div>
          </div>
        ))}
      </div>
      <DrawerContent>Adjust Stock</DrawerContent>
    </DrawerRoot>
  );
};

export default StockCard;
