"use client";
import * as z from "zod";
import * as React from "react";
import Link from "next/link";

import { sendOTP } from "@/actions/auth-actions";

import { recoverValidation } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";

import { Loader2, Mail } from "lucide-react";
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

export function RecoverPasswordForm() {
  const [_, setResetData] = useLocalStorage<string | null>("_auth", null);

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof recoverValidation>>({
    resolver: zodResolver(recoverValidation),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof recoverValidation>) {
    try {
      setLoading(true);
      await sendOTP(values);
      toast({
        variant: "success",
        title: "OTP has been sent successfully",
      });
      setResetData(JSON.stringify(values));

      router.refresh();
      router.push(`/recover-password?step=2`);
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <CardHeader className="p-0 pb-8">
        <CardTitle className="mb-2">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you an OTP
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <span className="absolute text-muted-foreground inset-y-0 left-0 flex flex-col justify-center px-3">
                    <Mail className="w-4 h-4" />
                  </span>
                  <FormControl placeholder="email@domain.com">
                    <Input type="text" {...field} className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-3">
            <Button type="submit">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Send OTP"
              )}
            </Button>
            <Button variant="secondary">
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
