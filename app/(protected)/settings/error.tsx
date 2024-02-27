"use client";

import ErrorBox from "@/components/shared/error-box";
import { Card, CardContent } from "@/components/ui/card";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card>
      <CardContent>
        <ErrorBox
          title={error.message || "Something went wrong!"}
          reset={reset}
        />
      </CardContent>
    </Card>
  );
}
