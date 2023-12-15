"use client";
import * as z from "zod";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { loginValidation } from "@/lib/validations/auth";
import { toast } from "@/components/ui/use-toast";
import { useSignup } from "@/hooks/useAuth";
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignupForm({ ...props }: UserAuthFormProps) {
  const router = useRouter();

  const { mutate, isLoading } = useSignup();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginValidation>) {
    mutate(values, {
      onSuccess: (res) => {
        toast({
          variant: "success",
          title: res.data.message,
        });
        router.replace("/login");
      },
      onError: (error: any) => {
        toast({
          variant: "error",
          title: error.response.data.message || "Something went wrong",
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-8 relative"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* loading */}
        {isLoading && (
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

        <Button type="submit">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
