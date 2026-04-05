import html2canvas from 'html2canvas'

async function decodeImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    try {
      await img.decode()
    } catch {
      /* ignore */
    }
    return
  }
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('A card image failed to load. Check your photo and try again.'))
  })
  try {
    await img.decode()
  } catch {
    /* ignore */
  }
}

/** Ensures every img inside the card has loaded (photo, QR, logos). */
export async function waitForCardImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'))
  await Promise.all(imgs.map((el) => decodeImage(el)))
}

async function waitForCaptureReadyFlag(root: HTMLElement, timeoutMs: number): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (root.getAttribute('data-capture-ready') === 'true') return
    await new Promise((r) => setTimeout(r, 40))
  }
  throw new Error('ID card preview timed out while loading. Wait a moment and try again.')
}

export type CaptureIdCardOptions = {
  /** Higher = sharper PDF; default 3 for request submit, use 4 for print/PDF */
  scale?: number
  /** `null` = transparent (saved PNGs); `#fff` recommended for PDF raster */
  backgroundColor?: string | null
}

/**
 * Rasterizes a DOM node to a PNG data URL. Card markup should use inline hex/rgba only (no Tailwind)
 * so html2canvas never sees oklab().
 */
export async function captureIdCardToPngDataUrl(
  element: HTMLElement,
  options?: CaptureIdCardOptions
): Promise<string> {
  const scale = options?.scale ?? 3
  const backgroundColor = options?.backgroundColor !== undefined ? options.backgroundColor : null

  if (element.getAttribute('data-id-card-front') === 'true') {
    await waitForCaptureReadyFlag(element, 15000)
  }
  await waitForCardImages(element)
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })
  return canvas.toDataURL('image/png', 1.0)
}
