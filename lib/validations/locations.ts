import * as z from "zod";

export const locationValidation = z
  .object({
    type: z.enum(["online", "offline"]),
    name: z.string().nonempty({ message: "Required" }),
    phone: z
      .string()
      .nonempty({ message: "Required" })
      .regex(/^\d{10}$/, { message: "Enter valid phone number" }),
    email: z
      .string()
      .email({ message: "Enter valid email" })
      .nonempty({ message: "Required" }),
    storeUrl: z.any(),
    apiKey: z.any(),
  })
  .superRefine(({ type, storeUrl, apiKey }, ctx) => {
    if (type === "online") {
      if (!storeUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required`,
          path: ["storeUrl"],
        });
      }
      if (!apiKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Required`,
          path: ["apiKey"],
        });
      }
    }
  });
