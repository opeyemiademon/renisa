import { buildImageUrl } from '@/lib/utils'

/**
 * Loads a remote or relative image URL into a data URL so it paints reliably in html2canvas
 * (avoids cross-origin taint on the member ID card preview).
 */
export async function fetchImageAsDataUrl(src: string): Promise<string> {
  const trimmed = src.trim()
  if (trimmed.startsWith('data:')) return trimmed

  const url = trimmed.startsWith('http') ? trimmed : buildImageUrl(trimmed)

  const res = await fetch(url, { credentials: 'include', mode: 'cors' })
  if (!res.ok) throw new Error(`Could not load your photo (${res.status}). Try uploading a new picture.`)

  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read your photo. Try uploading again.'))
    reader.readAsDataURL(blob)
  })
}

/** ID photo from the approved request, or profile picture, inlined for PDF/canvas export. */
export async function resolveIdCardPhotoForExport(
  requestPhoto: string | undefined | null,
  profilePicturePath: string | undefined | null
): Promise<string> {
  const p = requestPhoto?.trim()
  if (p) {
    if (p.startsWith('data:')) return p
    const url = p.startsWith('http') ? p : buildImageUrl(p)
    return fetchImageAsDataUrl(url)
  }
  const prof = profilePicturePath?.trim()
  if (prof) {
    return fetchImageAsDataUrl(buildImageUrl(prof))
  }
  return ''
}
