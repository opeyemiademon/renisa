'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { CreditCard, Vote, IdCard, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { getMemberPayments } from '@/lib/api_services/paymentApiServices'
import { getAllElections } from '@/lib/api_services/electionApiServices'
import { getMyIDCardRequests } from '@/lib/api_services/idCardApiServices'
import { StatCard } from '@/components/shared/StatCard'
import { DataTable } from '@/components/shared/DataTable'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { buildImageUrl, formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { SAMPLE_MEMBER, SAMPLE_MEMBER_PAYMENTS, SAMPLE_MEMBER_ELECTIONS, SAMPLE_MEMBER_ID_CARD_REQUESTS } from '@/lib/sampleData'

export default function MemberDashboardPage() {
  const { member: authMember } = useAppSelector((s) => s.auth)
  const member = authMember || SAMPLE_MEMBER as any

  const { data: payments } = useQuery({
    queryKey: ['my-payments', member?.id],
    queryFn: () => getMemberPayments(member!.id),
    enabled: !!authMember?.id,
  })

  const { data: electionsResult } = useQuery({
    queryKey: ['active-elections'],
    queryFn: () => getAllElections(),
  })

  const { data: idCardRequests } = useQuery({
    queryKey: ['my-id-cards'],
    queryFn: getMyIDCardRequests,
    enabled: !!authMember,
  })

  const allPayments: any[] = (payments && payments.length > 0) ? payments : SAMPLE_MEMBER_PAYMENTS
  const recentPayments = allPayments.slice(0, 5)
  const allElections = SAMPLE_MEMBER_ELECTIONS;//(electionsResult?.data && electionsResult.data.length > 0) ? electionsResult.data : SAMPLE_MEMBER_ELECTIONS
  const activeElections = allElections.filter((e: any) => e.status === 'active')
  const latestIDCard = idCardRequests?.[0] || SAMPLE_MEMBER_ID_CARD_REQUESTS[0] as any

  const completedFields = member
    ? [
        member.firstName, member.lastName, member.email, member.phone,
        member.address, member.profilePicture, member.sport, member.state,
      ].filter(Boolean).length
    : 0
  const profileCompletion = Math.round((completedFields / 8) * 100)

  const latestPayment = payments?.[0]
  const isDuesPaid = latestPayment?.status === 'completed' && latestPayment?.year === new Date().getFullYear()

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#1a6b3a] to-[#2d9a57] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 flex-shrink-0 bg-white/20">
            {member?.profilePicture ? (
              <img src={buildImageUrl(member.profilePicture)} alt={member.firstName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {member ? getInitials(`${member.firstName} ${member.lastName}`) : 'M'}
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {member ? `${member.firstName} ${member.lastName}` : 'Member'}
            </h2>
            <p className="text-white/80 text-sm">{member?.memberNumber}</p>
            <p className="text-white/70 text-sm mt-0.5">{member?.sport} • {member?.state}</p>
            <div className="mt-2">
              <Badge variant={member?.status || 'active'} className="text-xs capitalize">
                {member?.status}
              </Badge>
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
        <StatCard
          title="Active Elections"
          value={activeElections.length}
          icon={<Vote className="w-5 h-5" />}
          variant="white"
        />
        <StatCard
          title="Profile Completion"
          value={`${profileCompletion}%`}
          icon={<CheckCircle className="w-5 h-5" />}
          variant={profileCompletion >= 100 ? 'green' : 'white'}
        />
        <StatCard
          title="Total Payments"
          value={payments?.length || 0}
          icon={<CreditCard className="w-5 h-5" />}
          variant="white"
        />
      </div>

      {/* Active Election Alert */}
      {activeElections.length > 0 && (
        <div className="bg-[#d4a017]/10 border border-[#d4a017] rounded-xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Vote className="w-6 h-6 text-[#d4a017]" />
            <div>
              <p className="font-semibold text-gray-900">
                Active Election: {activeElections[0].title}
              </p>
              <p className="text-sm text-gray-600">
                Ends {formatDate(activeElections[0].endDate)}
              </p>
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
            <Link href="/member/id-card/request">
              <Button size="sm">Request ID Card</Button>
            </Link>
          )}
        </div>
        {latestIDCard ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 capitalize">Type: {latestIDCard.requestType}</p>
              <p className="text-sm text-gray-600">
                Payment: <Badge variant={latestIDCard.paymentStatus}>{latestIDCard.paymentStatus}</Badge>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Status: <Badge variant={latestIDCard.adminStatus}>{latestIDCard.adminStatus}</Badge>
              </p>
            </div>
            {latestIDCard.adminStatus === 'approved' && latestIDCard.requestType === 'online' && latestIDCard.cardUrl && (
              <a href={buildImageUrl(latestIDCard.cardUrl)} download>
                <Button size="sm" variant="secondary">Download Card</Button>
              </a>
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
          <Link href="/member/payments" className="text-[#1a6b3a] text-sm hover:underline">
            View all
          </Link>
        </div>
        <DataTable
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
