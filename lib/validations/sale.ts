import * as z from "zod";

const number = z.any().refine((val) => !isNaN(Number(val)), {
  message: "Enter a valid number",
});

export const saleValidation = z.object({
  customerId: z.number(),
  employeeId: z.number(),
  createdAt: z.string().datetime(),
  lineItems: z
    .object({
      itemId: z.number(),
      productId: z.number(),
      variantId: z.number(),
      title: z.string(),
      variantTitle: z.string().optional(),
      sku: z.string(),
      barcode: z.any(),
      stock: z.any(),
      imageSrc: z.any(),
      price: number,
      taxRate: z.number(),
      quantity: z.number(),
      totalDiscount: number,
      totalTax: number,
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
      label: z.string(),
      amount: number.default(0),
    })
    .array()
    .optional(),
  status: z.string().default("pending"),
});
