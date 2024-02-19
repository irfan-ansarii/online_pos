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
    <ErrorBox title={error.message || "Something went wrong!"} reset={reset} />
  );
}
