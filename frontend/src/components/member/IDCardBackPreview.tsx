'use client'

import { Phone, Mail, MapPin, Trophy } from 'lucide-react'
import { Member } from '@/types'

interface IDCardBackPreviewProps {
  member: Member
}

export function IDCardBackPreview({ member }: IDCardBackPreviewProps) {
  return (
    <div
      id="id-card-back"
      className="id-card-container w-80 h-48 rounded-xl overflow-hidden shadow-2xl select-none bg-white"
    >
      {/* Green top bar */}
      <div className="h-3 bg-gradient-to-r from-[#0d4a25] via-[#d4a017] to-[#0d4a25]" />

      <div className="px-4 py-3">
        {/* Title */}
        <p className="text-[#1a6b3a] font-bold text-xs text-center mb-3">
          ASSOCIATION OF RETIRED NIGERIAN SPORTS MEN &amp; WOMEN
        </p>

        {/* Contact Info */}
        <div className="space-y-1.5">
          {[
            { icon: <MapPin className="w-3 h-3" />, text: 'National Sports Commission, Surulere, Lagos' },
            { icon: <Phone className="w-3 h-3" />, text: '+234 800 000 0000' },
            { icon: <Mail className="w-3 h-3" />, text: 'info@renisa.org.ng' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[9px] text-gray-600">
              <span className="text-[#d4a017] flex-shrink-0">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* Terms */}
        <div className="mt-3 p-2 bg-gray-50 rounded border border-gray-200">
          <p className="text-[8px] text-gray-500 leading-relaxed">
            This card is the property of RENISA and must be surrendered on demand.
            If found, please return to the nearest RENISA office or call +234 800 000 0000.
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-[8px] text-green-700 font-medium capitalize">{member.status}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3 text-[#d4a017]" />
            <span className="text-[8px] text-[#1a6b3a] font-bold">RENISA</span>
          </div>
        </div>
      </div>

      {/* Gold bottom bar */}
      <div className="h-2 bg-[#d4a017] absolute bottom-0 left-0 right-0" />
    </div>
  )
}
