import { jsPDF } from 'jspdf'
import { captureIdCardToPngDataUrl } from '@/lib/idCardCapture'

/** ISO/IEC 7810 ID-1 (CR80) — same as physical card */
const CARD_W_MM = 85.6
const CARD_H_MM = 53.98

/**
 * Two-page PDF: front then back. Elements must be the same `IDCardFrontPreview` / `IDCardBackPreview` roots
 * (inline styles only). Uses a higher raster scale for print clarity.
 */
export async function downloadMemberIdCardPdf(
  frontElement: HTMLElement,
  backElement: HTMLElement,
  fileBaseName: string
): Promise<void> {
  const captureOpts = { scale: 4 as const, backgroundColor: '#d6f0b2' as const }

  const frontPng = await captureIdCardToPngDataUrl(frontElement, captureOpts)
  const backPng = await captureIdCardToPngDataUrl(backElement, captureOpts)

  const pdf = new jsPDF({
    unit: 'mm',
    format: [CARD_W_MM, CARD_H_MM],
    orientation: 'landscape',
    compress: true,
  })

  pdf.setProperties({
    title: 'RENISA Member ID Card',
    subject: 'Official digital ID (front & back)',
    creator: 'RENISA Member Portal',
  })

  pdf.addImage(frontPng, 'PNG', 0, 0, CARD_W_MM, CARD_H_MM, undefined, 'SLOW')
  pdf.addPage([CARD_W_MM, CARD_H_MM], 'landscape')
  pdf.addImage(backPng, 'PNG', 0, 0, CARD_W_MM, CARD_H_MM, undefined, 'SLOW')

  const safe = fileBaseName.replace(/[^\w.-]+/g, '-')
  pdf.save(`${safe}.pdf`)
}
