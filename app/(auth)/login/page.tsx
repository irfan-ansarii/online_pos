import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/app/(auth)/login/components/login-form";

export default async function AuthenticationPage() {
  return (
    <div className="flex flex-col h-screen justify-center">
      <Card className="w-full sm:max-w-md p-6 border-0 sm:border shadow-none sm:shadow mx-auto">
        <CardHeader>
          <CardTitle className="mb-2">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <LoginForm />
        </CardContent>

        <div className="items-center p-6 pt-0 flex text-sm">
          <span className="text-muted-foreground">Don’t have an account?</span>
          <Button variant="link">
            <Link href="/signup">Signup</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
