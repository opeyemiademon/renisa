'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, CreditCard, Vote, Calendar, Heart, IdCard } from 'lucide-react'
import { getDashboardStats } from '@/lib/api_services/dashboardApiServices'
import { StatCard } from '@/components/shared/StatCard'
import { DataTable } from '@/components/shared/DataTable'
import { Badge } from '@/components/shared/Badge'
import { PageLoader } from '@/components/shared/Spinner'
import { formatCurrency, formatDate, buildImageUrl } from '@/lib/utils'
import { SAMPLE_DASHBOARD_STATS } from '@/lib/sampleData'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = ['#1a6b3a', '#d4a017', '#2d9a57', '#0d4a25', '#e8b830', '#b88c12']

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

/*   if (isLoading) return <PageLoader /> */
  const displayStats = (stats || SAMPLE_DASHBOARD_STATS) as typeof SAMPLE_DASHBOARD_STATS

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={displayStats.totalMembers} icon={<Users className="w-5 h-5" />} variant="green" />
        <StatCard title="Active Members" value={displayStats.activeMembers} icon={<Users className="w-5 h-5" />} variant="white" />
        <StatCard title="Payments (Year)" value={formatCurrency(displayStats.totalPaymentsThisYear)} icon={<CreditCard className="w-5 h-5" />} variant="gold" />
        <StatCard title="Total Donations" value={formatCurrency(displayStats.totalDonations)} icon={<Heart className="w-5 h-5" />} variant="white" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Membership Growth */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Membership Growth</h3>
          {displayStats.memberGrowth && displayStats.memberGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={displayStats.memberGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
                <Line type="monotone" dataKey="count" stroke="#1a6b3a" strokeWidth={2.5} dot={{ fill: '#d4a017', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300">No data yet</div>
          )}
        </div>

        {/* Payment Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Payment Type Distribution</h3>
          {displayStats.paymentTypeDistribution && displayStats.paymentTypeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={displayStats.paymentTypeDistribution}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {displayStats.paymentTypeDistribution.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Recent Members</h3>
            <span className="text-xs text-gray-400">Last 10</span>
          </div>
          <DataTable
            columns={[
              {
                key: 'member',
                header: 'Member',
                render: (row) => (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1a6b3a] flex-shrink-0 overflow-hidden">
                      {row.profilePicture ? (
                        <img src={buildImageUrl(row.profilePicture)} alt={row.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{row.firstName[0]}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{row.firstName} {row.lastName}</p>
                      <p className="text-xs text-gray-400">{row.sport}</p>
                    </div>
                  </div>
                ),
              },
              { key: 'memberNumber', header: 'No.', render: (row) => <span className="text-xs">{row.memberNumber}</span> },
              { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
            ]}
            data={(displayStats.recentMembers?.slice(0, 8) || []) as any[]}
            keyExtractor={(row) => row.id}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 pt-5 pb-3">
            <h3 className="font-semibold text-gray-900">Recent Payments</h3>
          </div>
          <DataTable
            columns={[
              {
                key: 'member',
                header: 'Member',
                render: (row) => (
                  <p className="text-sm">{row.member?.firstName} {row.member?.lastName}</p>
                ),
              },
              { key: 'type', header: 'Type', render: (row) => <span className="text-xs">{row.paymentType?.name}</span> },
              { key: 'amount', header: 'Amount', render: (row) => <span className="text-sm font-medium">{formatCurrency(row.amount)}</span> },
              { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
            ]}
            data={(displayStats.recentPayments?.slice(0, 8) || []) as any[]}
            keyExtractor={(row) => row.id}
          />
        </div>
      </div>
    </div>
  )
}
