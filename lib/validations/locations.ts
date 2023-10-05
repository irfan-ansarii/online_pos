import * as z from "zod";

export const locationValidation = z.object({
  type: z.string({ required_error: "Location type is required" }).nonempty(),
  name: z.string().nonempty(),
  phone: z.string().nonempty().length(10),
  email: z.string().email().nonempty(),
  address: z.string(),
  address2: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string().length(6),
  country: z.string(),
});
