import * as z from "zod";

const number = z.any().refine((val) => !isNaN(Number(val)), {
  message: "Enter a valid number",
});

export const barcodeValidation = z.object({
  key: z.string(),
  width: number,
  height: number,
  columns: number,
  gap: number,
  top: number,
  bottom: number,
  left: number,
  right: number,
});
