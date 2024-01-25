"use server";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
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
function drawText(doc, text, x, y, options) {
  const {
    width = 128,
    align = "left",
    style = "normal",
    weight = "normal",
    size = 8,
    color = bodyColor,
  } = options;

  setFont({ doc, weight, size, color, style });

  const { w, h } = doc.getTextDimensions(text);
  if (align === "center") {
    x = x + width / 2 - w / 2;
  }
  if (align === "right") {
    x = x + width - w;
  }
  doc.text(x, y + h, text);
}

/**
 * create template
 */
function createTemplate({ doc, pageNumber = 1 }) {
  doc.setDrawColor(lineColor);
  doc.setPage(pageNumber);

  drawText(doc, "Invoice", 0, 10, {
    width: 128,
    weight: "bold",
    align: "right",
    size: 20,
  });

  doc.line(10, 30, 138, 30);

  drawCompanyDetails(doc);
  drawCustomerDetails(doc);
  drawInvoiceDetails(doc);

  doc.line(10, 65, 138, 65);
  drawTableHeader(doc);
  doc.line(10, 73, 138, 73);
  // line after table
  doc.line(10, 155, 138, 155);

  // footer line
  doc.line(10, 195, 138, 195);

  drawText({
    doc,
    text: "For Goldy's Nestt",
    width: 128,
    y: 196,
  });

  drawText({
    doc,
    text: "saleshelp@goldysnestt.com",
    width: 128,
    y: 196,
    align: "right",
  });
  drawText({
    doc,
    text: "+91-9871640395",
    y: 196,
    x: 70,
  });
}

function drawCompanyDetails(doc) {
  const x = 10;
  const addresses = [
    "Goldy's Nestt",
    "M-12, Greater Kailash - 1",
    "New Delhi - 110048",
    "GSTIN: 07AAQPK9016Q1ZW",
  ];

  drawText({
    doc,
    text: "Sold By:",
    y: 35,
    x,
    style: "italic",
    weight: "bold",
    color: headingColor,
  });

  let y = 40;
  addresses.forEach((address) => {
    drawText({
      doc,
      text: address,
      style: "italic",
      y,
      x,
    });
    y += 3.5;
  });
}

function drawCustomerDetails(doc) {
  const x = 15 + 128 / 3;

  const addresses = [
    "Company Name",
    "Customer Name",
    "address city",
    "State - Pincode",
    "GSTIN: 07AAQPK9016Q1ZW",
  ];

  drawText({
    doc,
    text: "Billed To:",
    y: 35,
    x,
    style: "italic",
    weight: "bold",
    color: headingColor,
  });

  let y = 40;
  addresses.forEach((address) => {
    drawText({ doc, text: address, style: "italic", y, x });
    y += 3.5;
  });
}

// invoice details
function drawInvoiceDetails(doc) {
  const x = 15 + 128 / 3 + 128 / 3;

  drawText({
    doc,
    text: "Invoice Number:",
    y: 35,
    x,
    weight: "bold",
    color: headingColor,
  });
  drawText({
    doc,
    text: "Invoice Date:",
    y: 50,
    x,
    weight: "bold",
    color: headingColor,
  });
  drawText({ doc, text: "20-04-2024", y: 54, x, style: "italic" });
}

function drawTableHeader(doc, columnHeaders, startX, startY) {
  let x = 10;
  drawText({ doc, text: "S.No.", x, y: 67, width: 10, color: headingColor });
  x += 10;
  drawText({
    doc,
    text: "Description",
    x,
    y: 67,
    width: 40,
    color: headingColor,
  });
  x += 40;
  drawText({
    doc,
    text: "HSN Code",
    x,
    y: 67,
    width: 15.6,
    align: "right",
    color: headingColor,
  });
  x += 15.6;
  drawText({
    doc,
    text: "Price",
    x,
    y: 67,
    width: 15.6,
    align: "right",
    color: headingColor,
  });
  x += 15.6;
  drawText({
    doc,
    text: "Quantity",
    x,
    y: 67,
    width: 15.6,
    align: "right",
    color: headingColor,
  });
  x += 15.6;
  drawText({
    doc,
    text: "Tax",
    x,
    y: 67,
    width: 15.6,
    align: "right",
    color: headingColor,
  });
  x += 15.6;
  drawText({
    doc,
    text: "Total",
    x,
    y: 67,
    width: 15.6,
    align: "right",
    color: headingColor,
  });
}

function drawTableRow(doc, rowData, startX, startY, rowHeight) {
  let positionX = startX;
  rowData.forEach(({ text, width, align }, i) => {
    const dimensions = doc.getTextDimensions(text);
    let x = positionX;
    if (align === "right") {
      x = positionX + (width || (148 - 70) / 5 - dimensions.w);
    }
    drawText(doc, text, x, startY - 6, "helvetica", "normal", 8, bodyColor);

    if (i === 0) {
      drawText(
        doc,
        "something",
        x + width,
        startY - 2,
        "helvetica",
        "normal",
        7,
        bodyColor
      );
    }
    positionX += width || 15.6;
  });
}

export async function createSaleInvoice(invoiceData) {
  const filePath = "public/files/invoice.pdf";

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [148, 210],
  });

  createTemplate({ doc, pageNumber: 1 });
  for (let i = 1; i < 50; i++) {
    doc.addPage(1);
    createTemplate({ doc, pageNumber: i + 1 });
  }

  const pdfBytes = doc.output("arraybuffer");
  const buffer = Buffer.from(pdfBytes);
  fs.writeFileSync(filePath, buffer);
}
