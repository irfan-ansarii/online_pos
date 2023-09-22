import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Plus, Minus, ShoppingBag } from "lucide-react";
import ProceedDialog from "./ProceedDialog";
import CartActions from "./CartActions";

const Cart = () => {
  return (
    <div className="flex flex-col h-full w-full relative space-y-4">
      <div className="flex gap-4">
        <div className="relative grow ">
          <Input type="text" className="pl-10" placeholder="Search..." />
          <span className="absolute left-0 inset-y-0 h-full flex items-center justify-center w-10 text-muted-foreground">
            <User className="w-5 h-5" />
          </span>
        </div>
        <CartActions />
      </div>

      {/* <div className="flex flex-col h-full w-full grow items-center justify-center text-muted-foreground dark:text-background">
            <ShoppingBag className="w-20 h-20" />
          </div> */}

      <ScrollArea className="grow h-full -mx-4 px-4">
        <Accordion type="single" collapsible className="h-full space-y-1">
          {[...Array(20)].map((val, i) => (
            <AccordionItem
              value={`item-${i}`}
              className="bg-background dark:bg-popover border-none p-2 rounded-md relative"
            >
              <div className="grid grid-cols-12 items-center">
                <div className="flex gap-2 col-span-7 truncate">
                  <AccordionTrigger className="py-0 hover:no-underline">
                    <Avatar className="mr-2 w-8 h-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="text-left text-sm font-normal">
                      Is it accessible? Is it accessible? Is it accessible?
                    </div>
                  </AccordionTrigger>
                </div>
                <div className="col-span-5 grid grid-cols-12 text-sm">
                  <div className="flex col-span-5">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full w-6 h-6"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="grow text-center shrink-0 min-w-8 block">
                      4
                    </span>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full w-6 h-6"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="col-span-7 text-right">
                    <div className="font-medium">1,490.05</div>
                  </div>
                </div>
              </div>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      <div className="bg-background dark:bg-popover p-4  rounded-md">
        <div className="flex flex-col text-sm">
          <div className="flex justify-between py-1">
            <div>Subtotal</div>
            <div>items</div>
            <div>0.00</div>
          </div>
          <div className="flex justify-between py-1">
            <div>Discount</div>
            <div>0.00</div>
          </div>
          <div className="flex justify-between py-1">
            <div>Tax</div>
            <div>0.00</div>
          </div>
          <div className="relative">
            <div className="w-6 h-6 rounded-full -left-8 bg-secondary dark:bg-border absolute top-1/2 transform translate-y-[-50%]"></div>
            <div className="w-6 h-6 rounded-full -right-8 bg-secondary dark:bg-border absolute top-1/2 transform translate-y-[-50%]"></div>
            <div className="border-b-2 border-dashed my-2 "></div>
          </div>
          <div className="flex justify-between py-1 text-lg font-medium">
            <div>Total</div>
            <div>0.00</div>
          </div>
        </div>

        <div className="mt-2">
          <ProceedDialog />
        </div>
      </div>
    </div>
  );
};

export default Cart;
