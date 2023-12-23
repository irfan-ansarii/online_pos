"use client";
import * as z from "zod";
import * as React from "react";
import { resetPassword } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetValidation } from "@/lib/validations/auth";
import { toast } from "@/components/ui/use-toast";
import { useLocalStorage } from "@uidotdev/usehooks";

export function ResetPasswordForm() {
  const [loading, setLoading] = React.useState(false);
  const [resetData, setResetData] = useLocalStorage<string | null>(
    "_auth",
    null
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof resetValidation>>({
    resolver: zodResolver(resetValidation),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetValidation>) {
    try {
      setLoading(true);
      await resetPassword(values);
      toast({
        variant: "success",
        title: "Password reset successfull",
      });
      setResetData(null);
      router.refresh();
      router.push("/login");
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
      form.setValue("otp", parsed.otp);
    } else {
      router.push("/recover-password");
    }
  }, []);
  return (
    <>
      <CardHeader className="p-0 pb-8">
        <CardTitle className="mb-2">Create Password</CardTitle>
        <CardDescription>
          Choose a strong password to secure your account
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
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <div className="relative">
                  <span className="absolute text-muted-foreground inset-y-0 left-0 flex flex-col justify-center px-3">
                    <Lock className="w-4 h-4" />
                  </span>

                  <FormControl placeholder="••••••••">
                    <Input {...field} className="pl-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <div className="relative">
                  <span className="absolute text-muted-foreground inset-y-0 left-0 flex flex-col justify-center px-3">
                    <Lock className="w-4 h-4" />
                  </span>

                  <FormControl placeholder="••••••••">
                    <Input {...field} className="px-10" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
