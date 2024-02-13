import React, { Suspense } from "react";
import { format } from "date-fns";
import { COURIERS } from "@/config/app";
import { Calendar as CalendarIcon, Loader2, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import EditShipment from "./edit-tracking";
import LineItem from "./line-item";
import { ShipmentLineItem } from "@prisma/client";

const ShippingDialog = ({
  lineItems,
  defaultValue = "shipment",
}: {
  lineItems: ShipmentLineItem[];
  defaultValue?: string;
}) => {
  const [active, setActive] = React.useState(defaultValue);

  const form = useForm({
    defaultValues: {
      id: "",
      carrier: "",
      awb: "",
      charges: "",
      trakingUrl: "",
      status: "",
      lineItems: [],
      deliveryAt: new Date(),
      createdAt: new Date(),
    },
  });

  const onSubmit = async (v) => {
    console.log(v);
  };

  const onScan = (e) => {
    const { key } = e;

    if (key === "Enter") {
      // find item
      const v = lineItems?.find((item) => item.barcode === "");

      if (v) {
        // item found
      } else {
        // item not found
        // show error message
      }
    }

    console.log(e.key, e.target.value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full">Ship Now</Button>
      </DialogTrigger>

      <DialogContent>
        <Tabs defaultValue="shipment" value={active} onValueChange={setActive}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* shipment tab */}

              <Suspense
                fallback={
                  <div className="flex flex-col h-full bg-background relative z-50 items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                }
              >
                {/* items tab */}
                <TabsContent
                  value="shipment"
                  className="mt-0 focus-visible:ring-transparent"
                >
                  <div className="h-[34rem] flex flex-col gap-4">
                    <DialogHeader className="mb-4">
                      <DialogTitle>Create Shipment</DialogTitle>
                    </DialogHeader>

                    <div className="relative">
                      <span className="absolute left-3 text-muted-foreground top-0 h-11 inline-flex items-center">
                        <Search className="w-5 h-5" />
                      </span>
                      <Input
                        placeholder="Search..."
                        className="h-11 pl-10 bg-secondary"
                        onKeyDown={onScan}
                      />
                    </div>

                    <div className="scrollbox overflow-auto grow">
                      {form.watch("lineItems").map((field: any) => (
                        <LineItem key={field.id} field={field} />
                      ))}
                    </div>

                    <DialogFooter className="mt-auto">
                      <Button
                        className="w-full"
                        onClick={() => setActive("tracking")}
                      >
                        Ship Now
                      </Button>
                    </DialogFooter>
                  </div>
                </TabsContent>

                {/* shipment tabs */}
                <EditShipment />
              </Suspense>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingDialog;
