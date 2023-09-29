"use client";
import * as z from "zod";
import React, { useEffect } from "react";
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
import { loginValidation } from "@/lib/validations/login";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignupForm({ ...props }: UserAuthFormProps) {
  const { toast } = useToast();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof loginValidation>>({
    resolver: zodResolver(loginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginValidation>) {
    // mutate(values, {
    //   onSuccess: (res) => {
    //     toast({
    //       variant: "success",
    //       title: "Logged in successfully!",
    //     });
    //   },
    //   onError: (error: any) => {
    //     toast({
    //       variant: "error",
    //       description: error.message || "Something went wrong",
    //     });
    //   },
    // });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-8 relative"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* loading */}
        {/* {isLoading && (
          <div className="absolute w-full h-full transparent z-20"></div>
        )} */}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Email</FormLabel>
              <div className="relative">
                <span className="absolute text-muted-foreground inset-y-0 left-0 flex flex-col justify-center px-2">
                  <Mail className="w-4 h-4" />
                </span>
                <FormControl
                  placeholder="name@example.com"
                  className={
                    form.formState.errors?.email
                      ? "!ring-destructive/50 border-destructive"
                      : ""
                  }
                >
                  <Input type="text" {...field} className="pl-8" />
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
            <FormItem className="flex w-full flex-col">
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <span className="absolute text-muted-foreground inset-y-0 left-0 flex flex-col justify-center px-2">
                  <Lock className="w-4 h-4" />
                </span>
                <span
                  className="absolute text-muted-foreground inset-y-0 right-0 flex flex-col justify-center px-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </span>

                <FormControl
                  placeholder="••••••••"
                  className={
                    form.formState.errors.password
                      ? "!ring-destructive/50 border-destructive"
                      : ""
                  }
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                    className="px-8"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {/* {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Create Account"
          )} */}
          Create
        </Button>
      </form>
    </Form>
  );
}
