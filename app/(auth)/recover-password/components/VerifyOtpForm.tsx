"use client";
import * as z from "zod";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { otpValidation } from "@/lib/validations/auth";
import { useToast } from "@/components/ui/use-toast";
import { useVerifyOTP, useSendOTP } from "@/hooks/useAuth";
import { getCookie } from "@/lib/utils";

export function VerifyOtpForm() {
  const { mutate, isLoading } = useVerifyOTP();
  const { mutate: sendOTP, isLoading: otpSending } = useSendOTP();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof otpValidation>>({
    resolver: zodResolver(otpValidation),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof otpValidation>) {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: res.data.message,
        });
        router.replace("/recover-password?step=3");
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: error.response.data.message || "Something went wrong",
        });
      },
    });
  }

  React.useEffect(() => {
    const email = getCookie("_recovery_email");
    if (!email) {
      router.push("/recover-password");
    }
  });

  return (
    <>
      <CardHeader className="p-0 pb-8">
        <CardTitle className="mb-2">Verify OTP</CardTitle>
        <CardDescription>
          OTP has been sent to {getCookie("_recovery_email")}
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form
          className="flex flex-col justify-start gap-8 relative"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/*  loading */}
          {(isLoading || otpSending) && (
            <div className="absolute w-full h-full transparent z-20"></div>
          )}

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>OTP</FormLabel>

                <FormControl
                  placeholder="name@example.com"
                  className={
                    form.formState.errors?.otp
                      ? "!ring-destructive/50 border-destructive"
                      : ""
                  }
                >
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
              <Button
                variant="link"
                onClick={() => {
                  sendOTP({ email: getCookie("_recovery_email") || "" });
                }}
              >
                {otpSending ? "Sending..." : "Resend"}
              </Button>
            </div>

            <Button type="submit">
              {isLoading ? (
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
