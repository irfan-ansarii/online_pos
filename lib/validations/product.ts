import * as z from "zod";

const number = z
  .any()
  .refine((val) => !isNaN(val), {
    message: "Enter a valid number",
  })
  .transform(Number);

export const productValidation = z
  .object({
    title: z.string(),
    description: z.string(),
    type: z.enum(["simple", "variable"]),
    status: z.enum(["active", "archived", "trash"]),
    options: z
      .object({
        name: z.string(),
        values: z.array(z.string()),
        value: z.string().optional(),
      })
      .array(),
    variants: z
      .object({
        option: z
          .object({
            name: z.string(),
            value: z.string(),
          })
          .array(),
        title: z.string(),
        purchasePrice: number,
        salePrice: number,
        sku: z.string(),
        taxRate: number,
      })
      .array(),
    purchasePrice: number,
    salePrice: number,
    sku: z.string().nonempty({ message: "Required" }),
    taxRate: number,
  })
  .refine((data) => {
    if (data.type === "variable") {
      return (
        data.options !== undefined &&
        data.variants !== undefined &&
        data.purchasePrice === undefined &&
        data.salePrice === undefined &&
        data.sku === undefined &&
        data.taxRate === undefined
      );
    } else {
      return data.options === undefined && data.variants === undefined;
    }
  });
