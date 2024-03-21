"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailAndMessageValidation } from "@/lib/validations/settings/email-message";
import { upsertOption } from "@/actions/option-actions";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function maskString(str: string) {
  if (!str || str === "" || str.length < 5) {
    return "";
  }
  const maskedLength = str.length - 4;
  const maskedPart = "*".repeat(maskedLength);
  const visiblePart = str.slice(-4);
  return maskedPart + visiblePart;
}

const EmailMessage = ({ defaultValues }: any) => {
  const [loading, setLoading] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(emailAndMessageValidation),
    defaultValues: {
      ...defaultValues,
      apiToken: maskString(defaultValues?.apiToken || ""),
    },
  });
  const router = useRouter();
  const onSubmit = async (
    values: z.infer<typeof emailAndMessageValidation>
  ) => {
    let stringValue = "";
    const { apiToken, ...rest } = values;

    if (apiToken.startsWith("*")) {
      stringValue = JSON.stringify({
        ...rest,
        apiToken: defaultValues.apiToken,
      });
    } else {
      stringValue = JSON.stringify(values);
    }
    console.log(stringValue);

    setLoading(true);
    try {
      await upsertOption({
        key: "emailMessage",
        value: stringValue,
      });

      toast({
        variant: "success",
        title: "Saved successfully.",
      });
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, (e) => console.log(e))}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <CardTitle className="font-semibold tracking-tight text-base">
                Email Setup
              </CardTitle>
              <CardDescription>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </div>

            <FormItem>
              <FormLabel>Driver</FormLabel>
              <FormControl>
                <Input value="Mailtrap" disabled />
              </FormControl>
            </FormItem>

            <FormField
              control={form.control}
              name="apiToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <CardTitle className="font-semibold tracking-tight text-base">
              Message Setup
            </CardTitle>
            <CardDescription className="mb-6">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </CardDescription>
          </div>
        </div>
        <div className="text-right mt-6">
          <Button type="submit" className="w-28">
            {loading ? <Loader2 className="animate-apin w-4 h-4" /> : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EmailMessage;
