"use server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";

export async function createSaleInvoice(
  customerInfo: any,
  items: any,
  totalAmount: any
) {
  const filePath = "public/files/invoice.pdf";

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page with A5 size
  const page = pdfDoc.addPage([419.528, 595.28]);

  // Helper function to draw text
  const drawText = (text, x, y, size) => {
    page.drawText(text, { x, y, size: size });
  };

  // Helper function to draw lines
  const drawLine = (x1, y1, x2, y2) => {
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      color: rgb(0, 0, 0),
      thickness: 1,
    });
  };

  // Header
  drawText("Invoice", 250, 800);
  drawLine(50, 690, 550, 690);
  // Customer Information
  drawText("Customer Information:", 50, 750);
  drawText(`Name: ${customerInfo.name}`, 50, 730);
  drawText(`Address: ${customerInfo.address}`, 50, 710);

  // Item Details Table
  drawText("Item Details:", 50, 670);

  // Table Header
  drawText("Description", 50, 650);
  drawText("Price", 200, 650);

  // Draw horizontal line under the header
  drawLine(50, 645, 550, 645);

  // Table Rows
  items.forEach((item, index) => {
    const rowY = 620 - index * 20;
    drawText(item.description, 50, rowY);
    drawText(`$${item.price.toFixed(2)}`, 200, rowY);
  });

  // Draw horizontal line under the table
  drawLine(50, 50, 550, 50);

  // Total Amount
  drawText(`Total Amount: $${totalAmount.toFixed(2)}`, 400, 30);

  // Save the PDF to a buffer
  const pdfBytes = await pdfDoc.save();

  const buffer = Buffer.from(pdfBytes);
  fs.writeFileSync(filePath, buffer);

  return pdfBytes;
}
