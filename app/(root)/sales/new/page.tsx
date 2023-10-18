"use client";
import { ShoppingBag } from "lucide-react";
import {
  DrawerContent,
  DrawerTrigger,
  DrawerRoot,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import Cart from "./components/Cart";
import Products from "./components/Products";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
const Page = () => {
  const form = useForm();

  const lineItems = useFieldArray({
    control: form.control,
    name: "lineItems",
  });
  return (
    <main className="grow pb-4 px-1 md:p-4  md:mt-[-4.8rem]">
      <FormProvider {...form} {...lineItems}>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-6 xl:col-span-7 2xl:col-span-8 bg-background">
            <DrawerRoot>
              <DrawerTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full fixed z-50 bottom-[54px] md:bottom-4 left-1/2 -translate-x-1/2 lg:hidden w-12 h-12"
                >
                  <ShoppingBag className="w-5 h-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90%] p-4 pt-10 bg-accent">
                <Cart />
              </DrawerContent>
            </DrawerRoot>

            <Products />
          </div>
          <div className="hidden lg:block -mr-4 p-4 lg:col-span-6 xl:col-span-5 2xl:col-span-4 sticky bg-accent h-screen top-0 bottom-0 z-50">
            <Cart />
          </div>
        </div>
      </FormProvider>
    </main>
  );
};

export default Page;
