"use server";

import prisma from "@/lib/prisma";
import { LineItem, Sale } from "@prisma/client";
import { TextOptionsLight, jsPDF } from "jspdf";
import { format } from "date-fns";
//@ts-ignore
import bwipjs from "bwip-js";
import sharp from "sharp";
import fs from "fs";

export async function printBarcode() {
  const filePath = `public/files/label.pdf`;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [115, 175],
  });

  const barcodeOptions = {
    bcid: "code128",
    text: "GN6475675",
    scale: 5,
    textxalign: "center",
    height: 10,
  };

  let y = 5;

  for (let i = 0; i < 6; i++) {
    const barcode = await bwipjs.toBuffer(barcodeOptions);
    doc.setFont("helvetica", "normal");
    const { width, height } = await sharp(barcode).metadata();

    const code = "GN005463";
    let x = 5;
    doc.addImage(barcode, 5, y, 50, 10);
    doc.setFontSize(6);

    const totalWidth = Array.from(code).reduce((acc, curr) => {
      const { w } = doc.getTextDimensions(curr);
      return (acc += w);
    }, 0);

    const space = (50 - totalWidth) / (code.length - 1);

    Array.from(code).forEach((item) => {
      const { w } = doc.getTextDimensions(item);
      doc.text(item, x, y + 12);

      x += w + space;
    });

    doc.setFontSize(8);
    y += 13;

    doc.setFont("helvetica", "bold");
    doc.text("Khushboo peplum shararafghdf dg set...", 5, y + 4);
    doc.setFont("helvetica", "normal");
    doc.text("Size:", 5, y + 7.5);
    doc.text("Color:", 5, y + 11);
    doc.text("S", 14, y + 7.5);
    doc.text("Green", 14, y + 11);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");

    doc.text("INR 1,290.00", 35, y + 10.5);

    y += 16;
  }

  const byte = doc.output("arraybuffer");
  const buffer = Buffer.from(byte);

  fs.writeFileSync(filePath, buffer);
}
