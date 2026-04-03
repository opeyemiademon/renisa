'use client'

import { Trophy } from 'lucide-react'
import { Member } from '@/types'
import { buildImageUrl } from '@/lib/utils'

interface IDCardFrontPreviewProps {
  member: Member
  photoUrl?: string
  validYear?: number
}

export function IDCardFrontPreview({ member, photoUrl, validYear }: IDCardFrontPreviewProps) {
  const currentYear = new Date().getFullYear()
  const validUntil = validYear || currentYear + 2

  return (
    <div
      id="id-card-front"
      className="id-card-container w-80 h-48 rounded-xl overflow-hidden shadow-2xl select-none"
      style={{ background: 'linear-gradient(135deg, #0d4a25 0%, #1a6b3a 50%, #2d9a57 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#d4a017]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5 text-[#d4a017]" />
          </div>
          <div>
            <p className="text-white text-xs font-bold leading-none">RENISA</p>
            <p className="text-white/80 text-[8px] leading-none">Association of Retired Nigerian Sports</p>
          </div>
        </div>
        <p className="text-white text-[8px] font-medium">MEMBER ID CARD</p>
      </div>

      {/* Body */}
      <div className="flex gap-3 px-4 py-3">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-[#d4a017]/60 bg-white/10">
            {photoUrl ? (
              <img src={photoUrl.startsWith('http') ? photoUrl : buildImageUrl(photoUrl)} alt="Member" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/20">
                <span className="text-white text-2xl font-bold">{member.firstName[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">
            {member.firstName} {member.lastName}
          </p>
          {member.middleName && (
            <p className="text-white/70 text-[9px] truncate">{member.middleName}</p>
          )}
          <div className="mt-2 space-y-1">
            <div>
              <p className="text-[#d4a017] text-[8px] uppercase tracking-wide">Member No.</p>
              <p className="text-white text-xs font-bold">{member.memberNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-[#d4a017] text-[8px] uppercase tracking-wide">Sport</p>
                <p className="text-white text-[9px] font-medium truncate">{member.sport}</p>
              </div>
              <div>
                <p className="text-[#d4a017] text-[8px] uppercase tracking-wide">State</p>
                <p className="text-white text-[9px] font-medium truncate">{member.state}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-black/20">
        <p className="text-white/60 text-[8px]">
          Joined: {new Date(member.createdAt).getFullYear()}
        </p>
        <p className="text-[#d4a017] text-[8px] font-semibold">
          Valid Until: {validUntil}
        </p>
        {/* QR Placeholder */}
        <div className="w-8 h-8 bg-white/10 rounded border border-white/20 flex items-center justify-center">
          <span className="text-white/40 text-[6px]">QR</span>
        </div>
      </div>
    </div>
  )
}
