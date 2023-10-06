import * as z from "zod";

export const customerValidation = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().optional(),
  phone: z.string().nonempty().length(10),
  email: z.string().nonempty().email(),
  address: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});
