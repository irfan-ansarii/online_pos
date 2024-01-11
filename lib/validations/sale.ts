import * as z from "zod";

const number = z.any().refine((val) => !isNaN(Number(val)), {
  message: "Enter a valid number",
});

export const saleValidation = z
  .object({
    id: z.union([z.null(), z.number()]),
    customerId: z.number(),
    employeeId: z.number(),
    createdAt: z.date(),
    lineItems: z
      .object({
        itemId: z.union([z.null(), z.number()]),
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
        beforeDiscount: number,
        lineTotal: number,
        totalDiscount: number,
        taxRate: number,
        taxableValue: number,
        totalTax: number,
        taxLines: z.any(),
        total: number,
      })
      .array()
      .nonempty(),
    taxType: z.enum(["included", "excluded"]),
    subtotal: number,
    lineItemsTotal: number,
    totalDiscount: number,
    totalTax: number,
    total: number,
    roundedOff: number.default(0),

    totalPaid: z.union([z.any(), number]),
    totalRefund: z.union([z.any(), number]),
    invoiceTotal: z.union([z.any(), number]),

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
  })
  .superRefine((val, ctx) => {
    const {
      total,
      transactions,
      totalRefund = 0,
      totalPaid = 0,
      lineItems,
    } = val;

    for (let i = 0; i < lineItems.length; i++) {
      const { price, quantity, totalDiscount } = lineItems[i];
      if (Math.abs(totalDiscount) > Math.abs(price * quantity)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Invalid value",
          path: [`lineItems.${i}.totalDiscount`],
        });
      }
    }

    if (!transactions || !Array.isArray(transactions)) {
      return;
    }

    const received = transactions.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );

    const dueAmount = total + Number(totalRefund) - totalPaid;

    if (received > Math.abs(dueAmount) || received < 0) {
      for (let i = 0; i < transactions.length; i++) {
        const { amount } = transactions[i];
        if (amount !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid value",
            path: [`transactions.${i}.amount`],
          });
        }
      }
    }
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
