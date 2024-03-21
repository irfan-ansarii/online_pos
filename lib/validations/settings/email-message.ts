import * as z from "zod";

export const emailAndMessageValidation = z.object({
  apiToken: z.string().min(1, { message: "Required" }),
  fromName: z.string().min(1, { message: "Required" }),
  fromEmail: z
    .string()
    .min(1, { message: "Required" })
    .email({ message: "Enter valid email" }),
});
