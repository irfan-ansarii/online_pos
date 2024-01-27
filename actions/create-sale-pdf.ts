"use server";

import prisma from "@/lib/prisma";

import { TextOptionsLight, jsPDF } from "jspdf";
//@ts-ignore
import bwipjs from "bwip-js";
import sharp from "sharp";
import fs from "fs";
import { Sale, User } from "@prisma/client";
import { format } from "date-fns";

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
    size = 8,
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

  drawCustomerDetails(doc, sale.customer, options);

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
  const { width, top, right, left } = options;

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
    const logo = fs.readFileSync("public/assets/logo.jpg");

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
    size: 18,
  });
}

/**
 * draw footer
 * @param doc
 * @param options
 */
async function drawFooter(doc: jsPDF, options: Options) {
  const { width, height, right, bottom, left } = options;
  // footer
  doc.line(left, height - (bottom + 5), width - right, height - (bottom + 5));

  drawText(doc, "For Goldy's Nestt", left, height - (bottom + 4), {
    width: width - (left + right),
  });

  drawText(doc, "saleshelp@goldysnestt.com", left, height - (bottom + 4), {
    width: width - (left + right),
    align: "right",
  });

  drawText(doc, "+91-9871640395", 70, height - (bottom + 4), {
    url: "tel:+91-9871640395",
    underline: true,
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
    style: "italic",
    weight: "bold",
    color: headingColor,
  });
  let y = 40;
  addresses.forEach((address) => {
    drawText(doc, address, left, y, {
      style: "italic",
    });
    y += 3.5;
  });
}

/**
 * draw customer details
 * @param {*} doc
 */
function drawCustomerDetails(doc: jsPDF, customer: any, options: Options) {
  const { left, right, width } = options;
  const x = (38 / 100) * (width - (left + right));

  const { firstName, lastName, phone, email } = customer;

  const billing = [
    `${firstName}${lastName ? ` ${lastName}` : ""}`,
    phone,
    email,
  ];

  drawText(doc, "Billed To:", x, 35, {
    style: "italic",
    weight: "bold",
    color: headingColor,
  });

  let y = 40;
  billing.forEach((address) => {
    drawText(doc, address, x, y, {
      style: "italic",
    });
    y += 3.5;
  });
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
    style: "italic",
    weight: "bold",
    color: headingColor,
  });

  drawText(doc, title, x, 39, {});

  drawText(doc, "Invoice Date:", x, 45, {
    style: "italic",
    weight: "bold",
    color: headingColor,
  });

  drawText(doc, format(date, "dd-MM-yyyy hh:mm:ss a"), x, 49, {});
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
function drawTableRow(doc: jsPDF, rows, options: Options) {
  rows.forEach((columns, i) => {
    let y = 75 + i * 10;
    let x = options.left;
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
          size: 7,
        });
      }

      doc.line(options.left, y, options.width - options.right, y);
      x += width;
    });
  });
}

function drawTableTotal(doc, data, options) {
  const { width, right, left } = options;

  let y = 161;
  data = [
    [{ text: "SUBTOTAL" }, { text: "1290", align: "right" }],
    [{ text: "DISCOUNT" }, { text: "1290", align: "right" }],
    [
      { text: "CGST", sub: "(Included)" },
      { text: "1290", align: "right" },
    ],
    [
      { text: "IGST", sub: "(Included)" },
      { text: "1290", align: "right" },
    ],
    [{ text: "ROUNDED OFF" }, { text: "1290", align: "right" }],
  ];

  data.forEach((row) => {
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

  doc.line(width - left - 50, y + 2, width - right, y + 2);
}
/**
 * create invoice
 * @param {*} invoiceData

 */
export async function createSalePDF(saleId: number) {
  try {
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

    const filePath = `public/files/sale/${sale.title}.pdf`;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [width, height],
    });

    await createTemplate(doc, 1, options, sale);

    const colWitdh = ((60 / 100) * (width - (left + right))) / 5;

    const cols = [
      {
        text: "1",
        width: 10,
      },
      {
        text: "Product Title lorem ipsum dolar sit ampser",
        subtext: "small",
        width: (40 / 100) * (width - (left + right)) - 10,
        color: headingColor,
      },
      {
        text: "610400",
        width: colWitdh,
        align: "right",
      },
      {
        text: "290",
        subtext: "0",
        width: colWitdh,
        align: "right",
      },
      {
        text: "4",
        width: colWitdh,
        align: "right",
      },
      {
        text: "54",
        width: colWitdh,
        align: "right",
      },
      {
        text: "1290",
        width: colWitdh,
        align: "right",
      },
    ];

    const lineitems = sale.lineItems.map((item, i) => [
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
        text: "hsn",
        width: colWitdh,
        align: "right",
      },
      {
        text: item.price.toFixed(2),
        subtext: item.totalDiscount > 0 ? item.totalDiscount.toFixed(2) : "",
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

    drawTableRow(doc, lineitems, options);
    drawTableTotal(doc, [], options);

    const pdfBytes = doc.output("arraybuffer");
    const buffer = Buffer.from(pdfBytes);

    fs.writeFileSync(filePath, buffer);
  } catch (error) {
    console.log(error);
    return null;
  }
}
