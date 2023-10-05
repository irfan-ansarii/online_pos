import * as z from "zod";

export const userInviteValidation = z.object({
  role: z.string().nonempty({ message: "Role is required" }),
  location: z.string().nonempty(),
  email: z
    .string()
    .email({ message: "Enter valid email" })
    .nonempty({ message: "Email is required" }),
});

export const updateUserValidation = z.object({
  id: z.number(),
  role: z.string(),
  status: z.string(),
  location: z.number(),
});
