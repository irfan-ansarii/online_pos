import * as z from "zod";

export const saleValidation = z.object({
  happenedAt: z.string(),
  customerId: z.number(),
  employeeId: z.number(),
  billingAddress: z.any(),
  shippingAddress: z.any(),
  lineItems: z
    .object({
      productId: z.number(),
      variantId: z.number(),
      title: z.string(),
      variantTitle: z.string(),
      sku: z.string(),
      price: z.number(),
      quantity: z.number(),
      totalDiscount: z.preprocess(
        (a) => parseFloat(z.string().parse(a)),
        z.number().positive()
      ),
      total: z.number(),
      taxable: z.boolean(),
    })
    .array()
    .nonempty(),
  taxType: z.string(),
  lineItemsTotal: z.number(),
  subtotal: z.number(),
  totalTax: z.number(),
  totalDiscount: z.number(),
  total: z.number(),
  totalDue: z.number(),
  taxLines: z.any(),
  discountLine: z.any(),
});

export const updateUserValidation = z.object({
  id: z.number(),
  role: z.string(),
  status: z.string(),
  location: z.number(),
});
