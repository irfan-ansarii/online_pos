"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { RecoverPasswordForm } from "./RecoverPasswordForm";
import { VerifyOtpForm } from "./VerifyOtpForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

const RecoverForm = () => {
  const params = useSearchParams();

  const step = params.get("step");

  if (step === "2") {
    return <VerifyOtpForm />;
  } else if (step === "3") {
    return <ResetPasswordForm />;
  }

  return <RecoverPasswordForm />;
};

export default RecoverForm;
