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
import { formatCurrency, formatDate } from '@/lib/utils'
import { SAMPLE_MEMBER_PAYMENTS } from '@/lib/sampleData'

export default function MemberPaymentsPage() {
  const { member } = useAppSelector((s) => s.auth)
  const [yearFilter, setYearFilter] = useState('')

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['my-payments', member?.id],
    queryFn: () => getMemberPayments(member!.id),
    enabled: !!member?.id,
  })

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - i
    return { value: String(y), label: String(y) }
  })

  const allPayments: any[] = (paymentsData && paymentsData.length > 0) ? paymentsData : SAMPLE_MEMBER_PAYMENTS
  const filtered = yearFilter
    ? allPayments.filter((p) => p.year === Number(yearFilter))
    : allPayments

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
        <Link href="/member/payments/make-payment">
          <Button iconLeft={<Plus className="w-4 h-4" />}>Make Payment</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex gap-4 items-end">
          <Select
            label="Filter by Year"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            options={years}
            placeholder="All Years"
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
            { key: 'date', header: 'Date', render: (row) => formatDate(row.createdAt) },
            { key: 'type', header: 'Payment Type', render: (row) => row.paymentType?.name || '—' },
            { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
            { key: 'year', header: 'Year', render: (row) => String(row.year) },
            { key: 'method', header: 'Method', render: (row) => <span className="capitalize">{row.method}</span> },
            { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
            {
              key: 'actions',
              header: '',
              render: (row) =>
                row.status === 'completed' ? (
                  <button className="text-[#1a6b3a] hover:text-[#0d4a25] p-1.5 rounded hover:bg-gray-100">
                    <Download className="w-4 h-4" />
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
