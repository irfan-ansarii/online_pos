import * as z from "zod";

export const loginValidation = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Passsword is required" }),
});
