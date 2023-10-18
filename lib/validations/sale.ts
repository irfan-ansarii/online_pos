import * as z from "zod";

export const saleValidation = z.object({
  customer: z.number(),
  employee: z.number(),
  billingAddress: z.any(),
  shippingAddress: z.any(),
  lineItems: z
    .object({
      productId: z.number(),
      variantId: z.number(),
      title: z.string().nonempty(),
      variantTitle: z.string().nonempty(),
      sku: z.string().nonempty(),
      price: z.number().positive(),
      quantity: z.number(),
      totalDiscount: z.number().positive(),
      totalTax: z.number().positive(),
      total: z.number().positive(),
      taxable: z.boolean(),
      taxLines: z
        .object({
          name: z.string(),
          rate: z.number().positive(),
          amount: z.number().positive(),
        })
        .array(),
      discountLines: z
        .object({
          name: z.string(),
          amount: z.number().positive(),
        })
        .array(),
    })
    .array()
    .nonempty(),
  lineItemsTotal: z.number(),
  subtotal: z.number(),
  totalDiscount: z.number(),
  total: z.number(),
  totalDue: z.number(),
  taxLines: z.any(),
  discountLines: z.any(),
});

export const updateUserValidation = z.object({
  id: z.number(),
  role: z.string(),
  status: z.string(),
  location: z.number(),
});
