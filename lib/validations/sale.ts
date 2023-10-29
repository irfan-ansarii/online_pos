import * as z from "zod";

const number = z.any().refine((val) => !isNaN(val), {
  message: "Enter a valid number",
});

export const saleValidation = z.object({
  happenedAt: z.string(),
  customerId: z.number(),
  employeeId: z.number(),
  lineItems: z
    .object({
      productId: z.number(),
      variantId: z.number(),
      title: z.string(),
      variantTitle: z.string().optional(),
      sku: z.string(),
      price: number,
      taxRate: z.number(),
      quantity: z.number(),
      totalDiscount: number,
      total: z.number(),
    })
    .array()
    .nonempty(),
  taxType: z.enum(["included", "excluded"]),
  subtotal: z.number(),
  totalTax: z.number(),
  totalDiscount: number,
  total: z.number(),
  totalDue: z.number(),
  taxLines: z.any(),
  taxAllocations: z.string().array(),
  discountLine: z
    .object({
      type: z.string(),
      value: number,
    })
    .optional(),
  transactions: z
    .object({
      name: z.string(),
      label: z.string(),
      amount: number.optional(),
    })
    .array()
    .optional(),
});
