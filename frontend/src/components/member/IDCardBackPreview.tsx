'use client'

import { forwardRef } from 'react'
import type { CSSProperties } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import { Member } from '@/types'
import { GOLD, type IDCardPreviewSettings } from './IDCardFrontPreview'

const GREEN = '#14532d'

interface IDCardBackPreviewProps {
  member: Member
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
  backgroundColor: '#ffffff',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
}

export const IDCardBackPreview = forwardRef<HTMLDivElement, IDCardBackPreviewProps>(
  function IDCardBackPreview({ member, settings }, ref) {
    const footerMessage =  'The ID card is the property of RENISA and must be surrendered on demand. If found, please return to the nearest RENISA office'

    const iconWrap: CSSProperties = {
      color: GOLD,
      flexShrink: 0,
      marginTop: 2,
      display: 'flex',
      alignItems: 'center',
    }

    return (
      <div ref={ref} id="id-card-back" style={{ ...cardShell, position: 'relative' }}>
        <div style={{ height: 4, flexShrink: 0, backgroundColor: GREEN }} />
        <div style={{ height: 12, flexShrink: 0, backgroundColor: GOLD }} />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 8,
            paddingBottom: 4,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                margin: 0,
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1.35,
                color: GREEN,
                letterSpacing: '0.02em',
              }}
            >
              Retired Nigerian Men & Women Sports Association
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 9, fontWeight: 700, color: GREEN }}>(RENISA)</p>
          </div>

          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
            {[
              { Icon: MapPin, text: 'National Sports Commission, Surulere, Lagos' },
              { Icon: Phone, text: '+234 800 000 0000' },
              { Icon: Mail, text: 'info@renisa.org.ng' },
            ].map(({ Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 9, lineHeight: 1.35, color: '#404040' }}>
                <span style={iconWrap}>
                  <Icon style={{ width: 12, height: 12 }} strokeWidth={2} />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 8,
              minHeight: 52,
              flex: 1,
              borderRadius: 6,
              border: '1px solid #d4d4d4',
              backgroundColor: 'rgba(250,250,250,0.9)',
              padding: '8px 10px',
            }}
          >
            <p style={{ margin: 0, fontSize: 8, lineHeight: 1.45, color: '#525252' }}>{footerMessage}</p>
          </div>

          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: '#16a34a', flexShrink: 0 }} />
              <span style={{ fontSize: 9, fontWeight: 600, color: '#15803d', textTransform: 'capitalize' }}>
                {member.status || 'Active'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
             
                <img src="/logo.png" alt="" style={{ width: 16, height: 16, objectFit: 'contain' }} />
             
              <span style={{ fontSize: 9, fontWeight: 700, color: GREEN }}>RENISA</span>
            </div>
          </div>
        </div>

        <div
          style={{
            height: 10,
            width: '100%',
            flexShrink: 0,
            backgroundColor: GOLD,
          }}
        />
      </div>
    )
  }
)
