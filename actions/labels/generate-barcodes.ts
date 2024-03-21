"use server";

import fs from "fs";
//@ts-ignore
import bwipjs from "bwip-js";
import jsPDF from "jspdf";
import { getBarcodes } from "../barcode-actions";
import { JsonValue } from "@prisma/client/runtime/library";
import { getOption } from "../option-actions";
import prisma from "@/lib/prisma";
interface LabelItem {
  id: number;
  barcode: string;
  sku: string;
  option: JsonValue;
  title: string;
  price: number;
}

/**
 * helper function to trim the title
 * @param text
 * @param width
 * @param actualWidth
 * @returns
 */
function truncateText(text: string, width: number, actualWidth: number) {
  const ellipsis = "...";
  let truncatedText = text;

  if (actualWidth > width) {
    const ratio = width / actualWidth;
    const truncatedLength = Math.floor(text.length * ratio) - ellipsis.length;
    truncatedText = text.substring(0, truncatedLength) + ellipsis;
  }

  return truncatedText;
}

/**
 *
 * @returns
 */
async function generateBarcodeList() {
  const list: any[] = [];

  let page: number | undefined = 1;

  do {
    const { data, pagination } = await getBarcodes({
      page: page.toString(),
      status: "pending",
    });

    data.forEach((label) => {
      const labelItem: LabelItem = {
        id: label.id,
        barcode: label?.variant?.barcode!,
        sku: label.variant.sku!,
        option: label.variant.option || [],
        title: label.product.title,
        price: label.variant.purchasePrice,
      };

      for (let i = 0; i < label.quantity; i++) {
        list.push(labelItem);
      }
    });

    page = page === pagination.pageCount ? undefined : page + 1;
  } while (page !== undefined);

  return list;
}

/**
 *
 * @param doc
 * @param barcodeconfig
 * @param labelItem
 * @param x
 * @param y
 * @returns
 */
async function renderBarcode(
  doc: jsPDF,
  config: any,
  labelItem: LabelItem,
  x: number,
  y: number
) {
  const { width, height, top, bottom, left, right, columns, gap } = config;
  const { barcode, sku, title, price, option = [] } = labelItem;

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");

  /** draw barcode */
  const barcodeconfig = {
    bcid: "code128",
    text: barcode || sku,
    scale: 5,
    height: 10,
  };

  const generatedBarcode = await bwipjs.toBuffer(barcodeconfig);

  const barcodeWidth = (width - gap * (columns - 1)) / columns - (left + right);

  doc.addImage(generatedBarcode, x, y, barcodeWidth, 8);

  y += 10;

  /** calculate barcode characters width */
  let charX = x;
  const totalWidth = Array.from(barcode).reduce((acc, curr) => {
    const { w } = doc.getTextDimensions(curr);
    acc += w;
    return acc;
  }, 0);

  /** draw barcode characters */
  const space = (barcodeWidth - totalWidth) / (barcode.length - 1);

  Array.from(barcode).forEach((item) => {
    const { w } = doc.getTextDimensions(item);
    doc.text(item, charX, y);
    charX += w + space;
  });

  /** draw product title */
  y += 4;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");

  const w = doc.getTextWidth(title);
  const finalText = truncateText(title, barcodeWidth, w);
  doc.text(finalText, x, y);

  /** draw product options */
  doc.setFont("helvetica", "normal");
  y += 3.5;

  //@ts-ignore
  option?.forEach((opt) => {
    const textWidth = doc.getTextWidth(opt?.name);
    doc.text(`${opt?.name}:`, x, y);
    doc.text(opt?.value, x + textWidth + 2, y);

    y += 3.5;
  });

  /** draw price */
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const priceWidth = doc.getTextWidth(price?.toFixed(2));
  x += barcodeWidth - priceWidth;
  doc.text(price?.toFixed(2), x, height - bottom);

  /** draw price symbol !!INR */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("INR", x - 4.5, height - bottom);

  return y;
}

/**
 * print barcode
 */
export async function printBarcode() {
  const filePath = `public/files/label.pdf`;

  const { data }: any = await getOption("barcodeLabel");

  if (!data || !data.value) {
    throw new Error("Database Error");
  }

  const config = {
    width: parseFloat(data.value?.width),
    height: parseFloat(data.value?.height),
    columns: parseInt(data.value?.columns),
    gap: parseInt(data.value?.gap),
    top: parseInt(data.value?.top),
    bottom: parseInt(data.value?.bottom),
    left: parseInt(data.value?.left),
    right: parseInt(data.value?.right),
  };

  const doc = new jsPDF({
    orientation: "l",
    unit: "mm",
    format: [config.width, config.height],
  });

  const barcodeList = await generateBarcodeList();

  if (barcodeList.length === 0) {
    throw new Error("No barcode available for printing.");
  }

  const ids = [];

  // increament the loop by number of columns
  for (let j = 0; j < barcodeList.length; j += config.columns) {
    if (j > 0) {
      doc.addPage();
    }

    for (let i = 0; i < config.columns; i++) {
      const labelIndex = j + i;

      if (labelIndex < barcodeList.length) {
        const labelItem = barcodeList[labelIndex];
        const columnWidth =
          (config.width - config.gap * (config.columns - 1)) / config.columns;

        const x = i * (columnWidth + config.gap);

        await renderBarcode(
          doc,
          config,
          labelItem,
          x + config.left,
          config.top
        );
        ids.push(labelItem.id);
      }
    }
  }

  // save the file
  const byte = await doc.output("arraybuffer");
  const buffer = Buffer.from(byte);
  fs.writeFileSync(filePath, buffer);

  // change the status to printed
  await prisma.label.updateMany({
    where: {
      id: { in: ids },
    },
    data: {
      status: "printed",
    },
  });

  // return the url of the label
  return filePath.replace("public", "");
}
