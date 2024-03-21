"use client";
import { sendEmail } from "@/lib/email";
import React from "react";
import { Button } from "@/components/ui/button";

const Application = () => {
  const onClick = async () => {
    try {
      const RECIPIENT_EMAIL = "irfanraza95@gmail.com";
      const content = { text: "Im text message", html: "<h1>Img html</h1>" };
      await sendEmail(RECIPIENT_EMAIL, "Hello from Mailtrap!", content);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      Application
      <div>
        <Button onClick={onClick}>Send Test Email</Button>
      </div>
    </div>
  );
};

export default Application;
