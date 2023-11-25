import * as z from "zod";

export const productValidation = z
  .object({
    imageId: z.number().refine((id) => id, {
      message: "Image is required",
    }),
    title: z.string().nonempty({ message: "Title is required" }),
    description: z.string().nonempty({ message: "Description is required" }),
    type: z.enum(["simple", "variable"]),
    status: z.enum(["active", "archived", "trash"]),
    options: z
      .object({
        name: z.string(),
        values: z.array(z.string()),
        value: z.string().optional(),
      })
      .array()
      .optional(),
    variants: z
      .object({
        option: z
          .object({
            name: z.string(),
            value: z.string(),
          })
          .array()
          .nullable(),
        title: z.string(),
        purchasePrice: z.any(),
        salePrice: z.any(),
        sku: z.string().optional(),
        taxRate: z.any(),
      })
      .array()
      .optional(),
    purchasePrice: z.any(),
    salePrice: z.any(),
    sku: z.string(),
    taxRate: z.any(),
  })
  .superRefine((data, ctx) => {
    const { purchasePrice, salePrice, taxRate, sku, type, variants, options } =
      data;
    if (type === "simple") {
      if (!purchasePrice || isNaN(Number(purchasePrice))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: ["purchasePrice"],
        });
      }

      if (!salePrice || isNaN(Number(salePrice))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: ["salePrice"],
        });
      }
      if (!taxRate || isNaN(Number(taxRate))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: ["taxRate"],
        });
      }

      if (!sku) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "SKU is required",
          path: ["sku"],
        });
      }
    } else if (type === "variable") {
      options?.forEach((option, i) => {
        if (!option.name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Option name is required",
            path: [`options.${i}.name`],
          });
        }
        if (!option.values || option.values.length <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Option value is required",
            path: [`options.${i}.value`],
          });
        }
      });

      if (!variants || variants.length <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Variants are required",
          path: ["options", "variants"],
        });
      }

      variants?.forEach((variant, i) => {
        const { purchasePrice, salePrice, taxRate, sku } = variant;
        if (!purchasePrice || isNaN(Number(purchasePrice))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter valid purchase price",
            path: [`variants.${i}.purchasePrice`],
          });
        }
        if (!salePrice || isNaN(Number(salePrice))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter valid sale price",
            path: [`variants.${i}.salePrice`],
          });
        }
        if (!taxRate || isNaN(Number(taxRate))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter valid tax rate",
            path: [`variants.${i}.taxRate`],
          });
        }
        if (!sku || sku.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "SKU is required",
            path: [`variants.${i}.sku`],
          });
        }
      });
    }
  });

export const transferValidation = z
  .object({
    fromId: z.number(),
    toId: z.any().transform(Number),
    lineItems: z
      .object({
        title: z.string().optional(),
        variantTitle: z.string().optional(),
        sku: z.any().optional(),
        price: z.any().optional(),
        quantity: z.any().optional(),
        total: z.any().optional(),
        variantId: z.any().optional(),
        image: z.string().optional(),
      })
      .array()
      .min(1),
    status: z.enum(["pending", "completed"]),
    totalItems: z.number(),
    totalAmount: z.number(),
  })
  .refine((data) => data.fromId !== data.toId, {
    message: "transfer error",
    path: ["toId"],
  });
