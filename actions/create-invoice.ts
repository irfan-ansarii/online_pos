"use server";
import { jsPDF } from "jspdf";
//@ts-ignore
import bwipjs from "bwip-js";
import fs from "fs";

const lineColor = "#D7DAE0";
const headingColor = "#141414";
const bodyColor = "#595959";

/**
 * set font, font-weight, font-style and font-size
 */
function setFont({ doc, weight, size, color, style }) {
  doc.setFont("helvetica", style, weight);
  doc.setFontSize(size);
  doc.setTextColor(color);
}

/**
 * draw text
 */
function drawText(doc, text, x, y, options = {}) {
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
  setFont({ doc, weight, size, color, style });

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
function truncateText(text, width, actualWidth) {
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
async function createTemplate(doc, page = 1, options) {
  const { width, height, top, right, bottom, left } = options;
  doc.setDrawColor(lineColor);
  doc.setPage(page);

  /**
   * barcode ends
   */
  drawText(doc, "INVOICE", left, top, {
    width: width - (left + right),
    weight: "bold",
    align: "right",
    size: 18,
  });

  doc.line(left, 30, width - right, 30);

  drawCompanyDetails(doc, options);
  drawCustomerDetails(doc, options);
  await drawInvoiceDetails(doc, options);

  doc.line(left, 65, width - right, 65);
  drawTableHeader(doc, options);

  doc.line(left, 75, width - right, 75);
  // line after table
  doc.line(left, 155, width - right, 155);

  // footer line
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
function drawCompanyDetails(doc, options) {
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

  drawText(doc, addresses, left, 30, {
    style: "italic",
  });
}

/**
 * draw customer details
 * @param {*} doc
 */
function drawCustomerDetails(doc, options) {
  const { left, right, width } = options;
  const x = (38 / 100) * (width - (left + right));

  const addresses = [
    "Company Name",
    "Customer Name",
    "address city",
    "State - Pincode",
    "GSTIN: 07AAQPK9016Q1ZW",
  ];

  drawText(doc, "Billed To:", x, 35, {
    style: "italic",
    weight: "bold",
    color: headingColor,
  });

  drawText(doc, addresses, x, 27, { style: "italic" });
}

/**
 * draw invoice details
 * @param {*} doc
 */
async function drawInvoiceDetails(doc, options) {
  const { left, width, right } = options;
  const x = (38 / 100) * (width - (left + right)) * 2;

  drawText(doc, "Invoice Number:", x, 35, {
    style: "italic",
    weight: "bold",
    color: headingColor,
  });
  drawText(doc, "GN000012365", x, 40);

  // Barcode options
  const barcodeOptions = {
    bcid: "code128",
    text: "GN000045",
    scale: 5,
    height: 10,
  };

  // Generate the barcode
  const b = await bwipjs.toBuffer(barcodeOptions);

  doc.addImage(b, x - 2, 18, 40, 10);

  drawText(doc, "Invoice Date:", x, 50, {
    style: "italic",
    weight: "bold",
    color: headingColor,
  });

  drawText(doc, "Invoice Date:", x, 55);
}

/**
 * draw table header
 * @param {*} doc
 * @param {*} options
 */

function drawTableHeader(doc, options) {
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
function drawTableRow(doc, data, options) {
  [...Array(4)].forEach((_, i) => {
    let y = 75 + i * 10;
    let x = options.left;
    data.forEach(({ text, subtext, width, align, color }) => {
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
  const { width, height, top, right, bottom, left } = options;

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
 * @param {*} param1
 */
export async function createInvoice(
  invoiceData,
  { width = 148, height = 210, top = 5, right = 5, bottom = 5, left = 5 }
) {
  const filePath = "public/files/invoice.pdf";

  const options = {
    width,
    height,
    top,
    right,
    bottom,
    left,
  };

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [width, height],
  });

  await createTemplate(doc, 1, options);

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

  drawTableRow(doc, cols, options);
  drawTableTotal(doc, [], options);
  const pdfBytes = doc.output("arraybuffer");
  const buffer = Buffer.from(pdfBytes);
  fs.writeFileSync(filePath, buffer);
}
