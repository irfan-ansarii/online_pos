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
    sku: z.any(),
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
        const { purchasePrice, salePrice, taxRate } = variant;
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
      });
    }
  });

export const transferValidation = z.object({
  toId: z.string().nonempty(),
  lineItems: z
    .object({
      itemId: z.number(),
      productId: z.number(),
      variantId: z.number(),
      title: z.string().optional(),
      variantTitle: z.string().nullable(),
      sku: z.any().optional(),
      barcode: z.number(),
      price: z.number(),
      quantity: z.number(),
      total: z.number(),
      imageSrc: z.any(),
    })
    .array()
    .min(1),
  totalItems: z.number(),
  totalAmount: z.number(),
});

export const adjustmentValidation = z.object({
  locationId: z.number().optional(),
  lineItems: z
    .object({
      itemId: z.number(),
      productId: z.number(),
      variantId: z.number(),
      title: z.any(),
      variantTitle: z.any(),
      sku: z.any().optional(),
      barcode: z.any(),
      quantity: z
        .union([z.string(), z.number()])
        .refine((n: any) => !isNaN(n), { message: "Enter valid number" }),
      imageSrc: z.any(),
    })
    .array()
    .min(1),
  reason: z.string().min(1, { message: "Required" }),
  note: z.any(),
});

export const barcodeValidation = z.object({
  lineItems: z
    .object({
      itemId: z.number(),
      productId: z.number(),
      variantId: z.number(),
      title: z.string().optional(),
      variantTitle: z.any().optional(),
      sku: z.any().optional(),
      barcode: z.number(),
      quantity: z
        .union([z.string(), z.number()])
        .refine((n: any) => !isNaN(n), { message: "Enter valid number" }),
      imageSrc: z.any().optional(),
    })
    .array()
    .min(1),
});
export const editBarcodeValidation = z.object({
  id: z.number(),
  quantity: z
    .union([z.string(), z.number()])
    .refine((n: any) => !isNaN(n), { message: "Enter valid number" }),
  status: z.string(),
});
