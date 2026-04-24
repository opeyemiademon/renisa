'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'
import { Member } from '@/types'
import { buildImageUrl, formatDate, formatDateOnly } from '@/lib/utils'
import QRCode from 'qrcode'

export const GOLD = '#f5c518'
export const GREEN_DEEP = '#1b5c08'
export const GREEN_MID = '#1a4a08'

export type IDCardPreviewSettings = {
  headerText?: string | null
  footerText?: string | null
  validityYears?: number | null
}

interface IDCardFrontPreviewProps {
  member: Member
  photoUrl?: string
  validYear?: number
  settings?: IDCardPreviewSettings | null
  position?: string
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '42px 10px 1fr', alignItems: 'center' }}>
      <span style={{ color: GREEN_MID, fontWeight: 600, fontSize: 8 }}>{label}</span>
      <span style={{ color: GREEN_MID, fontWeight: 600, fontSize: 8 }}>:</span>
      <span style={{ color: '#111', fontWeight: 600, fontSize: 8 }}>{value || '—'}</span>
    </div>
  )
}

export const IDCardFrontPreview = forwardRef<HTMLDivElement, IDCardFrontPreviewProps>(
  function IDCardFrontPreview({ member, photoUrl, validYear, settings, position }, ref) {
    const currentYear = new Date().getFullYear()
    const years = settings?.validityYears ?? 1
    const validUntilYear = validYear ?? currentYear + years
    const validDateStr = `31/12/${validUntilYear}`

    const [qrSrc, setQrSrc] = useState<string | null>(null)
    const [qrSettled, setQrSettled] = useState(false)
    const [photoLoaded, setPhotoLoaded] = useState(!photoUrl)
    const [imgError, setImgError] = useState(false)

    // Track the previous photoUrl in a ref so the effect only resets loading
    // state when the URL genuinely changes — not on the initial mount.
    // Without this, the effect fires after the first render and overwrites
    // photoLoaded=true (set by onLoad) back to false, permanently blocking capture.
    const prevPhotoUrl = useRef(photoUrl)
    useEffect(() => {
      if (prevPhotoUrl.current === photoUrl) return
      prevPhotoUrl.current = photoUrl
      setPhotoLoaded(!photoUrl)
      setImgError(false)
    }, [photoUrl])

    useEffect(() => {
      let cancelled = false
      setQrSettled(false)
      const profileUrl = member.id
        ? `https://renisa.ng/members/${member.id}`
        : member.memberNumber || 'RENISA'
      QRCode.toDataURL(profileUrl, {
        width: 200,
        margin: 1,
        color: { dark: '#000000', light: '#f5c518' },
        errorCorrectionLevel: 'M',
      })
        .then((url) => { if (!cancelled) setQrSrc(url) })
        .catch(() => { if (!cancelled) setQrSrc(null) })
        .finally(() => { if (!cancelled) setQrSettled(true) })
      return () => { cancelled = true }
    }, [member.id, member.memberNumber])

    const captureReady = qrSettled && photoLoaded

    const resolvedPhotoSrc =
      photoUrl && (photoUrl.startsWith('http') || photoUrl.startsWith('data:'))
        ? photoUrl
        : photoUrl
          ? buildImageUrl(photoUrl)
          : ''

    const imgCrossOrigin = resolvedPhotoSrc.startsWith('data:') ? undefined : 'anonymous'

    return (
      <div
        ref={ref}
        id="id-card-front"
        data-id-card-front="true"
        data-capture-ready={captureReady ? 'true' : 'false'}
        style={{
          width: 336,
          height: 212,
          borderRadius: 7,
          overflow: 'hidden',
          position: 'relative',
          background: '#d6f0b2',
          boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
          fontFamily: "'Montserrat', 'Segoe UI', sans-serif",
          userSelect: 'none',
        }}
      >
        {/* ── WATERMARK ── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '55%',
            transform: 'translate(-50%, -50%)',
            width: 206,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <img src="/logo.png" alt="" style={{ width: '100%', opacity: 0.07, filter: 'grayscale(100%)' }} />
        </div>

        {/* ── HEADER ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: 49,
            background: GREEN_DEEP,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Yellow trapezoid */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: 163,
              background: GOLD,
              clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 7,
              gap: 5,
              zIndex: 3,
            }}
          >
            <img src="/logo.png" alt="RENISA" style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0 }} />
            <span style={{ fontSize: 22, fontWeight: 800, color: GREEN_DEEP, letterSpacing: 0.5, lineHeight: 1 }}>
              RENISA
            </span>
          </div>

          {/* Member ID Card label */}
          <span
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#fff',
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              zIndex: 2,
            }}
          >
            Member ID Card
          </span>
        </div>

        {/* ── BODY ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            padding: '8px 8px 0 8px',
            gap: 10,
            height: 'calc(212px - 49px - 20px)',
          }}
        >
          {/* Left: photo + member ID */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, flexShrink: 0, width: 79 }}>
            <div style={{ width: 79, height: 97, borderRadius: 5, overflow: 'hidden', background: '#555' }}>
              {resolvedPhotoSrc && !imgError ? (
                <img
                  src={resolvedPhotoSrc}
                  alt="Member Photo"
                  crossOrigin={imgCrossOrigin}
                  onLoad={() => setPhotoLoaded(true)}
                  onError={() => { setImgError(true); setPhotoLoaded(true) }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: '#888', color: '#fff', fontSize: 18, fontWeight: 700,
                  }}
                >
                  {member.firstName?.[0] || '?'}
                </div>
              )}
            </div>

            {/* Member ID */}
            <span
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: 5,
                fontWeight: 700,
                letterSpacing: '1px',
                color: GREEN_MID,
                width: 79,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'clip',
              }}
            >
              {member.memberNumber}
            </span>
          </div>

          {/* Right: details + valid date + QR */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 6, minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              <DetailRow label="Name" value={`${member.firstName} ${member.lastName}`} />
              <DetailRow label="Sport" value={member.sport || '—'} />
              <DetailRow label="Position" value={position || '—'} />
              <DetailRow label="State" value={member.state || '—'} />
            </div>

            {/* Bottom row: valid date + QR */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingBottom: 2 }}>
                <span style={{ fontSize: 7, fontWeight: 600, color: GREEN_MID }}>Valid Date</span>
                <span style={{ fontSize: 7.5, fontWeight: 700, color: '#111' }}>{validDateStr}</span>
              </div>

              {/* QR box — yellow, top-rounded, flush with footer */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: GOLD,
                  borderRadius: '5px 5px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 3,
                  alignSelf: 'flex-end',
                }}
              >
                {qrSrc ? (
                  <img src={qrSrc} alt="QR Code" style={{ width: 42, height: 42, display: 'block', borderRadius: 2 }} />
                ) : (
                  <span style={{ fontSize: 5, color: GREEN_DEEP }}>QR</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            background: GREEN_DEEP,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
          }}
        >
          <span
            style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#fff',
            }}
          >
            Joined :&nbsp;&nbsp;{member.createdAt ? formatDateOnly(member.createdAt) : '-'}
          </span>
        </div>
      </div>
    )
  }
)
