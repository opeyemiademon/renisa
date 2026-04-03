import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

interface DonationInvoiceData {
  invoiceNumber: string;
  donorName: string;
  donorEmail?: string;
  donorAddress?: string;
  donationTypeName: string;
  amount: number;
  currency?: string;
  dueDate?: Date;
  issuedDate?: Date;
  paymentLink?: string;
}

export const generateDonationInvoice = async (
  donationData: DonationInvoiceData,
  outputPath: string
): Promise<string> => {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 60 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width - 120;

    // Header background
    doc.rect(0, 0, doc.page.width, 100).fill('#1a6b3a');

    // Organisation name
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#d4a017')
      .text('RENISA', 60, 25);
    doc.fontSize(9).font('Helvetica').fillColor('#ffffff')
      .text('Association of Retired Nigerian Women & Men Sports', 60, 52)
      .text('Plot 1, Sports House, Maitama, FCT - Abuja | info@renisa.ng', 60, 65)
      .text('www.renisa.ng', 60, 78);

    // INVOICE label
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#ffffff')
      .text('INVOICE', doc.page.width - 180, 35, { width: 120, align: 'right' });

    // Invoice details box
    doc.rect(60, 115, pageWidth, 80).fillAndStroke('#f8f9fa', '#e0e0e0');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a6b3a')
      .text('Invoice Details', 75, 125);

    doc.fontSize(9).font('Helvetica').fillColor('#333333')
      .text(`Invoice Number: `, 75, 142)
      .text(`Issue Date: `, 75, 155)
      .text(`Due Date: `, 75, 168);

    doc.fontSize(9).font('Helvetica-Bold').fillColor('#333333')
      .text(donationData.invoiceNumber, 160, 142)
      .text((donationData.issuedDate || new Date()).toLocaleDateString('en-NG', { dateStyle: 'long' }), 160, 155)
      .text(donationData.dueDate ? donationData.dueDate.toLocaleDateString('en-NG', { dateStyle: 'long' }) : 'On receipt', 160, 168);

    // Bill to section
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a6b3a').text('Bill To:', 60, 215);
    doc.fontSize(9).font('Helvetica').fillColor('#333333')
      .text(donationData.donorName, 60, 230);
    if (donationData.donorEmail) {
      doc.text(donationData.donorEmail, 60, 243);
    }
    if (donationData.donorAddress) {
      doc.text(donationData.donorAddress, 60, donationData.donorEmail ? 256 : 243);
    }

    // Table header
    const tableY = 300;
    doc.rect(60, tableY, pageWidth, 25).fill('#1a6b3a');
    doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff')
      .text('Description', 75, tableY + 8)
      .text('Amount', doc.page.width - 160, tableY + 8, { width: 80, align: 'right' });

    // Table row
    const rowY = tableY + 25;
    doc.rect(60, rowY, pageWidth, 30).fillAndStroke('#f8f9fa', '#e0e0e0');
    doc.fontSize(9).font('Helvetica').fillColor('#333333')
      .text(donationData.donationTypeName, 75, rowY + 10)
      .text(`${donationData.currency || 'NGN'} ${donationData.amount.toLocaleString()}`, doc.page.width - 160, rowY + 10, { width: 80, align: 'right' });

    // Total
    const totalY = rowY + 45;
    doc.moveTo(60, totalY).lineTo(doc.page.width - 60, totalY).strokeColor('#1a6b3a').lineWidth(1).stroke();
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a6b3a')
      .text('TOTAL DUE:', 60, totalY + 10)
      .text(`${donationData.currency || 'NGN'} ${donationData.amount.toLocaleString()}`, doc.page.width - 160, totalY + 10, { width: 80, align: 'right' });

    // Payment link
    if (donationData.paymentLink) {
      doc.fontSize(9).font('Helvetica').fillColor('#555555')
        .text('Pay online at:', 60, totalY + 45)
        .fillColor('#1a6b3a')
        .text(donationData.paymentLink, 60, totalY + 58);
    }

    // Footer
    doc.rect(0, doc.page.height - 60, doc.page.width, 60).fill('#1a6b3a');
    doc.fontSize(8).font('Helvetica').fillColor('#ffffff')
      .text('Thank you for your generous donation to RENISA.', 0, doc.page.height - 45, { width: doc.page.width, align: 'center' })
      .text(`© ${new Date().getFullYear()} RENISA. All rights reserved.`, 0, doc.page.height - 32, { width: doc.page.width, align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return outputPath;
};
