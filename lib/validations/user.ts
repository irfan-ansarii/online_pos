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
  id: z.number().optional(),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z
    .string()
    .nonempty({ message: "Required" })
    .regex(/^\d{10}$/, { message: "Invalid phone number" }),
  email: z.union([z.string().email(), z.literal("")]),
  role: z.enum(["user", "admin"]),
  status: z.enum(["active", "blocked"]),
  locationId: z.union([z.number(), z.string()]),
});
