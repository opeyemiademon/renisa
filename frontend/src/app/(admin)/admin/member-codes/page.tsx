'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Hash, Plus, Download, Trash2, RefreshCw } from 'lucide-react'
import { getAllMemberCodes, generateMemberCodes, deleteMemberCode } from '@/lib/api_services/memberCodeApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { formatDate, downloadCSV } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function MemberCodesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [showGenerate, setShowGenerate] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [generateForm, setGenerateForm] = useState({ count: '10', batchName: '', expiryDate: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['member-codes'],
    queryFn: () => getAllMemberCodes(),
  })

  const generateMutation = useMutation({
    mutationFn: () => generateMemberCodes({
      count: parseInt(generateForm.count),
      batchName: generateForm.batchName || undefined,
      expiresAt: generateForm.expiryDate || undefined,
    }),
    onSuccess: () => {
      toast.success('Codes generated successfully')
      queryClient.invalidateQueries({ queryKey: ['member-codes'] })
      setShowGenerate(false)
      setGenerateForm({ count: '10', batchName: '', expiryDate: '' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMemberCode(id),
    onSuccess: () => {
      toast.success('Code deleted')
      queryClient.invalidateQueries({ queryKey: ['member-codes'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const allCodes = data || []

  const filteredData = useMemo(() => {
    if (!search.trim()) return allCodes
    const q = search.toLowerCase()
    return allCodes.filter((c: any) =>
      c.code?.toLowerCase().includes(q) ||
      c.batchName?.toLowerCase().includes(q) ||
      (c.usedByMember && `${c.usedByMember.firstName} ${c.usedByMember.lastName}`.toLowerCase().includes(q))
    )
  }, [allCodes, search])

  const visibleRows = filteredData.slice(0, visibleCount)

  const handleExportCSV = () => {
    const rows = allCodes.map((c: any) => ({
      Code: c.code,
      Batch: c.batchName || '—',
      Status: c.isUsed ? 'Used' : 'Unused',
      'Used By': c.usedByMember ? `${c.usedByMember.firstName} ${c.usedByMember.lastName}` : '—',
      'Used At': c.usedAt ? formatDate(c.usedAt) : '—',
      'Expires At': c.expiresAt ? formatDate(c.expiresAt) : 'No Expiry',
      'Created At': formatDate(c.createdAt),
    }))
    downloadCSV(rows, 'member-codes.csv')
    toast.success('CSV exported')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Member Codes</h2>
          <p className="text-gray-500 text-sm mt-0.5">{allCodes.length} total codes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download className="w-4 h-4" />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button size="sm" iconLeft={<Plus className="w-4 h-4" />} onClick={() => setShowGenerate(!showGenerate)}>
            Generate Codes
          </Button>
        </div>
      </div>

      {/* Generate Form */}
      {showGenerate && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#1a6b3a]" />
            Generate New Codes
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Number of Codes"
              type="number"
              min="1"
              max="500"
              value={generateForm.count}
              onChange={(e) => setGenerateForm((p) => ({ ...p, count: e.target.value }))}
            />
            <Input
              label="Batch Name (optional)"
              placeholder="e.g. Batch 2025-Q1"
              value={generateForm.batchName}
              onChange={(e) => setGenerateForm((p) => ({ ...p, batchName: e.target.value }))}
            />
            <Input
              label="Expiry Date (optional)"
              type="date"
              value={generateForm.expiryDate}
              onChange={(e) => setGenerateForm((p) => ({ ...p, expiryDate: e.target.value }))}
            />
          </div>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowGenerate(false)}>Cancel</Button>
            <Button
              iconLeft={<RefreshCw className="w-4 h-4" />}
              onClick={() => generateMutation.mutate()}
              loading={generateMutation.isPending}
            >
              Generate {generateForm.count} Codes
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <Input
          placeholder="Search by code, batch, or member name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setVisibleCount(20) }}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">SN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Code</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Batch</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Used By</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Expires</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Created</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : visibleRows.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No member codes found</td></tr>
              ) : (
                visibleRows.map((row: any, index:number) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                   
                   <td className="px-4 py-3">{index+1}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-[#1a6b3a] tracking-wider">{row.code}</span>
                    </td>
                    <td className="px-4 py-3">{row.batchName || <span className="text-gray-400">—</span>}</td>
                    <td className="px-4 py-3">
                      <Badge variant={row.isUsed ? 'used' : 'unused'}>{row.isUsed ? 'Used' : 'Unused'}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {row.usedBy ? (
                        <span className="text-gray-700">{row.usedBy.firstName} {row.usedBy.lastName}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {row.expiresAt ? (
                        <span className={new Date(row.expiresAt) < new Date() ? 'text-red-500' : 'text-gray-600'}>
                          {formatDate(row.expiresAt)}
                        </span>
                      ) : (
                        <span className="text-gray-400">No Expiry</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      {!row.isUsed && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(row.id) }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
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

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Member Code"
        message="Are you sure you want to delete this unused code? This action cannot be undone."
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
