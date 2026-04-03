'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Download, Plus, Search, RotateCcw, ChevronDown, ChevronUp,
  MoreVertical, Printer, Trash2, FileText, X,
} from 'lucide-react'
import { getAllPayments, adminRecordPayment, deletePayment } from '@/lib/api_services/paymentApiServices'
import { getPaymentTypes } from '@/lib/api_services/paymentTypeApiServices'
import { getAllMembers } from '@/lib/api_services/memberApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { formatDate, formatCurrency, formatNumber, downloadCSV } from '@/lib/utils'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 10 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}))

// ─── helpers ────────────────────────────────────────────────────────────────
async function loadImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
function imgFmt(d: string) { return d.startsWith('data:image/png') ? 'PNG' : 'JPEG' }

// ─── Row action menu ─────────────────────────────────────────────────────────
function RowMenu({ row, index, onPrint, onDelete }: {
  row: any; index: number; onPrint: () => void; onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  const openUp = index >= 15
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 transition-colors" title="Actions">
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className={`absolute right-0 z-50 w-48 bg-white rounded-xl border border-gray-200 shadow-xl py-1 ${openUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}>
          <button onClick={() => { setOpen(false); onPrint() }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">
            <Printer className="w-4 h-4" /> Print 
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button onClick={() => { setOpen(false); onDelete() }} className="w-full flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-gray-50 text-red-500">
            <Trash2 className="w-4 h-4" /> Delete Payment
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const queryClient = useQueryClient()

  // ── filter state (draft vs applied) ──
  interface FilterState { status: string; year: string; paymentTypeId: string; dateFrom: string; dateTo: string; reference: string }
  const emptyFilter: FilterState = { status: '', year: '', paymentTypeId: '', dateFrom: '', dateTo: '', reference: '' }
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(emptyFilter)
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [liveSearch, setLiveSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const setField = (f: keyof FilterState, v: string) => setFilter(p => ({ ...p, [f]: v }))
  const hasActiveFilters = Object.values(appliedFilter).some(v => v !== '')

  // ── record payment modal ──
  const [showRecord, setShowRecord] = useState(false)
  const [recordForm, setRecordForm] = useState({ memberId: '', paymentTypeId: '', amount: '', year: String(currentYear), reference: '' })
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState<{ id: string; firstName: string; lastName: string; memberNumber: string } | null>(null)

  // ── delete state ──
  const [deleteTarget, setDeleteTarget] = useState<any>(null)

  // ── queries ──
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['payments', appliedFilter],
    queryFn: () => {
      const vars: Record<string, any> = {}
      if (appliedFilter.status) vars.status = appliedFilter.status
      if (appliedFilter.year) vars.year = parseInt(appliedFilter.year)
      if (appliedFilter.paymentTypeId) vars.paymentTypeId = appliedFilter.paymentTypeId
      if (appliedFilter.dateFrom) vars.dateFrom = appliedFilter.dateFrom
      if (appliedFilter.dateTo) vars.dateTo = appliedFilter.dateTo
      if (appliedFilter.reference) vars.reference = appliedFilter.reference
      return getAllPayments(Object.keys(vars).length ? vars : undefined)
    },
  })

  const { data: paymentTypesData } = useQuery({ queryKey: ['payment-types'], queryFn: () => getPaymentTypes() })

  const { data: membersData } = useQuery({
    queryKey: ['members-search', memberSearch],
    queryFn: () => getAllMembers({ search: memberSearch }),
    enabled: showRecord && memberSearch.length >= 3,
  })

  // ── mutations ──
  const recordMutation = useMutation({
    mutationFn: () => adminRecordPayment({
      memberId: recordForm.memberId,
      paymentTypeId: recordForm.paymentTypeId,
      amount: parseFloat(recordForm.amount),
      year: parseInt(recordForm.year),
      reference: recordForm.reference || undefined,
    }),
    onSuccess: () => {
      toast.success('Payment recorded successfully')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      setShowRecord(false)
      setRecordForm({ memberId: '', paymentTypeId: '', amount: '', year: String(currentYear), reference: '' })
      setMemberSearch(''); setSelectedMember(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePayment(id),
    onSuccess: () => {
      toast.success('Payment deleted')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      setDeleteTarget(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const allPayments = (data || []) as any[]
  const paymentTypes = (paymentTypesData || []) as any[]

  const liveFiltered = liveSearch.trim()
    ? allPayments.filter((p: any) => {
        const q = liveSearch.toLowerCase()
        return (
          `${p.member?.firstName} ${p.member?.lastName}`.toLowerCase().includes(q) ||
          p.member?.memberNumber?.toLowerCase().includes(q) ||
          p.reference?.toLowerCase().includes(q) ||
          p.transactionRef?.toLowerCase().includes(q)
        )
      })
    : allPayments

  const visibleRows = liveFiltered.slice(0, visibleCount)

  const handleSearch = () => { setAppliedFilter({ ...filter }); setVisibleCount(20) }
  const handleReset = () => { setFilter(emptyFilter); setAppliedFilter(emptyFilter); setVisibleCount(20) }

  // ── print acknowledgement slip ──
  const handlePrint = async (row: any) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 14

    let logoBase64: string | null = null
    try { logoBase64 = await loadImageAsBase64('/logo.png') } catch {}

    // Header
    doc.setFillColor(26, 107, 58)
    doc.rect(0, 0, pageW, 32, 'F')
    if (logoBase64) {
      doc.addImage(logoBase64, imgFmt(logoBase64), margin, 4, 22, 22)
      doc.setFontSize(13); doc.setTextColor(255)
      doc.text('RENISA', margin + 26, 13)
      doc.setFontSize(8); doc.setTextColor(200, 230, 210)
      doc.text('Retired Nigerian Women & Men Sports Association', margin + 26, 19)
      doc.setFontSize(10); doc.setTextColor(255)
      doc.text('Payment Acknowledgement Slip', margin + 26, 26)
    } else {
      doc.setFontSize(13); doc.setTextColor(255)
      doc.text('RENISA', margin, 13)
      doc.setFontSize(8); doc.setTextColor(200, 230, 210)
      doc.text('Retired Nigerian Women & Men Sports Association', margin, 19)
      doc.setFontSize(10); doc.setTextColor(255)
      doc.text('Payment Acknowledgement Slip', margin, 26)
    }

    let y = 42
    const slipRows: [string, string][] = [
      ['Member Name', `${row.member?.firstName || ''} ${row.member?.lastName || ''}`.trim()],
      ['Member No.', row.member?.memberNumber || '—'],
      ['Payment Type', row.paymentType?.name || '—'],
      ['Amount', formatNumber(row.amount)],
      ['Year', String(row.year)],
      ['Status', (row.status || '').toUpperCase()],
      ['Transaction Ref', row.transactionRef || row.reference || '—'],
      ['Date', formatDate(row.createdAt)],
    ]
    const rowH = 13
    const boxH = 8 + slipRows.length * rowH + 4

    // Details box — tall enough to cover all rows including Date
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, y, pageW - margin * 2, boxH, 3, 3, 'F')
    doc.setDrawColor(220); doc.setLineWidth(0.3)
    doc.roundedRect(margin, y, pageW - margin * 2, boxH, 3, 3, 'S')

    y += 8
    slipRows.forEach(([label, value], i) => {
      doc.setFontSize(7.5); doc.setTextColor(120)
      doc.text(label, margin + 4, y)
      doc.setFontSize(9); doc.setTextColor(30)
      doc.text(String(value), margin + 4, y + 5)
      if (i < slipRows.length - 1) {
        doc.setDrawColor(235); doc.setLineWidth(0.2)
        doc.line(margin + 4, y + 8, pageW - margin - 4, y + 8)
      }
      y += rowH
    })

    // Status badge below box
    const status = row.status || ''
    y += 6
    doc.setFillColor(status === 'successful' ? 220 : 255, status === 'successful' ? 243 : 220, status === 'successful' ? 230 : 220)
    doc.roundedRect(margin, y, 40, 10, 2, 2, 'F')
    doc.setFontSize(8); doc.setTextColor(status === 'successful' ? 26 : 160, status === 'successful' ? 107 : 50, status === 'successful' ? 58 : 50)
    doc.text(status.toUpperCase(), margin + 5, y + 7)

    // Footer
    const footerY = pageH - 12
    doc.setFillColor(26, 107, 58)
    doc.rect(0, footerY, pageW, 12, 'F')
    doc.setFontSize(7); doc.setTextColor(200, 230, 210)
    doc.text('This is an official RENISA payment acknowledgement.', margin, footerY + 5)
    doc.text(`Printed: ${new Date().toLocaleString()}`, pageW - margin, footerY + 5, { align: 'right' })

    doc.save(`payment-slip-${row.transactionRef || row.id}.pdf`)
  }

  // ── export all PDF ──
  const handleExportPDF = async () => {
    if (!allPayments.length) return toast.error('No data to export')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageW = doc.internal.pageSize.getWidth()
    const margin = 12

    let logoBase64: string | null = null
    try { logoBase64 = await loadImageAsBase64('/logo.png') } catch {}

    doc.setFillColor(26, 107, 58)
    doc.rect(0, 0, pageW, 22, 'F')
    if (logoBase64) {
      doc.addImage(logoBase64, imgFmt(logoBase64), margin, 3, 16, 16)
      doc.setFontSize(14); doc.setTextColor(255)
      doc.text('RENISA — Payments Report', margin + 19, 10)
      doc.setFontSize(8); doc.setTextColor(200, 230, 210)
      doc.text(`Generated: ${new Date().toLocaleString()}   ·   Total: ${allPayments.length} payment(s)`, margin + 19, 17)
    } else {
      doc.setFontSize(14); doc.setTextColor(255)
      doc.text('RENISA — Payments Report', margin, 10)
      doc.setFontSize(8); doc.setTextColor(200, 230, 210)
      doc.text(`Generated: ${new Date().toLocaleString()}   ·   Total: ${allPayments.length} payment(s)`, margin, 17)
    }

    let y = 28
    if (hasActiveFilters) {
      const activeDesc = Object.entries(appliedFilter).filter(([, v]) => v)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').trim()}: ${v}`).join('   |   ')
      doc.setFontSize(7.5); doc.setTextColor(80)
      doc.text(`Active filters: ${activeDesc}`, margin, y); y += 6
    }

    const colWidths = [8, 38, 32, 32, 22, 20, 18, 36, 26]
    const cols = ['#', 'Member', 'Payment Type', 'Transaction Ref', 'Amount', 'Year', 'Status', 'Method', 'Date']
    const headerH = 8; const rowHeight = 7

    doc.setFillColor(26, 107, 58)
    doc.rect(margin, y, pageW - margin * 2, headerH, 'F')
    doc.setFontSize(7.5); doc.setTextColor(255)
    let x = margin
    cols.forEach((col, i) => { doc.text(col, x + 1.5, y + 5.5); x += colWidths[i] })
    y += headerH

    allPayments.forEach((p: any, idx: number) => {
      if (y + rowHeight > doc.internal.pageSize.getHeight() - 10) {
        doc.addPage(); y = 14
        doc.setFillColor(26, 107, 58)
        doc.rect(margin, y, pageW - margin * 2, headerH, 'F')
        doc.setTextColor(255); let hx = margin
        cols.forEach((col, i) => { doc.text(col, hx + 1.5, y + 5.5); hx += colWidths[i] })
        y += headerH
      }
      const isEven = idx % 2 === 0
      doc.setFillColor(isEven ? 245 : 255, isEven ? 250 : 255, isEven ? 247 : 255)
      doc.rect(margin, y, pageW - margin * 2, rowHeight, 'F')
      doc.setTextColor(50); doc.setFontSize(7)
      const cells = [
        String(idx + 1),
        `${p.member?.firstName || ''} ${p.member?.lastName || ''}`.trim(),
        p.paymentType?.name || '—',
        p.transactionRef || p.reference || '—',
        formatNumber(p.amount),
        String(p.year),
        p.status || '—',
        p.paymentMethod || '—',
        formatDate(p.createdAt),
      ]
      let cx = margin
      cells.forEach((cell, i) => {
        const text = doc.splitTextToSize(String(cell), colWidths[i] - 3)[0] || ''
        doc.text(text, cx + 1.5, y + 5); cx += colWidths[i]
      })
      doc.setDrawColor(220); doc.rect(margin, y, pageW - margin * 2, rowHeight, 'S')
      y += rowHeight
    })

    doc.setFontSize(7); doc.setTextColor(160)
    doc.text(`RENISA Payments Report — ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.getHeight() - 6)
    doc.save('renisa-payments.pdf')
  }

  // ── export CSV / Excel ──
  const handleExportCSV = () => {
    if (!allPayments.length) return toast.error('No data to export')
    const rows = [
      ['#', 'Member Name', 'Member No.', 'Payment Type', 'Transaction Ref', 'Amount', 'Year', 'Status', 'Method', 'Reference', 'Date'],
      ...allPayments.map((p: any, i: number) => [
        i + 1,
        `${p.member?.firstName || ''} ${p.member?.lastName || ''}`.trim(),
        p.member?.memberNumber || '—',
        p.paymentType?.name || '—',
        p.transactionRef || '—',
        p.amount,
        p.year,
        p.status || '—',
        p.paymentMethod || '—',
        p.reference || '—',
        formatDate(p.createdAt),
      ]),
    ]
    downloadCSV(rows, 'renisa-payments.csv')
    toast.success('CSV exported')
  }

  const typeOptions = [
    { value: '', label: 'All Types' },
    ...paymentTypes.map((t: any) => ({ value: t.id, label: t.name })),
  ]

  const closeRecord = () => { setShowRecord(false); setMemberSearch(''); setSelectedMember(null) }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
          {hasActiveFilters && (
            <p className="text-xs text-[#1a6b3a] mt-0.5">{allPayments.length} result(s) matching filters</p>
          )}
        </div>
      </div>

      {/* ── Filter panel ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#1a6b3a]" />
            <span>Search & Filter</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-[#1a6b3a] text-white text-xs">
                {Object.values(appliedFilter).filter(Boolean).length} active
              </span>
            )}
          </div>
          {filtersOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {filtersOpen && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select
                label="Status"
                value={filter.status}
                onChange={e => setField('status', e.target.value)}
                placeholder="All Statuses"
                options={[
                  { value: 'successful', label: 'Successful' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'failed', label: 'Failed' },
                ]}
              />
              <Select
                label="Year"
                value={filter.year}
                onChange={e => setField('year', e.target.value)}
                placeholder="All Years"
                options={yearOptions}
              />
              <Select
                label="Payment Type"
                value={filter.paymentTypeId}
                onChange={e => setField('paymentTypeId', e.target.value)}
                options={typeOptions}
              />
              <Input label="Date From" type="date" value={filter.dateFrom} onChange={e => setField('dateFrom', e.target.value)} />
              <Input label="Date To" type="date" value={filter.dateTo} onChange={e => setField('dateTo', e.target.value)} />
              <Input label="Reference / Transaction Ref" placeholder="e.g. RENISA-ADMIN-..." value={filter.reference} onChange={e => setField('reference', e.target.value)} />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button onClick={handleSearch} loading={isFetching} iconLeft={<Search className="w-4 h-4" />}>Search</Button>
              <Button variant="outline" onClick={handleReset} iconLeft={<RotateCcw className="w-4 h-4" />}>Reset</Button>
              {hasActiveFilters && <span className="text-sm text-gray-500 ml-1">{allPayments.length} payment(s) found</span>}
            </div>
          </div>
        )}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3">
        {/* Live search — left */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search member, ref..."
            value={liveSearch}
            onChange={e => { setLiveSearch(e.target.value); setVisibleCount(20) }}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 bg-white"
          />
          {liveSearch && (
            <button onClick={() => setLiveSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Actions — right */}
        <div className="flex items-center gap-2 shrink-0">
          {liveSearch && <span className="text-xs text-gray-500">{liveFiltered.length} result(s)</span>}
          <Button variant="outline" size="sm" iconLeft={<FileText className="w-4 h-4" />} onClick={handleExportPDF}>PDF</Button>
          <Button variant="outline" size="sm" iconLeft={<Download className="w-4 h-4" />} onClick={handleExportCSV}>CSV</Button>
          <Button size="sm" iconLeft={<Plus className="w-4 h-4" />} onClick={() => setShowRecord(true)}>Record Payment</Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-3 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-10">SN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Payment Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Year</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Reference</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#1a6b3a] border-t-transparent animate-spin" />
                      Searching...
                    </div>
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                    {liveSearch ? `No results for "${liveSearch}".` : hasActiveFilters ? 'No payments match your filters.' : 'No payments found.'}
                  </td>
                </tr>
              ) : (
                visibleRows.map((row: any, idx: number) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3"><span className="text-xs text-gray-400 font-mono">{idx + 1}</span></td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.member?.firstName} {row.member?.lastName}</p>
                      <p className="text-xs text-gray-400">{row.member?.memberNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.paymentType?.name || '—'}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-3 text-gray-600">{String(row.year)}</td>
                    <td className="px-4 py-3"><Badge variant={row.status}>{row.status}</Badge></td>
                    <td className="px-4 py-3"><span className="font-mono text-xs text-gray-500">{row.transactionRef || row.reference || '—'}</span></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(row.createdAt)}</td>
                    <td className="px-3 py-3">
                      <RowMenu
                        row={row}
                        index={idx}
                        onPrint={() => handlePrint(row)}
                        onDelete={() => setDeleteTarget(row)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < liveFiltered.length && (
          <div className="px-4 py-4 border-t border-gray-100 text-center">
            <button
              onClick={() => setVisibleCount(v => v + 20)}
              className="text-sm text-[#1a6b3a] hover:underline font-medium"
            >
              Load More ({liveFiltered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* ── Record Payment Modal ── */}
      <Modal isOpen={showRecord} onClose={closeRecord} title="Record Manual Payment" size="md">
        <div className="space-y-4">
          {selectedMember ? (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Member</label>
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#1a6b3a] bg-[#f0faf4]">
                <div>
                  <span className="font-medium text-gray-900 text-sm">{selectedMember.firstName} {selectedMember.lastName}</span>
                  <span className="text-gray-400 text-xs ml-2">{selectedMember.memberNumber}</span>
                </div>
                <button
                  onClick={() => { setSelectedMember(null); setRecordForm(p => ({ ...p, memberId: '' })); setMemberSearch('') }}
                  className="text-xs text-red-500 hover:underline ml-3 shrink-0"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Input
                label="Search Member (name or member number)"
                placeholder="Type at least 3 characters..."
                value={memberSearch}
                onChange={e => setMemberSearch(e.target.value)}
              />
              {membersData && (membersData as any[]).length > 0 && memberSearch.length >= 3 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden max-h-40 overflow-y-auto mt-1">
                  {(membersData as any[]).map((m: any) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMember({ id: m.id, firstName: m.firstName, lastName: m.lastName, memberNumber: m.memberNumber })
                        setRecordForm(p => ({ ...p, memberId: m.id }))
                        setMemberSearch('')
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium">{m.firstName} {m.lastName}</span>
                      <span className="text-gray-400 ml-2">{m.memberNumber}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <Select
            label="Payment Type"
            value={recordForm.paymentTypeId}
            onChange={e => {
              const typeId = e.target.value
              const pt = paymentTypes.find((t: any) => t.id === typeId)
              setRecordForm(p => ({ ...p, paymentTypeId: typeId, amount: pt?.amount != null ? String(pt.amount) : p.amount }))
            }}
            options={[{ value: '', label: 'Select payment type...' }, ...paymentTypes.map((t: any) => ({ value: t.id, label: t.name }))]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount (₦)"
              type="number"
              disabled
              value={recordForm.amount}
              onChange={e => setRecordForm(p => ({ ...p, amount: e.target.value }))}
            />
            <Select
              label="Year"
              value={recordForm.year}
              onChange={e => setRecordForm(p => ({ ...p, year: e.target.value }))}
              options={yearOptions}
            />
          </div>

          <Input
            label="Reference (optional)"
            placeholder="Bank teller or receipt number"
            value={recordForm.reference}
            onChange={e => setRecordForm(p => ({ ...p, reference: e.target.value }))}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={closeRecord} className="flex-1">Cancel</Button>
            <Button
              onClick={() => recordMutation.mutate()}
              loading={recordMutation.isPending}
              className="flex-1"
              disabled={!recordForm.memberId || !recordForm.paymentTypeId || !recordForm.amount}
            >
              Record Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete confirm ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Delete Payment"
        message={`Are you sure you want to permanently delete this payment record (${deleteTarget?.transactionRef || ''})? This action cannot be undone.`}
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
