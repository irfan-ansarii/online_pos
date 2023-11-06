import * as z from "zod";

const number = z.any().refine((v) => (v ? !isNaN(v) : undefined));

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
        purchasePrice: number,
        salePrice: number,
        sku: z.string(),
        taxRate: number,
      })
      .array()
      .optional(),
    purchasePrice: number.optional(),
    salePrice: number.optional(),
    sku: z.string(),
    taxRate: number.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "simple") {
      const { purchasePrice, salePrice, taxRate, sku } = data;

      if (!purchasePrice || isNaN(purchasePrice)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: ["purchasePrice"],
        });
      }
      if (!salePrice || isNaN(salePrice)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter valid number",
          path: ["salePrice"],
        });
      }
      if (!taxRate || isNaN(taxRate)) {
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
    } else if (data.type === "variable") {
      data.options?.forEach((option, i) => {
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

      if (!data.variants || data.variants.length <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Variants are required",
          path: ["options", "variants"],
        });
      }
    }
  });
