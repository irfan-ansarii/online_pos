import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { SignupForm } from "@/app/(auth)/signup/components/signup-form";

export default function AuthenticationPage() {
  return (
    <div className="flex flex-col h-screen justify-center">
      <Card className="w-full sm:max-w-md p-6 border-0 sm:border shadow-none sm:shadow mx-auto">
        <CardHeader>
          <CardTitle className="mb-2">Create an account</CardTitle>
          <CardDescription>Enter login credentials</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <SignupForm />
        </CardContent>

        <div className="items-center p-6 pt-0 flex  text-sm gap-1">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="text-accent-foreground hover:underline"
          >
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
}
