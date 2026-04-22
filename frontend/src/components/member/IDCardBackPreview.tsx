'use client'

import { forwardRef } from 'react'
import { Member } from '@/types'
import { GOLD, GREEN_DEEP, type IDCardPreviewSettings } from './IDCardFrontPreview'

const W = 336
const H = 212
const HEADER_H = 49
const FOOTER_H = 20
const BODY_H = H - HEADER_H - FOOTER_H

interface IDCardBackPreviewProps {
  member: Member
  settings?: IDCardPreviewSettings | null
}

export const IDCardBackPreview = forwardRef<HTMLDivElement, IDCardBackPreviewProps>(
  function IDCardBackPreview({ member }, ref) {
    return (
      <div
        ref={ref}
        id="id-card-back"
        style={{
          width: W,
          height: H,
          borderRadius: 7,
          overflow: 'hidden',
          position: 'relative',
          background: '#d6f0b2',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
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
            width: 210,
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
            height: HEADER_H,
            background: GREEN_DEEP,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {/* Yellow trapezoid — logo + full org name */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: 272,
              background: GOLD,
              clipPath: 'polygon(0 0, 88% 0, 100% 100%, 0 100%)',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 7,
              gap: 6,
              zIndex: 3,
            }}
          >
            <img src="/logo.png" alt="Logo" style={{ width: 34, height: 34, objectFit: 'contain', flexShrink: 0 }} />
            <span
              style={{
                fontSize: 5,
                fontWeight: 800,
                color: GREEN_DEEP,
                letterSpacing: '0.2px',
                lineHeight: 1.45,
                textTransform: 'uppercase',
              }}
            >
              Association of Retired Nigerian<br />Sports Men &amp; Women (RENISA)
            </span>
          </div>

          {/* RENISA wordmark right */}
          <span
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#fff',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '2px',
              zIndex: 2,
              whiteSpace: 'nowrap',
            }}
          >
            RENISA
          </span>
        </div>

        {/* ── BODY ── */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: BODY_H,
            padding: '9px 12px 0 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="9" height="12" viewBox="0 0 24 30" fill={GOLD}>
              <path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8zm0 11c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
            </svg>
            <span style={{ fontSize: 5.5, fontWeight: 600, color: '#111' }}>
              Moshood Abiola National Stadium, Abuja, FCT
            </span>
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill={GOLD}>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            <span style={{ fontSize: 5.5, fontWeight: 600, color: '#111' }}>08055555819</span>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="10" height="8" viewBox="0 0 24 18" fill={GOLD}>
              <path d="M22 0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4l-10 7L2 4V2l10 7 10-7v2z" />
            </svg>
            <span style={{ fontSize: 5.5, fontWeight: 600, color: '#111' }}>info@renisa.ng</span>
          </div>

          {/* Disclaimer */}
          <p style={{ fontSize: 4.5, color: '#222', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
            This ID card is the property of RENISA and must be surrendered on demand. If found,
            please return to the nearest RENISA office.
          </p>

          {/* Bottom: status + logo wordmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 'auto',
              paddingBottom: 5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }} />
              <span style={{ fontSize: 6, fontWeight: 700, color: '#1a4a08', textTransform: 'capitalize' }}>
                {member.status || 'Active'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <img src="/logo.png" alt="RENISA" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              <span style={{ fontSize: 8, fontWeight: 800, color: GREEN_DEEP, letterSpacing: 1 }}>
                RENISA
              </span>
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
            height: FOOTER_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: '2px', color: '#fff' }}>
            www.renisa.ng
          </span>
        </div>
      </div>
    )
  }
)
