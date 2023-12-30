"use client";

import ErrorBox from "@/components/shared/error-box";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="h-screen">
      <div className="flex flex-col h-full items-center justify-center">
        <ErrorBox
          title={error.message || "Something went wrong!"}
          reset={reset}
        />
      </div>
    </main>
  );
}
