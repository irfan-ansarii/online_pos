import * as z from "zod";

const number = z.any().refine((val) => !isNaN(Number(val)), {
  message: "Enter a valid number",
});

export const purchaseValidation = z
  .object({
    title: z.string().nonempty({ message: "Required" }),
    supplierId: z.number(),
    createdAt: z.date(),
    lineItems: z
      .object({
        kind: z.enum(["purchase", "return"]).default("purchase"),
        productId: z.any(),
        variantId: z.any(),
        title: z.string(),
        variantTitle: z.any(),
        sku: z.any(),
        barcode: z.any(),
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
    totalDiscount: number,
    totalTax: number,
    total: number,
    roundedOff: number.default(0),
    invoiceTotal: number,
    transactionKind: z.enum(["purchase", "refund"]).default("purchase"),
    totalDue: number,
    taxLines: z.any(),
    purchaseType: z.enum(["state", "inter_state"]),
    transactions: z
      .object({
        name: z.string(),
        label: z.string(),
        refrenceNumber: z.any(),
        amount: number,
      })
      .array()
      .optional(),
  })
  .superRefine((val, ctx) => {
    const { total, transactions, lineItems } = val;

    for (let i = 0; i < lineItems.length; i++) {
      const { totalDiscount } = lineItems[i];
      if (totalDiscount < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount must get greater than 0",
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

    if (received > Math.abs(total) || received < 0) {
      for (let i = 0; i < transactions.length; i++) {
        const { amount } = transactions[i];
        let msg = "Amount must be less than due";
        if (received < 0) {
          msg = "Amount must be greater than 0";
        }
        if (total < 0) {
          msg = "Amount must be less than refund";
        }

        if (amount !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msg,
            path: [`transactions.${i}.amount`],
          });
        }
      }
    }
  });

export const editPurchaseValidation = z
  .object({
    id: z.number(),
    title: z.string().nonempty({ message: "Required" }),
    supplierId: z.number(),
    createdAt: z.date(),
    lineItems: z
      .object({
        itemId: z.union([z.null(), z.number()]),
        kind: z.enum(["purchase", "return"]),
        productId: z.any(),
        variantId: z.any(),
        title: z.string(),
        variantTitle: z.any(),
        sku: z.any(),
        barcode: z.any(),
        imageSrc: z.any(),
        price: number,
        originalKind: z.union([z.null(), z.string()]),
        originalQuantity: z.union([z.null(), z.number()]),
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
    totalDiscount: number,
    totalTax: number,
    total: number,
    roundedOff: number.default(0),
    invoiceTotal: number,
    totalPaid: z.number(),
    totalRefund: z.number(),
    transactionKind: z.enum(["purchase", "refund"]).default("purchase"),
    totalDue: number,
    taxLines: z.any(),
    purchaseType: z.enum(["state", "inter_state"]),
    transactions: z
      .object({
        name: z.string(),
        label: z.string(),
        refrenceNumber: z.any(),
        amount: number,
      })
      .array()
      .optional(),
  })
  .superRefine((val, ctx) => {
    const { total, transactions, lineItems, totalPaid, totalRefund } = val;

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
    const tempDue = total + totalRefund - totalPaid;

    if (received > Math.abs(tempDue) || received < 0) {
      for (let i = 0; i < transactions.length; i++) {
        const { amount } = transactions[i];
        let msg = "Amount must be less than due";
        if (received < 0) {
          msg = "Amount must be greater than 0";
        }
        if (total < 0) {
          msg = "Amount must be less than refund";
        }

        if (amount !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msg,
            path: [`transactions.${i}.amount`],
          });
        }
      }
    }
  });

//! fix this

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
