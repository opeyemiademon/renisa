'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Plus, Download, Package, Monitor } from 'lucide-react'
import { getMyIDCardRequests, getIDCardSettings } from '@/lib/api_services/idCardApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { DataTable } from '@/components/shared/DataTable'
import { PageLoader } from '@/components/shared/Spinner'
import { formatCurrency, formatDate, buildImageUrl } from '@/lib/utils'

export default function IDCardPage() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['my-id-cards'],
    queryFn: getMyIDCardRequests,
  })

  const { data: settings } = useQuery({
    queryKey: ['id-card-settings'],
    queryFn: getIDCardSettings,
  })

  if (isLoading) return <PageLoader />

  const allRequests: any[] = requests || []
  const latestRequest = allRequests[0]
  const hasActiveRequest = latestRequest && (latestRequest.adminStatus === 'pending' || latestRequest.adminStatus === 'approved')

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My ID Card</h2>
        {!hasActiveRequest && settings?.isEnabled && (
          <Link href="/member/id-card/request">
            <Button iconLeft={<Plus className="w-4 h-4" />}>Request ID Card</Button>
          </Link>
        )}
      </div>

      {settings && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Monitor className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Online ID Card</h3>
            </div>
            <p className="text-2xl font-bold text-primary mb-2">{formatCurrency(settings.onlineFee)}</p>
            <p className="text-gray-500 text-sm">Digital PDF card delivered instantly after approval</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Physical ID Card</h3>
            </div>
            <p className="text-2xl font-bold text-primary mb-2">{formatCurrency(settings.physicalFee)}</p>
            <p className="text-gray-500 text-sm">Printed card delivered to your address</p>
          </div>
        </div>
      )}

      {latestRequest?.adminStatus === 'approved' && latestRequest.requestType === 'online' && latestRequest.cardUrl && (
        <div className="bg-primary/5 border border-primary rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">Your ID card is ready!</p>
            <p className="text-sm text-gray-500">Click to download your digital ID card</p>
          </div>
          <a href={buildImageUrl(latestRequest.cardUrl)} download="RENISA-ID-Card.pdf">
            <Button iconLeft={<Download className="w-4 h-4" />}>Download</Button>
          </a>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-semibold text-gray-900">ID Card Requests</h3>
        </div>
        <DataTable
          columns={[
            { key: 'date', header: 'Date', render: (row) => formatDate(row.createdAt) },
            { key: 'type', header: 'Type', render: (row) => <span className="capitalize">{row.requestType}</span> },
            { key: 'payment', header: 'Payment', render: (row) => <Badge variant={row.paymentStatus}>{row.paymentStatus}</Badge> },
            { key: 'status', header: 'Status', render: (row) => <Badge variant={row.adminStatus}>{row.adminStatus}</Badge> },
            {
              key: 'delivery',
              header: 'Delivery',
              render: (row) =>
                row.requestType === 'physical' && row.deliveryStatus ? (
                  <Badge variant={row.deliveryStatus}>{row.deliveryStatus}</Badge>
                ) : (
                  <span className="text-gray-300">—</span>
                ),
            },
          ]}
          data={allRequests}
          emptyMessage="No ID card requests yet"
          keyExtractor={(row) => row.id}
        />
      </div>
    </div>
  )
}
