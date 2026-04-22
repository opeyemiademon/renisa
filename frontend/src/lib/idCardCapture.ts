import html2canvas from 'html2canvas'

// Waits for a single image element to finish loading.
// Always resolves — never rejects — so a slow/broken image never blocks capture.
async function decodeImage(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    try { await img.decode() } catch { /* ignore */ }
    return
  }
  await new Promise<void>((resolve) => {
    const done = () => resolve()
    img.addEventListener('load', done, { once: true })
    img.addEventListener('error', done, { once: true })
    // Give up after 8 s and capture whatever is rendered
    setTimeout(done, 8000)
  })
  try { await img.decode() } catch { /* ignore */ }
}

/** Waits for every <img> inside the card element to finish loading. */
export async function waitForCardImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'))
  await Promise.all(imgs.map((el) => decodeImage(el)))
}

/**
 * Polls data-capture-ready="true" up to timeoutMs.
 * Does NOT throw on timeout — capture proceeds regardless so the user
 * is never blocked by a stale flag.
 */
async function waitForCaptureReadyFlag(root: HTMLElement, timeoutMs: number): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (root.getAttribute('data-capture-ready') === 'true') return
    await new Promise((r) => setTimeout(r, 40))
  }
  // Flag never became true — proceed with best-effort capture
}

export type CaptureIdCardOptions = {
  /** Higher = sharper; default 3 for submit, 4 for PDF */
  scale?: number
  /** null = transparent (PNG); '#fff' for PDF raster */
  backgroundColor?: string | null
}

/**
 * Rasterises a DOM node to a PNG data URL.
 * Card markup must use only inline hex/rgba (no Tailwind oklab) so html2canvas
 * renders it correctly.
 */
export async function captureIdCardToPngDataUrl(
  element: HTMLElement,
  options?: CaptureIdCardOptions
): Promise<string> {
  const scale = options?.scale ?? 3
  const backgroundColor = options?.backgroundColor !== undefined ? options.backgroundColor : null

  if (element.getAttribute('data-id-card-front') === 'true') {
    // Wait up to 10 s for the ready flag, then proceed regardless
    await waitForCaptureReadyFlag(element, 10000)
  }

  // Always wait for images (photo, QR, logo) — resolves even if some fail
  await waitForCardImages(element)

  // Two animation frames so the browser has painted the latest state
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
