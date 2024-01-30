import * as z from "zod";

export const productValidation = z
  .object({
    imageId: z.number().refine((id) => id, {
      message: "Required",
    }),
    imageSrc: z.any(),
    title: z.string().nonempty({ message: "Required" }),
    description: z.string().nonempty({ message: "Required" }),
    type: z.enum(["simple", "variable"]),
    status: z.enum(["active", "archived", "trash"]).default("active"),
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
        hsn: z.any(),
        taxRate: z.any(),
      })
      .array()
      .optional(),
    purchasePrice: z.any(),
    salePrice: z.any(),
    sku: z.any(),
    hsn: z.any(),
    taxRate: z.any(),
  })
  .superRefine((data, ctx) => {
    validate(data, ctx);
  });

export const editProductValidation = z
  .object({
    id: z.number(),
    imageId: z.number().refine((id) => id, {
      message: "Required",
    }),
    imageSrc: z.any(),
    title: z.string().nonempty({ message: "Required" }),
    description: z.string().nonempty({ message: "Required" }),
    type: z.enum(["simple", "variable"]),
    status: z.enum(["active", "archived", "trash"]),
    options: z
      .object({
        name: z.string(),
        values: z.array(z.string()),
      })
      .array()
      .optional(),
    variants: z
      .object({
        itemId: z.any(),
        option: z.any(),
        title: z.string(),
        purchasePrice: z.any(),
        salePrice: z.any(),
        sku: z.string().optional(),
        hsn: z.string(),
        taxRate: z.any(),
      })
      .array()
      .optional(),
    option: z.any(),
    itemId: z.any(),
    variantTitle: z.any(),
    purchasePrice: z.any(),
    salePrice: z.any(),
    sku: z.any(),
    hsn: z.any(),
    taxRate: z.any(),
  })
  .superRefine((data, ctx) => {
    validate(data, ctx);
  });

const validate = (data: any, ctx: z.RefinementCtx) => {
  const { purchasePrice, salePrice, taxRate, type, variants, hsn, options } =
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
    if (!hsn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required",
        path: ["hsn"],
      });
    }
  } else if (type === "variable") {
    options?.forEach((option: any, i: number) => {
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

    variants?.forEach((variant: any, i: number) => {
      const { purchasePrice, salePrice, taxRate, hsn } = variant;
      if (!purchasePrice || isNaN(Number(purchasePrice))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: [`variants.${i}.purchasePrice`],
        });
      }
      if (!salePrice || isNaN(Number(salePrice))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: [`variants.${i}.salePrice`],
        });
      }
      if (!taxRate || isNaN(Number(taxRate))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: [`variants.${i}.taxRate`],
        });
      }
      if (!hsn) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Required",
          path: [`variants.${i}.hsn`],
        });
      }
    });
  }
};
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
      barcode: z.any().optional(),
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
      barcode: z.any().optional(),
      quantity: z
        .any()
        .refine((n: any) => !isNaN(n), { message: "Enter valid number" }),
      imageSrc: z.any(),
    })
    .array()
    .min(1),
  reason: z.string().nonempty({ message: "Required" }),
  notes: z.string().nonempty({ message: "Required" }),
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
      barcode: z.any(),
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
