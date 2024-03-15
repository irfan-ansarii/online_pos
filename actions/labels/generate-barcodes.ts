"use server";

import fs from "fs";
//@ts-ignore
import bwipjs from "bwip-js";
import jsPDF from "jspdf";
import { getBarcodes } from "../barcode-actions";
import { JsonValue } from "@prisma/client/runtime/library";

interface LabelItem {
  barcode: string;
  sku: string;
  option: JsonValue;
  title: string;
  price: number;
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
        barcode: label?.variant?.barcode || "GN547647",
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
  const { width, height, margin, columns } = config;
  const { barcode, sku, title, price, option = [] } = labelItem;

  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");

  /** draw barcode */
  const barcodeconfig = {
    bcid: "code128",
    text: barcode || sku || "gdhgdf",
    scale: 5,
    height: 10,
  };

  const generatedBarcode = await bwipjs.toBuffer(barcodeconfig);

  const barcodeWidth = width / columns - margin.left - margin.right;

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
  doc.text(title, x, y);

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
  doc.text(price?.toFixed(2), x, height - margin.bottom);

  /** draw price symbol !!INR */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text("INR", x - 4.5, height - margin.bottom);

  return y;
}

/**
 *
 */
export async function printBarcode() {
  const filePath = `public/files/label.pdf`;

  const config = {
    width: 76,
    height: 25,
    columns: 2,
    margin: {
      top: 2,
      right: 2,
      bottom: 2,
      left: 2,
    },
  };

  const doc = new jsPDF({
    orientation: "l",
    unit: "mm",
    format: [config.width, config.height],
  });

  const barcodeList = await generateBarcodeList();

  for (let j = 0; j < barcodeList.length; j += config.columns) {
    if (j > 0) {
      doc.addPage();
    }

    for (let i = 0; i < config.columns; i++) {
      const labelIndex = j + i;

      if (labelIndex < barcodeList.length) {
        const labelItem = barcodeList[labelIndex];

        const x = i * (config.width / config.columns) + config.margin.left;

        await renderBarcode(doc, config, labelItem, x, config.margin.top);
      }
    }
  }

  const byte = await doc.output("arraybuffer");
  const buffer = Buffer.from(byte);

  await fs.writeFileSync(filePath, buffer);
}
