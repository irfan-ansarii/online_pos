"use client";
import * as z from "zod";
import * as React from "react";
import { verifyOTP } from "@/actions/auth-actions";
import { sendOTP } from "@/actions/auth-actions";

import { otpValidation } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";

import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardTitle, CardHeader, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function VerifyOtpForm() {
  const [resentAt, setResentAt] = React.useState<null | number>(null);
  const [resetData, setResetData] = useLocalStorage<string | null>(
    "_auth",
    null
  );
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof otpValidation>>({
    resolver: zodResolver(otpValidation),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof otpValidation>) {
    try {
      setLoading(true);
      await verifyOTP(values);
      toast({
        variant: "success",
        title: "OTP verified",
      });

      setResetData(JSON.stringify(values));

      router.replace("/recover-password?step=3");
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  async function resenOTP() {
    const email = form.getValues("email");

    try {
      setLoading(true);
      await sendOTP({ email });
      setResentAt(Date.now());
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (resetData) {
      const parsed = JSON.parse(resetData);

      form.setValue("email", parsed.email);
    } else {
      router.push("/recover-password");
    }
  }, []);

  return (
    <>
      <CardHeader className="p-0 pb-8">
        <CardTitle className="mb-2">Verify OTP</CardTitle>
        <CardDescription>
          <span>OTP has been sent to</span>
          <span className="text-foreground underline pl-1">
            {form.watch("email")}
          </span>
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-8 relative"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/*  loading */}
          {loading && (
            <div className="absolute w-full h-full transparent z-20"></div>
          )}

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <span className="text-muted-foreground">
                Did not receive the OTP?
              </span>
              <Button variant="link" type="button" onClick={resenOTP}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Resend"
                )}
              </Button>
            </div>

            <Button type="submit">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
