"use server";
import fs from "fs";
//@ts-ignore
import bwipjs from "bwip-js";
import jsPDF from "jspdf";
import sharp from "sharp";
import { getBarcodes } from "./barcode-actions";

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
      const labelItem = {
        barcode: label?.variant?.barcode || "GN547647",
        sku: label.variant.sku,
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
 * @param barcodeOptions
 * @param code
 * @param x
 * @param y
 * @returns
 */
async function renderBarcode(
  doc: jsPDF,
  options: any,
  labelItem: any,
  x: number,
  y: number
) {
  const { width, margin, gap, columns } = options;
  const { barcode, sku, title, price, option } = labelItem;
  console.log(barcode);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");

  const barcodeOptions = {
    bcid: "code128",
    text: barcode || sku || "gdhgdf",
    scale: 5,
    height: 10,
  };
  // console.log(labelItem);

  const generatedBarcode = await bwipjs.toBuffer(barcodeOptions);

  const barcodeWidth = (width - margin.left - margin.right) / columns;

  doc.addImage(generatedBarcode, x, y, barcodeWidth, 8);

  y += 10;

  // draw barcode characters
  let charX = x;
  const totalWidth = Array.from(barcode).reduce((acc, curr) => {
    const { w } = doc.getTextDimensions(curr);
    acc += w;
    return acc;
  }, 0);

  const space = (barcodeWidth - totalWidth) / (barcode.length - 1);

  Array.from(barcode).forEach((item) => {
    const { w } = doc.getTextDimensions(item);
    doc.text(item, charX, y);
    charX += w + space;
  });
  y += 4;
  doc.setFontSize(8);

  doc.setFont("helvetica", "bold");
  doc.text(title, x, y);
  doc.setFont("helvetica", "normal");
  y += 3.5;
  doc.text("Size:", x, y);
  doc.text("S", x + 14, y);
  y += 3.5;
  doc.text("Color:", x, y);
  doc.text("S", x + 14, y);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  const priceWidth = doc.getTextWidth(price?.toFixed(2));
  x += barcodeWidth - priceWidth;

  doc.text(price?.toFixed(2), x, y);

  return y;
}

/**
 *
 */
export async function printBarcode() {
  const filePath = `public/files/label.pdf`;
  const options = {
    width: 150,
    height: 25,
    columns: 3,
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
    format: [options.width, options.height],
  });

  const barcodeList = await generateBarcodeList();

  let yOffset = options.margin.left;
  let j = 0;

  for (let j = 0; j < barcodeList.length; j += options.columns) {
    if (j > 0) {
      doc.addPage();
    }

    for (let i = 0; i < options.columns; i++) {
      const labelIndex = j + i;

      if (labelIndex < barcodeList.length) {
        const labelItem = barcodeList[labelIndex];
        const x = i * (options.width / options.columns);
        console.log(x);
        await renderBarcode(doc, options, labelItem, x, options.margin.top);
      }
    }
  }

  const byte = await doc.output("arraybuffer");
  const buffer = Buffer.from(byte);

  await fs.writeFileSync(filePath, buffer);
}
