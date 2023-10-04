import * as z from "zod";

export const userInviteValidation = z.object({
  role: z.string().nonempty({ message: "Role is required" }),
  email: z
    .string()
    .email({ message: "Enter valid email" })
    .nonempty({ message: "Email is required" }),
});
