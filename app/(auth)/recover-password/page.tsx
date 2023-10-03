import { Card, CardContent } from "@/components/ui/card";

import RecoverForm from "./components/Form";
export default async function AuthenticationPage() {
  return (
    <div className="flex flex-col h-screen justify-center">
      <Card className="w-full sm:max-w-md p-6 border-0 sm:border shadow-none sm:shadow mx-auto">
        <CardContent className="pt-6">
          <RecoverForm />
        </CardContent>
      </Card>
    </div>
  );
}
