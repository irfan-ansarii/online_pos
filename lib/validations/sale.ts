import * as z from "zod";

const number = z
  .any()
  .refine((val) => !isNaN(val), {
    message: "Enter a valid number",
  })
  .transform(Number);

export const saleValidation = z.object({
  createdAt: z.string().datetime(),
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
      total: number,
    })
    .array()
    .nonempty(),
  taxType: z.enum(["included", "excluded"]),
  subtotal: number,
  totalTax: number,
  totalDiscount: number,
  total: number,
  roundedOff: number.default(0),
  totalDue: number,
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
      kind: z.string().default("sale"),
      status: z.string().default("success"),
      label: z.string(),
      amount: number.optional(),
    })
    .array()
    .optional(),
  status: z.string().default("pending"),
});
