'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, ChevronRight, Vote } from 'lucide-react'
import Link from 'next/link'
import { getAllElections } from '@/lib/api_services/electionApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { SearchBar } from '@/components/shared/SearchBar'
import { Select } from '@/components/shared/Select'
import { formatDate } from '@/lib/utils'

export default function ElectionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['elections'],
    queryFn: () => getAllElections(),
  })

  const allElections = data || []

  const filteredElections = useMemo(() => {
    let rows = allElections
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((e: any) => e.title?.toLowerCase().includes(q))
    }
    if (statusFilter) {
      rows = rows.filter((e: any) => e.status === statusFilter)
    }
    return rows
  }, [allElections, search, statusFilter])

  const statusColor: Record<string, string> = {
    draft: 'bg-gray-100 border-gray-200',
    active: 'bg-green-50 border-green-200',
    completed: 'bg-blue-50 border-blue-200',
    cancelled: 'bg-red-50 border-red-200',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Elections</h2>
          <p className="text-gray-500 text-sm mt-0.5">{filteredElections.length} elections found</p>
        </div>
        <Link href="/admin/elections/create">
          <Button iconLeft={<Plus className="w-4 h-4" />}>Create Election</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search elections..." className="flex-1 max-w-sm" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: '', label: 'All Statuses' },
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3 ">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-48 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-32" />
            </div>
          ))}
        </div>
      ) : filteredElections.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Vote className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No elections found</p>
          <Link href="/admin/elections/create">
            <Button className="mt-4" size="sm" iconLeft={<Plus className="w-4 h-4" />}>Create First Election</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 ">
          {filteredElections.map((election: any) => (
            <Link key={election.id} href={`/admin/elections/${election.id}`}>
              <div className={`rounded-xl border my-5 p-5 cursor-pointer hover:shadow-md transition-shadow ${statusColor[election.status] || 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{election.title}</h3>
                      <Badge variant={election.status}>{election.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Year: <span className="font-medium text-gray-700">{election.year}</span></span>
                      {election.startDate && (
                        <span>Start: <span className="font-medium text-gray-700">{formatDate(election.startDate)}</span></span>
                      )}
                      {election.endDate && (
                        <span>End: <span className="font-medium text-gray-700">{formatDate(election.endDate)}</span></span>
                      )}
                      <span>Positions: <span className="font-medium text-gray-700">{election.positions?.length || 0}</span></span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
