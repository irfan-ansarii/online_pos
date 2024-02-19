"use server";

import prisma from "@/lib/prisma";
import { LineItem, Sale } from "@prisma/client";
import { TextOptionsLight, jsPDF } from "jspdf";
import { format } from "date-fns";
//@ts-ignore
import bwipjs from "bwip-js";
import sharp from "sharp";
import fs from "fs";

const lineColor = "#D7DAE0";
const headingColor = "#141414";
const bodyColor = "#595959";

interface Options {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}
interface TextOptions {
  width?: number;
  align?: string;
  style?: string;
  weight?: string;
  size?: number;
  color?: string;
  baseline?: TextOptionsLight;
  url?: string;
  underline?: boolean;
}

interface FontProps {
  weight: string;
  size: number;
  color: string;
  style: string;
}

/**
 * set font, font-weight, font-style and font-size
 */
function setFont(doc: jsPDF, options: FontProps) {
  const { weight, size, color, style } = options;
  doc.setFont("helvetica", style, weight);
  doc.setFontSize(size);
  doc.setTextColor(color);
}

/**
 * draw text
 */
function drawText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options: TextOptions
) {
  const {
    width = 128,
    align = "left",
    style = "normal",
    weight = "normal",
    size = 7,
    color = bodyColor,
    baseline = "bottom",
    ...rest
  } = options;

  setFont(doc, { weight, size, color, style });

  const { w, h } = doc.getTextDimensions(text);
  if (align === "center") {
    x = x + width / 2 - w / 2;
  }
  if (align === "right") {
    x = x + width - w;
  }
  const finalText = truncateText(text, width, w);
  doc.text(finalText, x, y + h, {
    //@ts-ignore
    baseline,
    ...rest,
  });
}

/** truncate text */
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
 * create template
 */
async function createTemplate(
  doc: jsPDF,
  page = 1,
  options: Options,
  sale: Sale
) {
  const { width, right, left } = options;

  doc.setDrawColor(lineColor);

  doc.setPage(page);

  await drawHeader(doc, sale.title, options);

  doc.line(left, 30, width - right, 30);

  drawCompanyDetails(doc, options);

  //@ts-ignore
  drawCustomerDetails(doc, sale, options);

  drawInvoiceDetails(doc, { title: sale.title, date: sale.createdAt }, options);

  // table header
  doc.line(left, 65, width - right, 65);
  drawTableHeader(doc, options);
  doc.line(left, 75, width - right, 75);

  doc.line(left, 155, width - right, 155);

  await drawFooter(doc, options);
}

/**
 * draw header
 * @param doc
 * @param options
 */
async function drawHeader(doc: jsPDF, title: string, options: Options) {
  const { width, top, right, bottom, left } = options;

  // Barcode options
  const barcodeOptions = {
    bcid: "code128",
    text: title,
    scale: 5,
    height: 10,
  };

  const barcode = await bwipjs.toBuffer(barcodeOptions);

  doc.addImage(barcode, width - (right + 40), 18, 40, 10);

  try {
    const logo = fs.readFileSync("public/assets/logo.png");

    const metadata = await sharp(logo).metadata();

    const { width: logoWidth, height: logoHeight } = metadata;
    let newHeight = 40;

    if (logoWidth && logoHeight) {
      newHeight = 44 / (logoWidth / logoHeight);
    }

    doc.addImage(logo, left, top, 44, newHeight);
  } catch (error) {
    drawText(doc, "Goldy's Nestt", left, top, {
      weight: "bold",
      size: 18,
      color: headingColor,
    });
  }

  drawText(doc, "INVOICE", left, top, {
    width: width - (left + right),
    weight: "bold",
    align: "right",
    size: 15,
    color: headingColor,
  });
}

/**
 * draw company details
 * @param {*} doc
 */
function drawCompanyDetails(doc: jsPDF, options: Options) {
  const { left } = options;

  const addresses = [
    "Goldy's Nestt",
    "M-12, Greater Kailash - 1",
    "New Delhi - 110048",
    "GSTIN: 07AAQPK9016Q1ZW",
  ];

  drawText(doc, "Sold By:", left, 35, {
    weight: "bold",
    color: headingColor,
  });

  let y = 40;
  addresses.forEach((address) => {
    drawText(doc, address, left, y, {});
    y += 3.5;
  });
}

/**
 * draw customer details
 * @param {*} doc
 */
function drawCustomerDetails(doc: jsPDF, sale: any, options: Options) {
  const { left, right, width } = options;
  const x = (38 / 100) * (width - (left + right));

  const { billingAddress = [], shippingAddress = [] } = sale;

  drawText(doc, "Billed To:", x, 35, {
    weight: "bold",
    color: headingColor,
  });

  let y = 40;

  for (const address of billingAddress) {
    if (typeof address === "string" && address.length > 0) {
      drawText(doc, address, x, y, {});
      y += 3.5;
    }
  }
}

/**
 * draw invoice details
 * @param {*} doc
 */
function drawInvoiceDetails(doc: jsPDF, invoice: any, options: Options) {
  const { left, width, right } = options;
  const { title, date } = invoice;
  const x = (38 / 100) * (width - (left + right)) * 2;

  drawText(doc, "Invoice Number:", x, 35, {
    weight: "bold",
    color: headingColor,
  });

  drawText(doc, title, x, 39, {});

  drawText(doc, "Invoice Date:", x, 45, {
    weight: "bold",
    color: headingColor,
  });

  drawText(doc, format(date, "dd-MM-yyyy hh:mm:ss a"), x, 49, {});
}

/**
 * draw footer
 * @param doc
 * @param options
 */
async function drawFooter(doc: jsPDF, options: Options) {
  const { width, height, right, bottom, left } = options;
  const y = height - (bottom + 4);
  // footer
  doc.line(left, height - (bottom + 8), width - right, height - (bottom + 8));

  let x = left;

  const conditions = [
    "- No returns accepted.",
    "- Exchange within 7 days with a valid invoice and intact price tags",
    "- Store credit only; no cash refunds.",
    "- All exchanges subject to inspection.",
  ];
  drawText(doc, "Terms and Conditions:", left, 160, {
    color: headingColor,
    weight: "bold",
  });

  let yPos = 165;
  conditions.forEach((cond) => {
    drawText(doc, cond, left, yPos, {});
    yPos += 3.5;
  });

  x = left;
  const footerText = [
    { text: "For Goldy's Nestt", url: "" },
    { text: "+91-9871640395", url: "tel:+919871640395" },
    {
      text: "saleshelp@goldysnestt.com",
      url: "mailto:saleshelp@goldysnestt.com",
    },
  ];

  const totalWidth = footerText.reduce((acc, curr) => {
    const { w } = doc.getTextDimensions(curr.text);

    return (acc += w);
  }, 0);

  const space = (width - left - right - totalWidth) / (footerText.length - 1);

  footerText.forEach((item) => {
    const { w } = doc.getTextDimensions(item.text);
    drawText(doc, item.text, x, y, {
      url: item.url,
      underline: true,
    });

    x += w + space;
  });
}

/**
 * draw table header
 * @param {*} doc
 * @param {*} options
 */

function drawTableHeader(doc: jsPDF, options: Options) {
  const { width, right, left } = options;
  let x = left;

  const colWitdh = ((60 / 100) * (width - (left + right))) / 5;

  const columns = [
    { text: "S.NO.", width: 10 },
    { text: "DESCRIPTION", width: (40 / 100) * (width - (left + right)) - 10 },
    { text: "HSN CODE", width: colWitdh, align: "right" },
    { text: "PRICE", width: colWitdh, align: "right" },
    { text: "QUANTITY", width: colWitdh, align: "right" },
    { text: "TAX", width: colWitdh, align: "right" },
    { text: "TOTAL", width: colWitdh, align: "right" },
  ];

  columns.forEach(({ text, width, align }) => {
    drawText(doc, text, x, 68, {
      width: width,
      color: headingColor,
      weight: "bold",
      align,
    });

    x += width;
  });
}

/**
 * draw table rows
 * @param {*} doc
 * @param {*} data
 * @param {*} options
 */
function drawTableRow(doc: jsPDF, rows: LineItem[], options: Options) {
  rows.forEach((columns: any, i) => {
    let y = 75 + i * 10;
    let x = options.left;

    // @ts-ignore
    columns.forEach(({ text, subtext, width, align, color }) => {
      drawText(doc, text, x, y + 2, {
        width: width,
        align,
        color,
      });
      if (subtext) {
        drawText(doc, subtext, x, y + 5.5, {
          width: width,
          align,
          size: 6,
        });
      }

      doc.line(options.left, y, options.width - options.right, y);
      x += width;
    });
  });
}

/**
 * draw total
 * @param doc
 * @param data
 * @param options
 */
function drawTableTotal(doc: jsPDF, data: Sale, options: Options) {
  const { width, right, left } = options;

  const { subtotal, totalDiscount, roundedOff, total, taxLines = [] } = data;
  let y = 161;

  const totals = [
    [{ text: "SUBTOTAL" }, { text: subtotal.toFixed(2), align: "right" }],
  ];

  if (totalDiscount > 0) {
    totals.push([
      { text: "DISCOUNT" },
      { text: `-${totalDiscount.toFixed(2)}`, align: "right" },
    ]);
  }

  //@ts-ignore
  taxLines?.forEach((tax: any) => {
    totals.push([
      { text: tax.title },
      { text: tax.amount.toFixed(2), align: "right" },
    ]);
  });

  if (roundedOff > 0) {
    totals.push([
      { text: "ROUNDED OFF" },
      { text: roundedOff.toFixed(2), align: "right" },
    ]);
  }

  totals.forEach((row) => {
    let x = width - left - 50;

    row.forEach(({ text, align }) => {
      drawText(doc, text, x, y - 4.5, {
        align,
        width: 25,
        color: headingColor,
      });

      x += 25;
    });

    doc.line(width - left - 50, y, width - right, y);
    y += 6;
  });

  doc.line(width - left - 50, y - 6, width - right, y - 6);

  drawText(doc, "TOTAL", width - left - 50, y - 3.5, {
    width: 25,
    color: headingColor,
    weight: "bold",
  });

  drawText(doc, total.toFixed(2), width - left - 25, y - 3.5, {
    width: 25,
    color: headingColor,
    weight: "bold",
    align: "right",
  });

  doc.line(width - left - 50, y + 2, width - right, y + 2);
}

/**
 * create invoice
 * @param {*} saleId
 */
let loading = false;
export async function generateSaleInvoice(saleId: number) {
  if (loading) {
    console.log("loading");
    return;
  }
  try {
    loading = true;
    const options = {
      width: 148,
      height: 210,
      top: 5,
      right: 5,
      bottom: 5,
      left: 5,
    };
    const { width, height, left, right } = options;

    const sale = await prisma.sale.findFirst({
      where: { id: saleId },
      include: { lineItems: true, customer: { include: { location: true } } },
    });

    if (!sale) return;

    const filePath = `public/files/sale/${sale.id}.pdf`;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [width, height],
    });

    const colWitdh = ((60 / 100) * (width - (left + right))) / 5;

    const lineItems = sale.lineItems.map((item, i) => [
      {
        text: `${i + 1}`,
        width: 10,
      },
      {
        text: item.title,
        subtext:
          item.variantTitle?.toLocaleLowerCase() !== "default"
            ? item.variantTitle
            : "",
        width: (40 / 100) * (width - (left + right)) - 10,
        color: headingColor,
      },
      {
        text: item.hsn ? item.hsn : "",
        width: colWitdh,
        align: "right",
      },
      {
        text: item.price.toFixed(2),
        subtext:
          item.totalDiscount > 0 ? `-${item.totalDiscount.toFixed(2)}` : "",
        width: colWitdh,
        align: "right",
      },
      {
        text: `${item.quantity}`,
        width: colWitdh,
        align: "right",
      },
      {
        text: item.totalTax.toFixed(2),
        width: colWitdh,
        align: "right",
      },
      {
        text: item.total.toFixed(2),
        width: colWitdh,
        align: "right",
      },
    ]);

    const itemsPerPage = 8;
    const pages = Math.ceil(lineItems.length / itemsPerPage);

    for (let i = 1; i <= pages; i++) {
      // add page
      if (i > 1) {
        doc.addPage();
      }

      await createTemplate(doc, i, options, sale);

      const startIdx = (i - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const pageItems = lineItems.slice(startIdx, endIdx);

      //@ts-ignore
      drawTableRow(doc, pageItems, options);
      drawTableTotal(doc, sale, options);
    }

    const pdfBytes = doc.output("arraybuffer");
    const buffer = Buffer.from(pdfBytes);

    fs.writeFileSync(filePath, buffer);

    return filePath.replace("public", "");
  } catch (error: any) {
    throw new Error(error.message);
  } finally {
    loading = false;
  }
}
