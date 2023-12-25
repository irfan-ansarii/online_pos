import * as z from "zod";
// @ts-ignore
import query from "india-pincode-search";

export const customerValidation = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  phone: z.string().regex(/^\d{10}$/, { message: "Invalid phone number" }),
  email: z.union([z.string().email(), z.literal("")]),
  addresses: z.array(
    z.object({
      id: z.number().optional(),
      company: z.any(),
      address: z.string().min(1, "Required"),
      address2: z.string().optional(),
      zip: z
        .string()
        .length(6, "Invalid zip code")
        .refine(
          (value) => {
            const res = query.search(value);
            if (res && res.length > 0) return true;
            return false;
          },
          {
            message: "Invalid zip code",
          }
        ),
      city: z.string().min(1, "Required"),
      state: z.string().min(1, "Required"),
      country: z.string().optional(),
    })
  ),
});
