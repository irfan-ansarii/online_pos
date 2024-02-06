import * as z from "zod";

const number = z.any().refine((val) => !isNaN(Number(val)), {
  message: "Enter a valid number",
});

export const customItemValidation = z.object({
  title: z.string().nonempty({ message: "Required" }),
  price: z
    .any()
    .refine((val) => val, { message: "Required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Enter a valid number",
    }),
  taxRate: z
    .any()
    .refine((val) => val, { message: "Required" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Enter a valid number",
    }),
});

export const saleValidation = z
  .object({
    customerId: z.number(),
    billingAddress: z.any(),
    shippingAddress: z.any(),
    employeeId: z.number(),
    createdAt: z.date(),
    lineItems: z
      .object({
        kind: z.enum(["sale", "return"]).default("sale"),
        productId: z.any(),
        variantId: z.any(),
        title: z.string(),
        variantTitle: z.any(),
        sku: z.any(),
        hsn: z.any(),
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
    totalDiscount: number,
    totalTax: number,
    total: number,
    roundedOff: number.default(0),
    invoiceTotal: number,
    transactionKind: z.enum(["sale", "refund"]).default("sale"),
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

export const editSaleValidation = z
  .object({
    id: z.number(),
    customerId: z.number(),
    billingAddress: z.any(),
    shippingAddress: z.any(),
    employeeId: z.number(),
    createdAt: z.date(),
    lineItems: z
      .object({
        itemId: z.union([z.null(), z.number()]),
        kind: z.enum(["sale", "return"]),
        productId: z.any(),
        variantId: z.any(),
        title: z.string(),
        variantTitle: z.string().optional(),
        sku: z.any(),
        hsn: z.any(),
        barcode: z.any(),
        stock: z.any(),
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
    transactionKind: z.enum(["sale", "refund"]).default("sale"),
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
    const { total, transactions, lineItems, totalDue, totalPaid, totalRefund } =
      val;

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
        let msg = "Amount must not be greater than due";
        if (received < 0) {
          msg = "Amount must be greater than 0";
        }
        if (total < 0) {
          msg = "Amount must not be greater than refund";
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

export const collectPayementValidation = z
  .object({
    total: z.number(),
    totalDue: z.number(),
    saleId: z.number(),
    kind: z.string(),
    transactions: z
      .object({
        name: z.string(),
        label: z.string(),
        amount: number.default(0),
      })
      .array(),
  })
  .superRefine((val, ctx) => {
    const { total, transactions } = val;

    const received = transactions.reduce((acc, curr) => {
      acc += Number(curr.amount);
      return acc;
    }, 0);

    if (received > Math.abs(total) || received < 0) {
      for (let i = 0; i < transactions.length; i++) {
        const { amount } = transactions[i];
        let msg = "Amount must not be greater than due";
        if (received < 0) {
          msg = "Amount must be greater than 0";
        }
        if (total < 0) {
          msg = "Amount must not be greater than refund";
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
