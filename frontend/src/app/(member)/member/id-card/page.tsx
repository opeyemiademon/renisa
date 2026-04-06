'use client'

import { useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Plus, Download, Package, Monitor } from 'lucide-react'
import { getMyIDCardRequests, getIDCardSettings } from '@/lib/api_services/idCardApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { DataTable } from '@/components/shared/DataTable'
import { PageLoader } from '@/components/shared/Spinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { resolveIdCardPhotoForExport } from '@/lib/idCardPhoto'
import { buildMemberForIdCardPreview } from '@/lib/idCardMember'
import { downloadMemberIdCardPdf } from '@/lib/idCardPdf'
import { IDCardFrontPreview } from '@/components/member/IDCardFrontPreview'
import { IDCardBackPreview } from '@/components/member/IDCardBackPreview'
import { useAppSelector } from '@/hooks/redux'
import type { IDCardRequest } from '@/types'
import toast from 'react-hot-toast'

function canDownloadDigitalCard(row: IDCardRequest) {
  return row.requestType === 'online' && row.adminStatus === 'approved'
}

export default function IDCardPage() {
  const { member: authMember } = useAppSelector((s) => s.auth)
  const frontCardRef = useRef<HTMLDivElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)
  const [hiddenExport, setHiddenExport] = useState<{ photoUrl: string } | null>(null)
  const [pdfWorking, setPdfWorking] = useState(false)

  const { data: requests, isLoading } = useQuery({
    queryKey: ['my-id-cards'],
    queryFn: getMyIDCardRequests,
  })

  const { data: settings } = useQuery({
    queryKey: ['id-card-settings'],
    queryFn: getIDCardSettings,
  })

  const previewSettings = settings
    ? {
        headerText: settings.headerText,
        footerText: settings.footerText,
        validityYears: settings.validityYears,
      }
    : null

  const cardMember = useMemo(
    () => (authMember ? buildMemberForIdCardPreview(authMember) : null),
    [authMember]
  )

  const handleDownloadPdf = async (_row: IDCardRequest) => {
    if (!authMember) {
      toast.error('Sign in again to download your card.')
      return
    }
    if (typeof window === 'undefined') return
    const tid = toast.loading('Preparing your ID card PDF…')
    setPdfWorking(true)
    try {
      const photoSrc = await resolveIdCardPhotoForExport(_row.photo, authMember.profilePicture)
      flushSync(() => {
        setHiddenExport({ photoUrl: photoSrc })
      })
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      const front = frontCardRef.current
      const back = backCardRef.current
      if (!front || !back) {
        throw new Error('Card preview is not ready. Please try again.')
      }
      await downloadMemberIdCardPdf(front, back, `RENISA-ID-${authMember.memberNumber}`)
      toast.success('ID card PDF downloaded')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not create PDF')
    } finally {
      toast.dismiss(tid)
      flushSync(() => {
        setHiddenExport(null)
      })
      setPdfWorking(false)
    }
  }

  if (isLoading) return <PageLoader />

  const allRequests: IDCardRequest[] = requests || []
  const latestRequest = allRequests[0]
  const hasActiveRequest =
    latestRequest && (latestRequest.adminStatus === 'pending' || latestRequest.adminStatus === 'approved')
  const latestDigitalReady = allRequests.find((r) => canDownloadDigitalCard(r))

  return (
    <div className="space-y-6 max-w-3xl">
      {hiddenExport && cardMember && (
        <div
          aria-hidden
          style={{
            position: 'fixed',
            left: -12000,
            top: 0,
            width: 336,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            backgroundColor: '#ffffff',
          }}
        >
          <IDCardFrontPreview
            ref={frontCardRef}
            member={cardMember}
            photoUrl={hiddenExport.photoUrl || undefined}
            settings={previewSettings}
          />
          <IDCardBackPreview ref={backCardRef} member={cardMember} settings={previewSettings} />
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My ID Card</h2>
    
          <Link href="/member/id-card/request">
            <Button iconLeft={<Plus className="w-4 h-4" />}>Request ID Card</Button>
          </Link>
     
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
            <p className="text-gray-500 text-sm">
              After approval, download a print-ready PDF — same card you see in the app, standard ID-card size.
            </p>
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

      {latestDigitalReady && (
        <div className="bg-primary/5 border border-primary rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900">Your digital ID card is ready</p>
              <p className="text-sm text-gray-500">Download a two-page PDF — front and back.</p>
            </div>
            <Button
              iconLeft={<Download className="w-4 h-4" />}
              loading={pdfWorking}
              disabled={pdfWorking}
              onClick={() => handleDownloadPdf(latestDigitalReady)}
            >
              Download PDF
            </Button>
          </div>
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
            {
              key: 'actions',
              header: '',
              render: (row) =>
                canDownloadDigitalCard(row) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    iconLeft={<Download className="w-4 h-4" />}
                    loading={pdfWorking}
                    disabled={pdfWorking}
                    onClick={() => handleDownloadPdf(row)}
                  >
                    PDF
                  </Button>
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
