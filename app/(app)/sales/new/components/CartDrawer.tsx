import React from "react";
import {
  DrawerContent,
  DrawerTrigger,
  DrawerRoot,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Cart from "./Cart";
import { ShoppingBag } from "lucide-react";
const CartDrawer = () => {
  return (
    <DrawerRoot>
      <DrawerTrigger asChild>
        <Button
          size="icon"
          className="rounded-full fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
        >
          <ShoppingBag className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90%] p-4 pt-10">
        <Cart />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default CartDrawer;
