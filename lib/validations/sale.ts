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
      productId: z.number(),
      variantId: z.number(),
      title: z.string(),
      variantTitle: z.string().optional(),
      sku: z.string(),
      barcode: z.any(),
      stock: z.any(),
      imageSrc: z.any(),
      price: number,
      quantity: number,
      totalBeforeDiscount: number,
      totalDiscount: number,
      taxRate: number,
      taxableValue: number,
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
  saleType: z.enum(["state", "inter_state"]),
  transactions: z
    .object({
      name: z.string(),
      label: z.string(),
      amount: number,
    })
    .array()
    .optional(),
});

export const editSaleValidation = z.object({
  customerId: z.any(),
  employeeId: z.any(),
  createdAt: z.date(),
  lineItems: z
    .object({
      itemId: z.union([number, z.null()]),
      productId: z.union([z.number(), z.any()]),
      variantId: z.union([z.number(), z.any()]),
      title: z.any(),
      variantTitle: z.any(),
      sku: z.any(),
      barcode: z.any(),
      stock: z.any(),
      imageSrc: z.any(),

      price: number,
      quantity: z.number(),
      taxRate: z.number(),
      totalDiscount: number,
      taxableValue: number,
      totalTax: number,
      totalBeforeDisccount: number,
      total: number,
    })
    .array()
    .nonempty(),
  taxType: z.string(),
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
      id: z.number(),
      name: z.string(),
      label: z.string(),
      amount: number,
    })
    .array()
    .optional(),
});

export const collectPayementValidation = z
  .object({
    totalDue: z.number(),
    saleId: z.number(),
    transactions: z
      .object({
        name: z.string(),
        label: z.string(),
        kind: z.string(),
        amount: number,
      })
      .array(),
  })
  .superRefine((val, ctx) => {
    const { totalDue, transactions } = val;
    const total = transactions.reduce((acc, curr) => {
      const amount = acc + Number(curr.amount);
      return amount;
    }, 0);

    if (total > totalDue) {
      for (let i = 0; i < transactions.length; i++) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Value should be less than due",
          path: [`transactions.${i}.amount`],
        });
      }
    }
  });
