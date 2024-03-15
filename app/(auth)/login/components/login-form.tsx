"use client";
import * as z from "zod";
import * as React from "react";
import Link from "next/link";

import { login } from "@/actions/auth-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "@/lib/validations/auth";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQueryParams } from "@/hooks/useQueryParams";
import { toast } from "@/components/ui/use-toast";

import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const { queryParams } = useQueryParams();
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginValidation>) {
    try {
      setLoading(true);
      await login(values);
      toast({
        variant: "success",
        title: "Logged in successfully!",
      });

      router.replace(
        queryParams.redirect ? queryParams.redirect : "/dashboard"
      );
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "error",
        title: error.message || "Something went wrong",
      });
      setLoading(false);
    }
  }

  return (
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
                <FormControl placeholder="name@example.com">
                  <Input type="text" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <span className="absolute text-muted-foreground inset-y-0 left-0 flex flex-col justify-center px-3">
                  <Lock className="w-4 h-4" />
                </span>
                <span
                  className="absolute text-muted-foreground inset-y-0 right-0 flex flex-col justify-center px-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </span>

                <FormControl placeholder="••••••••">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="px-10"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label
              htmlFor="terms"
              className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </Label>
          </div>
          <Button variant="link" className="py-0 h-auto">
            <Link href="/recover-password">Forgot Password?</Link>
          </Button>
        </div>
        <Button type="submit">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
}
