import * as z from "zod";

export const saleValidation = z.object({
  happenedAt: z.string(),
  customerId: z.number(),
  employeeId: z.number(),
  lineItems: z
    .object({
      productId: z.number(),
      variantId: z.number(),
      title: z.string(),
      variantTitle: z.any(),
      sku: z.string(),
      price: z.any(),
      taxRate: z.any(),
      quantity: z.any(),
      totalDiscount: z.any(),
      total: z.any(),
    })
    .array()
    .nonempty(),
  taxType: z.string(),
  subtotal: z.any(),
  totalTax: z.any(),
  totalDiscount: z.any(),
  total: z.any(),
  totalDue: z.any(),
  taxLines: z.any(),
  taxAllocations: z.string().array(),
  discountLine: z.object({
    type: z.string(),
    value: z.any(),
  }),
  transactions: z
    .object({
      name: z.string(),
      label: z.string(),
      amount: z.any(),
    })
    .array(),
});

export const updateUserValidation = z.object({
  id: z.number(),
  role: z.string(),
  status: z.string(),
  location: z.number(),
});
