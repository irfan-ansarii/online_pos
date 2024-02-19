import * as z from "zod";
const number = z.any().refine((val) => !isNaN(Number(val)), {
  message: "Enter a valid number",
});

export const expenseValidation = z.object({
  id: z.union([z.null(), z.number()]),
  createdAt: z.string(),
  name: z.string().nonempty({ message: "Required" }),
  category: z.string().nonempty({ message: "Required" }),
  notes: z.string(),
  amount: number.default(0).refine((val) => val > 0, {
    message: "Amount must be greater than 0",
  }),
});
