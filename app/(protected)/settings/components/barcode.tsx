"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertOption } from "@/actions/option-actions";
import { barcodeValidation } from "@/lib/validations/settings/barcode";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Barcode = ({ defaultValues }: any) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(barcodeValidation),
    defaultValues: {
      key: "barcodeLabel",
      ...defaultValues,
    },
  });

  const columns = [...Array(Number(form.watch("columns") || 0)).fill("")];

  const onSubmit = async (values: z.infer<typeof barcodeValidation>) => {
    const { key, ...rest } = values;
    const stringValue = JSON.stringify(rest);

    try {
      setLoading(true);
      await upsertOption({
        key: "barcodeLabel",
        value: stringValue,
      });
      toast({
        variant: "success",
        title: "Saved successfully.",
      });
      // form.reset();
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const columnWidth =
    ((form.watch("width") as any) -
      (form.watch("gap") as any) * ((form.watch("columns") as any) - 1)) /
      (form.watch("columns") as any) || 0;

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-5 lg:col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}>
            <CardTitle className="font-semibold tracking-tight text-base">
              Page Size
            </CardTitle>
            <CardDescription className="mb-6">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </CardDescription>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} />
                        <span className="absolute right-2 inset-y-0 flex items-center text-muted-foreground">
                          mm
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} />
                        <span className="absolute right-2 inset-y-0 flex items-center text-muted-foreground">
                          mm
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <CardTitle className="font-semibold tracking-tight text-base">
                  Template Column
                </CardTitle>
                <CardDescription>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </CardDescription>
              </div>
              <FormField
                control={form.control}
                name="columns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Column Count</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Column Gap</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} />
                        <span className="absolute right-2 inset-y-0 flex items-center text-muted-foreground text-xs">
                          mm
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <CardTitle className="font-semibold tracking-tight text-base">
                  Template Margin
                </CardTitle>
                <CardDescription>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                </CardDescription>
              </div>
              <FormField
                control={form.control}
                name="top"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Top</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} />
                        <span className="absolute right-2 inset-y-0 flex items-center text-muted-foreground">
                          mm
                        </span>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bottom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bottom</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} />
                        <span className="absolute right-2 inset-y-0 flex items-center text-muted-foreground">
                          mm
                        </span>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="left"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Left</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} />
                        <span className="absolute right-2 inset-y-0 flex items-center text-muted-foreground">
                          mm
                        </span>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="right"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Right</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="0.00" {...field} />
                        <span className="absolute right-2 inset-y-0 flex items-center text-muted-foreground">
                          mm
                        </span>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2 text-right">
                <Button type="submit" className="w-28">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <Card className="bg-secondary overflow-hidden col-span-5 lg:col-span-2 p-4">
        <div className="flex flex-col justify-center h-full">
          <div className="flex" style={{ gap: `${form.watch("gap") || 0}mm` }}>
            {columns.map((_, i) => (
              <div className="space-y-2 flex-1" key={`key-${i}`}>
                <div className="bg-background rounded-t-md h-3"></div>
                <div
                  className="bg-background rounded-md flex items-center justify-center text-muted-foreground"
                  style={{
                    height: `${form.watch("height")}mm`,
                    paddingTop: `${form.watch("top")}mm`,
                    paddingRight: `${form.watch("right")}mm`,
                    paddingBottom: `${form.watch("bottom")}mm`,
                    paddingLeft: `${form.watch("left")}mm`,
                  }}
                >
                  {columnWidth.toFixed(2) || 0} X {form.watch("height")}
                </div>
                <div className="bg-background rounded-b-md h-3"></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 font-medium">
            {(form.watch("width") as any) || 0} X {form.watch("height")}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Barcode;
