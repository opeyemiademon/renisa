'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GraduationCap, Download } from 'lucide-react'
import { getAlumni } from '@/lib/api_services/memberApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { SearchBar } from '@/components/shared/SearchBar'
import { Select } from '@/components/shared/Select'
import { buildImageUrl, formatDate, downloadCSV } from '@/lib/utils'
import { NIGERIAN_STATES, useSports } from '@/lib/nigerianStates'
import toast from 'react-hot-toast'

export default function AlumniPage() {
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [sportFilter, setSportFilter] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)

  const { data, isLoading } = useQuery({
    queryKey: ['alumni-admin'],
    queryFn: () => getAlumni(),
  })

  const rawAlumni = (data || []) as any[]
  const sports = useSports()

  const filteredData = useMemo(() => {
    let rows = rawAlumni as any[]
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((m: any) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.memberNumber?.toLowerCase().includes(q)
      )
    }
    if (stateFilter) rows = rows.filter((m: any) => m.state === stateFilter)
    if (sportFilter) rows = rows.filter((m: any) => m.sport === sportFilter)
    return rows
  }, [rawAlumni, search, stateFilter, sportFilter])

  const visibleRows = filteredData.slice(0, visibleCount)

  const stateOptions = [
    { value: '', label: 'All States' },
    ...NIGERIAN_STATES.map((s) => ({ value: s, label: s })),
  ]

  const sportOptions = [
    { value: '', label: 'All Sports' },
    ...sports.map((s) => ({ value: s, label: s })),
  ]

  const handleExport = () => {
    const rows = (rawAlumni as any[]).map((m: any) => ({
      'Member No.': m.memberNumber,
      'First Name': m.firstName,
      'Last Name': m.lastName,
      Email: m.email,
      Phone: m.phone,
      Sport: m.sport,
      State: m.state,
      'Joined': formatDate(m.createdAt),
    }))
    downloadCSV(rows, 'alumni.csv')
    toast.success('CSV exported')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-[#1a6b3a]" />
            Alumni
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">{(rawAlumni as any[]).length} alumni members</p>
        </div>
        <Button variant="outline" size="sm" iconLeft={<Download className="w-4 h-4" />} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid sm:grid-cols-3 gap-3">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setVisibleCount(20) }}
            placeholder="Search alumni..."
          />
          <Select
            value={stateFilter}
            onChange={(e) => { setStateFilter(e.target.value); setVisibleCount(20) }}
            options={stateOptions}
          />
          <Select
            value={sportFilter}
            onChange={(e) => { setSportFilter(e.target.value); setVisibleCount(20) }}
            options={sportOptions}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Member</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Sport</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">State</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : visibleRows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No records found</td></tr>
              ) : (
                visibleRows.map((row: any) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/members/${row.id}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1a6b3a] flex-shrink-0">
                          {row.profilePicture ? (
                            <img src={buildImageUrl(row.profilePicture)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{row.firstName?.[0]}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{row.firstName} {row.lastName}</p>
                          <p className="text-xs text-gray-400">{row.memberNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{row.email}</td>
                    <td className="px-4 py-3 text-gray-500">{row.sport || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{row.state || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Badge variant={row.status}>{row.status}</Badge>
                        <Badge variant="alumni">Alumni</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(row.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < filteredData.length && (
          <div className="px-4 py-4 border-t border-gray-100 text-center">
            <button
              onClick={() => setVisibleCount((v) => v + 20)}
              className="text-sm text-[#1a6b3a] hover:underline font-medium"
            >
              Load More ({filteredData.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
