import Link from "next/link";

import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignupForm } from "@/app/(auth)/signup/components/signup-form";

export default function AuthenticationPage() {
  return (
    <>
      <CardHeader>
        <CardTitle className="mb-2">Signup</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <SignupForm />
      </CardContent>

      <div className="items-center p-6 pt-0 flex text-sm">
        <span className="text-muted-foreground">Already have an account?</span>
        <Button variant="link">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </>
  );
}
