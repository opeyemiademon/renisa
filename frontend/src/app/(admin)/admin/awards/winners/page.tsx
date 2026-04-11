'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trophy, Medal, FileDown, Users, Eye, EyeOff } from 'lucide-react'
import { getAwardWinnersReport, toggleCategoryPublicVisibility } from '@/lib/api_services/awardApiServices'
import { Button } from '@/components/shared/Button'
import { Select } from '@/components/shared/Select'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ── helpers ───────────────────────────────────────────────────────────────────

const loadImageAsBase64 = (url: string): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.getContext('2d')!.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })

const imgFmt = (src: string | null) => (src?.startsWith('data:image/png') ? 'PNG' : 'JPEG') as 'PNG' | 'JPEG'

const fmtDT = (d?: string | null) =>
  d ? new Date(d).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

// ─────────────────────────────────────────────────────────────────────────────

export default function AwardWinnersPage() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(String(currentYear))
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['award-winners-report', selectedYear],
    queryFn: () => getAwardWinnersReport(selectedYear ? parseInt(selectedYear) : undefined),
  })

  const toggleVisibility = useMutation({
    mutationFn: (id: string) => toggleCategoryPublicVisibility(id),
    onSuccess: (result) => {
      toast.success(result.message)
      queryClient.invalidateQueries({ queryKey: ['award-winners-report'] })
      queryClient.invalidateQueries({ queryKey: ['public-award-winners'] })
    },
    onError: (err: any) => toast.error(err.message || 'Failed to update visibility'),
  })

  const yearOptions = [
    { value: '', label: 'All Years' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(currentYear - i), label: String(currentYear - i),
    })),
  ]

  const categories = (data || []) as any[]

  // ── PDF export ──────────────────────────────────────────────────────────────

  const handleExportPDF = async () => {
    const logo = await loadImageAsBase64('/logo.png')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pw = doc.internal.pageSize.getWidth()

    // header
    if (logo) doc.addImage(logo, imgFmt(logo), 14, 8, 18, 18)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('RENISA', pw / 2, 14, { align: 'center' })
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Awards Winners Report${selectedYear ? ` — ${selectedYear}` : ''}`,
      pw / 2, 20, { align: 'center' }
    )
    doc.setFontSize(8)
    doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, pw / 2, 26, { align: 'center' })

    let y = 34

    for (const cat of categories) {
      // Category header
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setFillColor(26, 107, 58)
      doc.rect(14, y, pw - 28, 7, 'F')
      doc.setTextColor(255, 255, 255)
      doc.text(cat.categoryName, 16, y + 5)
      doc.setTextColor(0, 0, 0)
      y += 9

      const rows = cat.nominees.map((n: any, i: number) => [
        i + 1,
        n.recipientName,
        n.memberNumber || '—',
        n.voteCount,
        i === 0 ? '🏆 Winner' : '',
      ])

      autoTable(doc, {
        startY: y,
        head: [['#', 'Nominee', 'Member No.', 'Votes', 'Position']],
        body: rows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [212, 160, 23] },
        margin: { left: 14, right: 14 },
        didDrawPage: ({ cursor }: any) => { y = cursor?.y ?? y },
      })

      y = (doc as any).lastAutoTable.finalY + 6

      if (y > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        y = 16
      }
    }

    doc.save(`award-winners-${selectedYear || 'all'}-${Date.now()}.pdf`)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Award Winners</h2>
          <p className="text-gray-500 text-sm mt-0.5">Voting results and winners per category</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            label=""
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            options={yearOptions}
          />
          <Button
            variant="outline"
            iconLeft={<FileDown className="w-4 h-4" />}
            onClick={handleExportPDF}
            disabled={categories.length === 0}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-40 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No award data found</p>
          <p className="text-sm mt-1">Add nominees and enable voting to see results here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat: any) => (
            <div key={cat.categoryId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="bg-primary px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <h3 className="text-white font-semibold">{cat.categoryName}</h3>
                  <p className="text-white/70 text-xs mt-0.5">
                    {cat.pollActive ? (
                      <>Poll active{cat.votingEndDate ? ` · ends ${fmtDT(cat.votingEndDate)}` : ''}</>
                    ) : cat.votingStartDate ? (
                      `Polling ended · ${fmtDT(cat.votingEndDate)}`
                    ) : (
                      'Poll not started'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {cat.winner && (
                    <div className="text-right">
                      <p className="text-amber-300 text-xs font-medium uppercase tracking-wide">Winner</p>
                      <p className="text-white font-semibold text-sm">{cat.winner.recipientName}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleVisibility.mutate(cat.categoryId)}
                    disabled={toggleVisibility.isPending}
                    title={cat.isPubliclyVisible ? 'Hide from public site' : 'Make visible on public site'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      cat.isPubliclyVisible
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-white/15 hover:bg-white/25 text-white/80'
                    }`}
                  >
                    {cat.isPubliclyVisible ? (
                      <><Eye className="w-3.5 h-3.5" /> Visible</>
                    ) : (
                      <><EyeOff className="w-3.5 h-3.5" /> Hidden</>
                    )}
                  </button>
                </div>
              </div>

              {/* Nominees */}
              {cat.nominees.length === 0 ? (
                <div className="px-5 py-8 text-center text-gray-400 text-sm">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No nominees in this category
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cat.nominees.map((nominee: any, idx: number) => {
                    const isWinner = idx === 0 && cat.nominees[0].voteCount > 0
                    return (
                      <div
                        key={nominee.awardId}
                        className={`flex items-center gap-4 px-5 py-3 ${isWinner ? 'bg-amber-50' : ''}`}
                      >
                        {/* Rank */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isWinner
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {isWinner ? <Trophy className="w-3.5 h-3.5" /> : idx + 1}
                        </div>

                        {/* Photo */}
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0">
                          {nominee.recipientPhoto ? (
                            <img
                              src={buildImageUrl(nominee.recipientPhoto)}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10">
                              <span className="text-primary text-xs font-bold">
                                {nominee.recipientName?.[0]}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Name */}
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium ${isWinner ? 'text-amber-700' : 'text-gray-900'}`}>
                            {nominee.recipientName}
                            {isWinner && (
                              <Medal className="inline w-3.5 h-3.5 text-amber-500 ml-1.5 -mt-0.5" />
                            )}
                          </p>
                          {nominee.memberNumber && (
                            <p className="text-xs text-gray-400">{nominee.memberNumber}</p>
                          )}
                        </div>

                        {/* Votes */}
                        <div className="text-right shrink-0">
                          <p className={`text-lg font-bold ${isWinner ? 'text-amber-600' : 'text-gray-700'}`}>
                            {nominee.voteCount}
                          </p>
                          <p className="text-xs text-gray-400">votes</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
