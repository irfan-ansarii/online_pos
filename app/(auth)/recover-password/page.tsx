import { CardContent } from "@/components/ui/card";

import RecoverForm from "./components/Form";
export default async function AuthenticationPage() {
  return (
    <CardContent className="pt-6">
      <RecoverForm />
    </CardContent>
  );
}
