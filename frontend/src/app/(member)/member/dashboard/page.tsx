'use client'

import { useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { CreditCard, Vote, IdCard, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { getMemberPayments } from '@/lib/api_services/paymentApiServices'
import { getAllElections } from '@/lib/api_services/electionApiServices'
import { getMyIDCardRequests, getIDCardSettings } from '@/lib/api_services/idCardApiServices'
import { StatCard } from '@/components/shared/StatCard'
import { DataTable } from '@/components/shared/DataTable'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { PageLoader } from '@/components/shared/Spinner'
import { IDCardFrontPreview } from '@/components/member/IDCardFrontPreview'
import { IDCardBackPreview } from '@/components/member/IDCardBackPreview'
import { buildMemberForIdCardPreview } from '@/lib/idCardMember'
import { resolveIdCardPhotoForExport } from '@/lib/idCardPhoto'
import { downloadMemberIdCardPdf } from '@/lib/idCardPdf'
import { useMemberPosition } from '@/hooks/useMemberPosition'
import { buildImageUrl, formatCurrency, formatDate, getInitials } from '@/lib/utils'
import type { IDCardRequest } from '@/types'
import toast from 'react-hot-toast'

export default function MemberDashboardPage() {
  const { member } = useAppSelector((s) => s.auth)
  const frontCardRef = useRef<HTMLDivElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)
  const [hiddenExport, setHiddenExport] = useState<{ photoUrl: string } | null>(null)
  const [pdfWorking, setPdfWorking] = useState(false)

  const cardMember = useMemo(
    () => (member ? buildMemberForIdCardPreview(member) : null),
    [member]
  )
  const memberPosition = useMemberPosition(member?.id)

  const { data: idCardSettings } = useQuery({
    queryKey: ['id-card-settings'],
    queryFn: getIDCardSettings,
    enabled: !!member,
  })
  const previewSettings = idCardSettings
    ? { headerText: idCardSettings.headerText, footerText: idCardSettings.footerText, validityYears: idCardSettings.validityYears }
    : null

  const handleDownloadPdf = async (row: IDCardRequest) => {
    if (!member) return toast.error('Sign in again to download your card.')
    const tid = toast.loading('Preparing your ID card PDF…')
    setPdfWorking(true)
    try {
      const photoSrc = await resolveIdCardPhotoForExport(row.photo, member.profilePicture)
      flushSync(() => setHiddenExport({ photoUrl: photoSrc }))
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))
      const front = frontCardRef.current
      const back = backCardRef.current
      if (!front || !back) throw new Error('Card preview not ready. Please try again.')
      await downloadMemberIdCardPdf(front, back, `RENISA-ID-${member.memberNumber}`)
      toast.success('ID card PDF downloaded')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not create PDF')
    } finally {
      toast.dismiss(tid)
      flushSync(() => setHiddenExport(null))
      setPdfWorking(false)
    }
  }

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['my-payments', member?.id],
    queryFn: () => getMemberPayments(member!.id),
    enabled: !!member?.id,
    staleTime: 0,
  })

  const { data: elections } = useQuery({
    queryKey: ['active-elections'],
    queryFn: getAllElections,
  })

  const { data: idCardRequests } = useQuery({
    queryKey: ['my-id-cards'],
    queryFn: getMyIDCardRequests,
    enabled: !!member,
  })

  if (!member) return <PageLoader />

  const recentPayments = (payments || []).slice(0, 5)
  const activeElections = (elections || []).filter((e: any) => e.status === 'active')
  const latestIDCard = idCardRequests?.[0]

  const completedFields = [
    member.firstName, member.lastName, member.email, member.phone,
    member.address, member.profilePicture, member.sport, member.state,
  ].filter(Boolean).length
  const profileCompletion = Math.round((completedFields / 8) * 100)

  const latestPayment = payments?.[0]
  const isDuesPaid = (latestPayment?.status === 'completed' || (latestPayment?.status as string) === 'successful') && latestPayment?.year === new Date().getFullYear()

  return (
    <div className="space-y-6">
      {/* Hidden ID card render target for PDF export */}
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
            position={memberPosition || undefined}
          />
          <IDCardBackPreview ref={backCardRef} member={cardMember} settings={previewSettings} />
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#1a6b3a] to-[#2d9a57] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 shrink-0 bg-white/20">
            {member.profilePicture ? (
              <img src={buildImageUrl(member.profilePicture)} alt={member.firstName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {getInitials(`${member.firstName} ${member.lastName}`)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{member.firstName} {member.lastName}</h2>
            <p className="text-white/80 text-sm">{member.memberNumber}</p>
            <p className="text-white/70 text-sm mt-0.5">{member.sport} · {member.state}</p>
            <div className="mt-2">
              <Badge variant={member.status || 'active'} className="text-xs capitalize">{member.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Dues Status"
          value={isDuesPaid ? 'Paid' : 'Pending'}
          icon={isDuesPaid ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          variant={isDuesPaid ? 'green' : 'white'}
        />
        <StatCard title="Active Elections" value={activeElections.length} icon={<Vote className="w-5 h-5" />} variant="white" />
        <StatCard
          title="Profile"
          value={`${profileCompletion}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          variant={profileCompletion >= 100 ? 'green' : 'white'}
        />
        <StatCard title="Total Payments" value={payments?.length ?? 0} icon={<CreditCard className="w-5 h-5" />} variant="white" />
      </div>

      {/* Active Election Alert */}
      {activeElections.length > 0 && (
        <div className="bg-[#d4a017]/10 border border-[#d4a017] rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Vote className="w-6 h-6 text-[#d4a017] shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">Active Election: {activeElections[0].title}</p>
              <p className="text-sm text-gray-600">Ends {formatDate(activeElections[0].endDate)}</p>
            </div>
          </div>
          <Link href={`/member/elections/${activeElections[0].id}`}>
            <Button size="sm" variant="secondary">Vote Now</Button>
          </Link>
        </div>
      )}

      {/* ID Card Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <IdCard className="w-5 h-5 text-[#1a6b3a]" />
            ID Card
          </h3>
          {!latestIDCard && (
            <Link href="/member/id-card/request"><Button size="sm">Request ID Card</Button></Link>
          )}
        </div>
        {latestIDCard ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-600 capitalize">Type: {latestIDCard.requestType}</p>
              <p className="text-sm text-gray-600 flex items-center gap-2">Payment: <Badge variant={latestIDCard.paymentStatus}>{latestIDCard.paymentStatus}</Badge></p>
              <p className="text-sm text-gray-600 flex items-center gap-2">Status: <Badge variant={latestIDCard.adminStatus}>{latestIDCard.adminStatus}</Badge></p>
            </div>
            {latestIDCard.adminStatus === 'approved' && latestIDCard.requestType === 'online' && (
              <Button
                size="sm"
                variant="secondary"
                iconLeft={<Download className="w-4 h-4" />}
                loading={pdfWorking}
                disabled={pdfWorking}
                onClick={() => handleDownloadPdf(latestIDCard)}
              >
                Download PDF
              </Button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No ID card requests yet. Request your RENISA ID card today.</p>
        )}
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-semibold text-gray-900">Recent Payments</h3>
          <Link href="/member/payments" className="text-[#1a6b3a] text-sm hover:underline">View all</Link>
        </div>
        <DataTable
          loading={paymentsLoading}
          columns={[
            { key: 'date', header: 'Date', render: (row) => formatDate(row.createdAt) },
            { key: 'type', header: 'Type', render: (row) => row.paymentType?.name || '—' },
            { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
            { key: 'year', header: 'Year', render: (row) => String(row.year) },
            { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
          ]}
          data={recentPayments}
          emptyMessage="No payments yet"
          keyExtractor={(row) => row.id}
        />
      </div>
    </div>
  )
}
