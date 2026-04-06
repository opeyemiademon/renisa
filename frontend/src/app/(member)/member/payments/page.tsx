'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Plus, Download } from 'lucide-react'
import { getMemberPayments } from '@/lib/api_services/paymentApiServices'
import { DataTable } from '@/components/shared/DataTable'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Select } from '@/components/shared/Select'
import { useAppSelector } from '@/hooks/redux'
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

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

export default function MemberPaymentsPage() {
  const { member } = useAppSelector((s) => s.auth)
  const [yearFilter, setYearFilter] = useState('')
  const [printing, setPrinting] = useState<string | null>(null)

  const { data: payments, isLoading } = useQuery({
    queryKey: ['my-payments', member?.id],
    queryFn: () => getMemberPayments(member!.id),
    enabled: !!member?.id,
  })

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i
    return { value: String(y), label: String(y) }
  })

  const all: any[] = payments || []
  const filtered = yearFilter ? all.filter((p) => String(p.year) === yearFilter) : all

  const handleDownloadReceipt = async (row: any) => {
    setPrinting(row.id)
    try {
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
      const memberName = row.member
        ? `${row.member.firstName || ''} ${row.member.lastName || ''}`.trim()
        : `${member?.firstName || ''} ${member?.lastName || ''}`.trim()
      const memberNo = row.member?.memberNumber || member?.memberNumber || '—'

      const slipRows: [string, string][] = [
        ['Member Name', memberName],
        ['Member No.', memberNo],
        ['Payment Type', row.paymentType?.name || '—'],
        ['Amount', formatNumber(row.amount)],
        ['Year', String(row.year)],
        ['Status', (row.status || '').toUpperCase()],
        ['Transaction Ref', row.transactionRef || row.reference || '—'],
        ['Date', formatDate(row.createdAt)],
      ]
      const rowH = 13
      const boxH = 8 + slipRows.length * rowH + 4

      // Details box
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

      // Status badge
      const status = row.status || ''
      y += 6
      doc.setFillColor(status === 'successful' ? 220 : 255, status === 'successful' ? 243 : 220, status === 'successful' ? 230 : 220)
      doc.roundedRect(margin, y, 40, 10, 2, 2, 'F')
      doc.setFontSize(8)
      doc.setTextColor(status === 'successful' ? 26 : 160, status === 'successful' ? 107 : 50, status === 'successful' ? 58 : 50)
      doc.text(status.toUpperCase(), margin + 5, y + 7)

      // Footer
      const footerY = pageH - 12
      doc.setFillColor(26, 107, 58)
      doc.rect(0, footerY, pageW, 12, 'F')
      doc.setFontSize(7); doc.setTextColor(200, 230, 210)
      doc.text('This is an official RENISA payment acknowledgement.', margin, footerY + 5)
      doc.text(`Printed: ${new Date().toLocaleString()}`, pageW - margin, footerY + 5, { align: 'right' })

      doc.save(`payment-receipt-${row.transactionRef || row.id}.pdf`)
    } catch {
      toast.error('Failed to generate receipt')
    } finally {
      setPrinting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        <Link href="/member/payments/make-payment">
          <Button iconLeft={<Plus className="w-4 h-4" />}>Make Payment</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 items-end">
          <Select
            label="Filter by Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            options={[{ value: '', label: 'All Years' }, ...years]}
            className="w-40"
          />
          <div className="text-sm text-gray-500 pb-2">
            {filtered.length} payment{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <DataTable
          loading={isLoading}
          columns={[
            { key: 'date', header: 'REF & Date', render: (row) =><div> {
              row.transactionRef} <br/> {formatDate(row.createdAt)}</div>  },
            { key: 'type', header: 'Payment Type', render: (row) => row.paymentType?.name || '—' },
            { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
            { key: 'year', header: 'Year', render: (row) => String(row.year) },
            { key: 'method', header: 'Method', render: (row) => <span className="capitalize">{row.method || '—'}</span> },
            { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
            {
              key: 'actions',
              header: '',
              render: (row) =>
                row.status === 'successful' ? (
                  <button
                    onClick={() => handleDownloadReceipt(row)}
                    disabled={printing === row.id}
                    className="text-primary hover:text-primary/80 p-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
                    title="Download receipt"
                  >
                    <Download className={`w-4 h-4 ${printing === row.id ? 'animate-pulse' : ''}`} />
                  </button>
                ) : null,
            },
          ]}
          data={filtered}
          emptyMessage="No payments found"
          keyExtractor={(row) => row.id}
        />
      </div>
    </div>
  )
}
