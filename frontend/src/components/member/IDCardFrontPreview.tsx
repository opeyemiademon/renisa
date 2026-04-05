'use client'

import { forwardRef, useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Member } from '@/types'
import { buildImageUrl, formatDate } from '@/lib/utils'
import QRCode from 'qrcode'

/** CR80-style palette — matches official RENISA ID artwork (hex only; avoids Tailwind oklab in html2canvas) */
export const GOLD = '#d4af37'
export const GREEN_DEEP = '#0d4a25'
export const GREEN_MID = '#14532d'

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
}

const cardShell: CSSProperties = {
  width: 336,
  height: 212,
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
}

export const IDCardFrontPreview = forwardRef<HTMLDivElement, IDCardFrontPreviewProps>(
  function IDCardFrontPreview({ member, photoUrl, validYear, settings }, ref) {
    const currentYear = new Date().getFullYear()
    const years = settings?.validityYears ?? 1
    const validUntil = validYear ?? currentYear + years
    const [qrSrc, setQrSrc] = useState<string | null>(null)
    const [qrSettled, setQrSettled] = useState(false)
    const [photoLoaded, setPhotoLoaded] = useState(!photoUrl)

    useEffect(() => {
      setPhotoLoaded(!photoUrl)
    }, [photoUrl])

    useEffect(() => {
      let cancelled = false
      setQrSettled(false)
      QRCode.toDataURL(member.memberNumber || 'RENISA', {
        width: 112,
        margin: 1,
        color: { dark: '#1a1a1a', light: '#ffffff' },
      })
        .then((url) => {
          if (!cancelled) setQrSrc(url)
        })
        .catch(() => {
          if (!cancelled) setQrSrc(null)
        })
        .finally(() => {
          if (!cancelled) setQrSettled(true)
        })
      return () => {
        cancelled = true
      }
    }, [member.memberNumber])

    const captureReady = qrSettled && photoLoaded

    const resolvedPhotoSrc =
      photoUrl && (photoUrl.startsWith('http') || photoUrl.startsWith('data:'))
        ? photoUrl
        : photoUrl
          ? buildImageUrl(photoUrl)
          : ''

    const imgCrossOrigin = resolvedPhotoSrc.startsWith('data:') ? undefined : 'anonymous'

    const headerSubline = settings?.headerText?.trim() || 'Header Message Here'

    return (
      <div
        ref={ref}
        id="id-card-front"
        data-id-card-front="true"
        data-capture-ready={captureReady ? 'true' : 'false'}
        style={cardShell}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 8,
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 10,
            paddingBottom: 8,
            backgroundColor: GOLD,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 0 }}>
          
              <img src="/logo.png" alt="" style={{ width: 36, height: 36, objectFit: 'contain' }} />
           
            <div style={{ minWidth: 0, paddingTop: 2 }}>
              <p
                style={{
                  color: '#ffffff',
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                RENISA
              </p>
             
            </div>
          </div>
          <p
            style={{
              flexShrink: 0,
              paddingTop: 4,
              textAlign: 'right',
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#ffffff',
              margin: 0,
            }}
          >
            MEMBER ID CARD
          </p>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            background: `linear-gradient(155deg, ${GREEN_DEEP} 0%, ${GREEN_MID} 42%, #166534 100%)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              minHeight: 0,
              gap: 12,
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <div style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: 70,
                  height: 92,
                  borderRadius: 8,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  border: `2px solid ${GOLD}`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}
              >
                {photoUrl ? (
                  <img
                    src={resolvedPhotoSrc}
                    alt="Member"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    crossOrigin={imgCrossOrigin}
                    onLoad={() => setPhotoLoaded(true)}
                    onError={() => setPhotoLoaded(true)}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 24, fontWeight: 700 }}>
                      {member.firstName?.[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                minWidth: 0,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: 15,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {member.firstName} {member.lastName}
                </p>
                {member.middleName ? (
                  <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 500 }}>
                    {member.middleName}
                  </p>
                ) : null}
              </div>
              <div style={{ marginTop: 4 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 8,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: GOLD,
                  }}
                >
                  Member No.
                </p>
                <p style={{ margin: '2px 0 0', color: '#ffffff', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                  {member.memberNumber}
                </p>
              </div>
              <div
                style={{
                  marginTop: 4,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px 12px',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 8,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: GOLD,
                    }}
                  >
                    Sport
                  </p>
                  <p style={{ margin: '2px 0 0', color: '#ffffff', fontSize: 10, fontWeight: 600 }}>
                    {member.sport || '—'}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 8,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: GOLD,
                    }}
                  >
                    State
                  </p>
                  <p style={{ margin: '2px 0 0', color: '#ffffff', fontSize: 10, fontWeight: 600}}>
                    {member.state || '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              flexShrink: 0,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              alignItems: 'center',
              gap: 4,
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: 5,
              paddingBottom: 5,
              backgroundColor: 'rgba(0,0,0,0.22)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p style={{ margin: 0, fontSize: 8, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>
              Joined: {member.createdAt ? formatDate(member.createdAt) : '—'}
            </p>
            <p style={{ margin: 0, textAlign: 'center', fontSize: 8, fontWeight: 600, color: GOLD }}>
              Valid Until: {validUntil}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.4)',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: 1,
                }}
              >
                {qrSrc ? (
                  <img src={qrSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: 6, color: '#a3a3a3' }}>QR</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
