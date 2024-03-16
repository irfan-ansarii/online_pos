"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOption, upsertOption } from "@/actions/option-actions";
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

const Barcode = () => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(barcodeValidation),
    defaultValues: {
      key: "barcodeLabel",
      width: "",
      height: "",
      columns: "",
      gap: "",
      top: "0",
      bottom: "0",
      left: "0",
      right: "0",
    },
  });

  const columns = [...Array(Number(form.watch("columns") || 0)).fill("")];

  const onSubmit = async (values: z.infer<typeof barcodeValidation>) => {
    const stringValue = JSON.stringify(values);

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

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await getOption("barcodeLabel");
      if (data) {
        const parsed = JSON.parse(data.value);
        form.reset({
          ...parsed,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}>
            <CardTitle className="font-semibold tracking-tight text-base">
              Template Size
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
                <Button type="submit" className="mt-6 w-28">
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

      <Card className="bg-secondary overflow-hidden col-span-2 p-4">
        <div className="flex flex-col justify-center h-full">
          <div className="flex" style={{ gap: `${form.watch("gap")}mm` }}>
            {columns.map((_, i) => (
              <div className="space-y-2 flex-1" key={`key-${i}`}>
                <div className="bg-background rounded-t-md h-3"></div>
                <div
                  className="bg-background rounded-md"
                  style={{
                    height: `${form.watch("height")}mm`,
                    paddingTop: `${form.watch("top")}mm`,
                    paddingRight: `${form.watch("right")}mm`,
                    paddingBottom: `${form.watch("bottom")}mm`,
                    paddingLeft: `${form.watch("left")}mm`,
                  }}
                >
                  {/* <div className="border h-full"></div> */}
                </div>
                <div className="bg-background rounded-b-md h-3"></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 font-medium">
            {(form.watch("width") as any) * (form.watch("columns") as any)} X{" "}
            {form.watch("height")}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Barcode;
