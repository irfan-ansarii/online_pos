import * as z from "zod";

export const validation = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string(),
});
