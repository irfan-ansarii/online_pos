import * as z from "zod";

export const loginValidation = z.object({
  email: z.string().email({ message: "Enter valid email" }),
  password: z.string().nonempty({ message: "Passsword is required" }),
});

export const recoverValidation = z.object({
  email: z.string().email({ message: "Enter valid email" }),
});

export const otpValidation = z.object({
  otp: z
    .string()
    .nonempty({ message: "OTP is required" })
    .min(6, { message: "Incorrect OTP" })
    .max(6, { message: "Incorrect OTP" }),
});

export const resetValidation = z
  .object({
    newPassword: z
      .string()
      .nonempty({ message: "New password is required" })
      .min(8, { message: "Password must be atleast 8 characters" }),
    confirmNewPassword: z
      .string()
      .nonempty({ message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
