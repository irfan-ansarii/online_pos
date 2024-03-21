import React from "react";
import EmailMessage from "../components/email-message";
import { getOption } from "@/actions/option-actions";

const page = async () => {
  const { data }: any = await getOption("emailMessage");

  const defaultValues = {
    apiToken: data?.value?.apiToken || "",
    fromName: data?.value?.fromName || "",
    fromEmail: data?.value?.fromEmail || "",
  };

  return <EmailMessage defaultValues={defaultValues} />;
};

export default page;
