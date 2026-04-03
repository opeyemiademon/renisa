import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import bwipjs from 'bwip-js';
export const generateIDCard = async (memberData, outputDir) => {
    const frontPath = path.join(outputDir, `${memberData.memberNumber}-front.pdf`);
    const backPath = path.join(outputDir, `${memberData.memberNumber}-back.pdf`);
    if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });
    const cardWidth = 3.375 * 72;
    const cardHeight = 2.125 * 72;
    // Generate QR code buffer
    let qrBuffer = null;
    try {
        const qrDataUrl = await QRCode.toDataURL(memberData.memberNumber, { width: 80, margin: 1 });
        qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    }
    catch (e) {
        console.error('QR code generation error:', e);
    }
    // Generate barcode buffer
    let barcodeBuffer = null;
    try {
        barcodeBuffer = await bwipjs.toBuffer({
            bcid: 'code128',
            text: memberData.memberNumber,
            scale: 2,
            height: 10,
            includetext: true,
            textxalign: 'center',
        });
    }
    catch (e) {
        console.error('Barcode generation error:', e);
    }
    // Generate FRONT card
    await new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: [cardWidth, cardHeight], margin: 0 });
        const stream = fs.createWriteStream(frontPath);
        doc.pipe(stream);
        // Gold header
        doc.rect(0, 0, cardWidth, 28).fill('#d4a017');
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#1a6b3a')
            .text('RENISA', 0, 8, { width: cardWidth, align: 'center' });
        doc.fontSize(5).font('Helvetica').fillColor('#1a6b3a')
            .text('Association of Retired Nigerian Women & Men Sports', 0, 18, { width: cardWidth, align: 'center' });
        // White body
        doc.rect(0, 28, cardWidth, cardHeight - 50).fill('#ffffff');
        // Green left stripe
        doc.rect(0, 28, 8, cardHeight - 50).fill('#1a6b3a');
        // Photo placeholder
        const photoX = 15;
        const photoY = 35;
        const photoW = 50;
        const photoH = 55;
        if (memberData.profilePicture && fs.existsSync(memberData.profilePicture)) {
            try {
                doc.image(memberData.profilePicture, photoX, photoY, { width: photoW, height: photoH, cover: [photoW, photoH] });
            }
            catch {
                doc.rect(photoX, photoY, photoW, photoH).fillAndStroke('#e8f5e9', '#1a6b3a');
            }
        }
        else {
            doc.rect(photoX, photoY, photoW, photoH).fillAndStroke('#e8f5e9', '#1a6b3a');
            doc.fontSize(7).fillColor('#1a6b3a').text('PHOTO', photoX, photoY + 22, { width: photoW, align: 'center' });
        }
        // Member details
        const textX = 75;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a6b3a')
            .text(`${memberData.firstName} ${memberData.lastName}`, textX, 37, { width: 145 });
        if (memberData.middleName) {
            doc.fontSize(6).font('Helvetica').fillColor('#333333')
                .text(memberData.middleName, textX, 48, { width: 145 });
        }
        doc.fontSize(6).font('Helvetica').fillColor('#555555')
            .text(`Sport: ${memberData.sport || 'N/A'}`, textX, 58)
            .text(`State: ${memberData.state || 'N/A'}`, textX, 68)
            .text(`Year: ${memberData.membershipYear || new Date().getFullYear()}`, textX, 78);
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#1a6b3a')
            .text(memberData.memberNumber, textX, 90, { width: 145 });
        // Green footer with QR
        doc.rect(0, cardHeight - 22, cardWidth, 22).fill('#1a6b3a');
        if (qrBuffer) {
            doc.image(qrBuffer, cardWidth - 30, cardHeight - 32, { width: 28, height: 28 });
        }
        const validYear = memberData.validUntil || String(new Date().getFullYear() + 1);
        doc.fontSize(6).font('Helvetica').fillColor('#ffffff')
            .text(`Valid Until: ${validYear}`, 10, cardHeight - 17, { width: 160 });
        doc.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
    // Generate BACK card
    await new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: [cardWidth, cardHeight], margin: 0 });
        const stream = fs.createWriteStream(backPath);
        doc.pipe(stream);
        // Gold header
        doc.rect(0, 0, cardWidth, 25).fill('#d4a017');
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#1a6b3a')
            .text('RENISA - MEMBER IDENTIFICATION', 0, 9, { width: cardWidth, align: 'center' });
        // White body
        doc.rect(0, 25, cardWidth, cardHeight - 45).fill('#ffffff');
        // Association address
        doc.fontSize(6).font('Helvetica').fillColor('#333333')
            .text('Association of Retired Nigerian Women & Men Sports', 10, 32, { width: cardWidth - 20, align: 'center' })
            .text('Plot 1, Sports House, Maitama, FCT - Abuja, Nigeria', 10, 42, { width: cardWidth - 20, align: 'center' })
            .text('Tel: +234 (0) 800 RENISA | Email: info@renisa.ng', 10, 52, { width: cardWidth - 20, align: 'center' });
        // Separator
        doc.moveTo(10, 64).lineTo(cardWidth - 10, 64).strokeColor('#1a6b3a').lineWidth(0.5).stroke();
        // Barcode
        if (barcodeBuffer) {
            const barcodeY = 70;
            doc.image(barcodeBuffer, 40, barcodeY, { width: cardWidth - 80 });
        }
        else {
            doc.fontSize(6).fillColor('#555555').text(memberData.memberNumber, 10, 75, { width: cardWidth - 20, align: 'center' });
        }
        // Notice text
        doc.fontSize(5).font('Helvetica').fillColor('#666666')
            .text('If found, please return to the nearest RENISA chapter office.', 10, cardHeight - 30, { width: cardWidth - 20, align: 'center' });
        // Green footer
        doc.rect(0, cardHeight - 18, cardWidth, 18).fill('#1a6b3a');
        doc.fontSize(5).font('Helvetica').fillColor('#ffffff')
            .text('This card is the property of RENISA and is non-transferable.', 0, cardHeight - 13, { width: cardWidth, align: 'center' });
        doc.end();
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
    return { frontPath, backPath };
};
//# sourceMappingURL=idCardGenerator.js.map