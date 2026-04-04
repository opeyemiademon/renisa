'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus, Edit, Trash2, Trophy, Search, X, PlayCircle, StopCircle,
  RotateCcw, FileDown, ChevronDown, ChevronUp,
} from 'lucide-react'
import {
  getAllAwards, createAward, updateAward, deleteAward,
  getAwardCategories, startCategoryPoll, endCategoryPoll,
} from '@/lib/api_services/awardApiServices'
import { getAllMembers } from '@/lib/api_services/memberApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { buildImageUrl, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ── helpers ───────────────────────────────────────────────────────────────────

const loadImageAsBase64 = (url: string): Promise<string | null> =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        canvas.getContext('2d')!.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch { resolve(null) }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })

const imgFmt = (src: string | null) => (src?.startsWith('data:image/png') ? 'PNG' : 'JPEG') as 'PNG' | 'JPEG'


const statusBadge = (status: string) => {
  if (status === 'voting') return 'active'
  if (status === 'awarded') return 'primary'
  return 'inactive'
}

// ── types ─────────────────────────────────────────────────────────────────────

interface AwardForm {
  memberId: string
  categoryId: string
  year: string
  votingEndDate: string
}

interface PollForm {
  votingStartDate: string
  votingEndDate: string
}

interface FilterState {
  categoryId: string
  year: string
  memberName: string
  status: string
}

const emptyForm: AwardForm = {
  memberId: '', categoryId: '', year: String(new Date().getFullYear()), votingEndDate: '',
}

const emptyPoll: PollForm = { votingStartDate: '', votingEndDate: '' }
const emptyFilter: FilterState = { categoryId: '', year: '', memberName: '', status: '' }

// ─────────────────────────────────────────────────────────────────────────────

export default function AwardsPage() {
  const queryClient = useQueryClient()
  const [liveSearch, setLiveSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [filtersOpen, setFiltersOpen] = useState(true)

  // modal states
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // poll modals
  const [pollCategory, setPollCategory] = useState<any>(null)
  const [pollForm, setPollForm] = useState<PollForm>(emptyPoll)
  const [endPollCategory, setEndPollCategory] = useState<any>(null)

  // award form
  const [form, setForm] = useState<AwardForm>(emptyForm)
  const [memberSearch, setMemberSearch] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [debouncedMemberSearch, setDebouncedMemberSearch] = useState('')
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // filters
  const [filter, setFilter] = useState<FilterState>(emptyFilter)
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(emptyFilter)

  const setField = (f: keyof AwardForm, v: string) => setForm((p) => ({ ...p, [f]: v }))
  const setFilterField = (f: keyof FilterState, v: string) => setFilter((p) => ({ ...p, [f]: v }))

  const hasActiveFilters = Object.values(appliedFilter).some(Boolean)

  // ── queries ───────────────────────────────────────────────────────────────

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['awards', appliedFilter],
    queryFn: () => getAllAwards({
      year: appliedFilter.year ? parseInt(appliedFilter.year) : undefined,
      categoryId: appliedFilter.categoryId || undefined,
      status: appliedFilter.status || undefined,
      memberName: appliedFilter.memberName || undefined,
    }),
  })

  const { data: categories } = useQuery({
    queryKey: ['award-categories'],
    queryFn: () => getAwardCategories(),
  })

  const { data: memberResults } = useQuery({
    queryKey: ['member-search', debouncedMemberSearch],
    queryFn: () => getAllMembers({ search: debouncedMemberSearch }),
    enabled: debouncedMemberSearch.length >= 3,
  })

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setDebouncedMemberSearch(memberSearch)
      setShowMemberDropdown(memberSearch.length >= 3)
    }, 300)
  }, [memberSearch])

  // ── member selection ──────────────────────────────────────────────────────

  const selectMember = (member: any) => {
    setSelectedMember(member)
    setField('memberId', member.id)
    setMemberSearch(`${member.firstName} ${member.lastName}`)
    setShowMemberDropdown(false)
  }

  const clearMember = () => {
    setSelectedMember(null)
    setField('memberId', '')
    setMemberSearch('')
  }

  // ── mutations ─────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: () => createAward({
      memberId: form.memberId,
      categoryId: form.categoryId,
      year: parseInt(form.year),
      votingEndDate: form.votingEndDate || undefined,
    }),
    onSuccess: () => {
      toast.success('Award created')
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      closeModal()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateAward(editId!, {
      memberId: form.memberId || undefined,
      categoryId: form.categoryId || undefined,
      year: parseInt(form.year),
      votingEndDate: form.votingEndDate || undefined,
    }),
    onSuccess: () => {
      toast.success('Award updated')
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      closeModal()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAward(id),
    onSuccess: () => {
      toast.success('Award deleted')
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const startPollMutation = useMutation({
    mutationFn: () => startCategoryPoll(
      pollCategory.id,
      pollForm.votingStartDate || undefined,
      pollForm.votingEndDate || undefined,
    ),
    onSuccess: () => {
      toast.success(`Poll started for "${pollCategory.name}"`)
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      queryClient.invalidateQueries({ queryKey: ['award-categories'] })
      setPollCategory(null)
      setPollForm(emptyPoll)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const endPollMutation = useMutation({
    mutationFn: () => endCategoryPoll(endPollCategory.id),
    onSuccess: () => {
      toast.success(`Poll ended for "${endPollCategory.name}"`)
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      queryClient.invalidateQueries({ queryKey: ['award-categories'] })
      setEndPollCategory(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  // ── modal helpers ─────────────────────────────────────────────────────────

  const openEdit = (award: any) => {
    setEditId(award.id)
    const memberObj = award.memberId
    setSelectedMember(memberObj || null)
    setMemberSearch(memberObj ? `${memberObj.firstName} ${memberObj.lastName}` : '')
    setForm({
      memberId: memberObj?.id || '',
      categoryId: award.categoryId?.id || '',
      year: String(award.year),
      votingEndDate: award.votingEndDate ? award.votingEndDate.slice(0, 16) : '',
    })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setSelectedMember(null)
    setMemberSearch('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditId(null)
    setForm(emptyForm)
    setSelectedMember(null)
    setMemberSearch('')
  }

  const handleSubmit = () => editId ? updateMutation.mutate() : createMutation.mutate()
  const isPending = createMutation.isPending || updateMutation.isPending

  // ── filter ────────────────────────────────────────────────────────────────

  const handleSearch = () => { setAppliedFilter({ ...filter }); setVisibleCount(20) }
  const handleReset = () => { setFilter(emptyFilter); setAppliedFilter(emptyFilter); setVisibleCount(20) }

  // ── data ──────────────────────────────────────────────────────────────────

  const allAwards = (data || []) as any[]

  const liveFiltered = useMemo(() => {
    if (!liveSearch.trim()) return allAwards
    const q = liveSearch.toLowerCase()
    return allAwards.filter((a: any) =>
      a.categoryId?.name?.toLowerCase().includes(q) ||
      `${a.memberId?.firstName} ${a.memberId?.lastName}`.toLowerCase().includes(q) ||
      a.memberId?.memberNumber?.toLowerCase().includes(q)
    )
  }, [allAwards, liveSearch])

  const visibleRows = liveFiltered.slice(0, visibleCount)

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...(categories || []).map((c: any) => ({ value: c.id, label: c.name })),
  ]

  const categorySelectOptions = [
    { value: '', label: 'Select category' },
    ...(categories || []).map((c: any) => ({ value: c.id, label: c.name })),
  ]

  const currentYear = new Date().getFullYear()
  const yearOptions = [
    { value: '', label: 'All Years' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: String(currentYear - i), label: String(currentYear - i),
    })),
  ]

  const yearFormOptions = yearOptions.slice(1)

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'nominated', label: 'Nominated' },
    { value: 'voting', label: 'Voting' },
    { value: 'awarded', label: 'Awarded' },
  ]

  // ── Category poll cards ───────────────────────────────────────────────────

  const categoriesWithPoll = useMemo(() => {
    const seen = new Map<string, any>()
    for (const a of allAwards) {
      const cat = a.categoryId
      if (cat && !seen.has(cat.id)) seen.set(cat.id, cat)
    }
    return Array.from(seen.values())
  }, [allAwards])

  // ── PDF export ────────────────────────────────────────────────────────────

  const handleExportPDF = async () => {
    const logo = await loadImageAsBase64('/logo.png')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pw = doc.internal.pageSize.getWidth()

    if (logo) doc.addImage(logo, imgFmt(logo), 10, 8, 16, 16)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('RENISA – Awards Report', pw / 2, 14, { align: 'center' })
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(`Generated: ${new Date().toLocaleString('en-GB')}`, pw / 2, 20, { align: 'center' })

    const rows = liveFiltered.map((a: any, i: number) => [
      i + 1,
      `${a.memberId?.firstName || ''} ${a.memberId?.lastName || ''}`.trim(),
      a.categoryId?.name || '—',
      a.year,
      a.totalVotes ?? 0,
      a.status,
      a.categoryId?.pollActive ? 'Active' : 'Inactive',
      a.categoryId?.votingStartDate ? formatDate(a.categoryId.votingStartDate) : '—',
      a.categoryId?.votingEndDate ? formatDate(a.categoryId.votingEndDate) : '—',
    ])

    autoTable(doc, {
      startY: 26,
      head: [['#', 'Nominee', 'Category', 'Year', 'Votes', 'Status', 'Poll', 'Poll Start', 'Poll End']],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [26, 107, 58] },
    })

    doc.save(`awards-report-${Date.now()}.pdf`)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Awards</h2>
          {hasActiveFilters && (
            <p className="text-xs text-[#1a6b3a] mt-0.5">{allAwards.length} result(s) matching filters</p>
          )}
        </div>
      </div>

      {/* Category Poll Status Cards */}
      {categoriesWithPoll.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoriesWithPoll.map((cat: any) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{cat.name}</p>
                {cat.pollActive ? (
                  <p className="text-xs text-green-600 mt-0.5">
                    Poll active {cat.votingEndDate ? `· ends ${formatDate(cat.votingEndDate)}` : ''}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">Poll inactive</p>
                )}
              </div>
              {cat.pollActive ? (
                <button
                  onClick={() => setEndPollCategory(cat)}
                  className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg px-2.5 py-1.5 shrink-0"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  End Poll
                </button>
              ) : (
                <button
                  onClick={() => { setPollCategory(cat); setPollForm(emptyPoll) }}
                  className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:bg-green-50 rounded-lg px-2.5 py-1.5 shrink-0"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  Start Poll
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Filter Panel — same style as members page */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#1a6b3a]" />
            <span>Search &amp; Filter</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-[#1a6b3a] text-white text-xs">
                {Object.values(appliedFilter).filter(Boolean).length} active
              </span>
            )}
          </div>
          {filtersOpen
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {filtersOpen && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Member Name"
                placeholder="Search nominee name..."
                value={filter.memberName}
                onChange={(e) => setFilterField('memberName', e.target.value)}
              />
              <Select
                label="Category"
                value={filter.categoryId}
                onChange={(e) => setFilterField('categoryId', e.target.value)}
                options={categoryOptions}
              />
              <Select
                label="Year"
                value={filter.year}
                onChange={(e) => setFilterField('year', e.target.value)}
                options={yearOptions}
              />
              <Select
                label="Status"
                value={filter.status}
                onChange={(e) => setFilterField('status', e.target.value)}
                options={statusOptions}
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button onClick={handleSearch} loading={isFetching} iconLeft={<Search className="w-4 h-4" />}>
                Search
              </Button>
              <Button variant="outline" onClick={handleReset} iconLeft={<RotateCcw className="w-4 h-4" />}>
                Reset
              </Button>
              {hasActiveFilters && (
                <span className="text-sm text-gray-500 ml-1">{allAwards.length} award(s) found</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toolbar: live search left | export + add right */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Quick search name, category..."
            value={liveSearch}
            onChange={(e) => { setLiveSearch(e.target.value); setVisibleCount(20) }}
            className="w-full pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 bg-white"
          />
          {liveSearch && (
            <button onClick={() => setLiveSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {liveSearch && (
            <span className="text-xs text-gray-500">{liveFiltered.length} result(s)</span>
          )}
          <Button variant="outline" size="sm" iconLeft={<FileDown className="w-4 h-4" />} onClick={handleExportPDF}>
            PDF
          </Button>
          <Button size="sm" iconLeft={<Plus className="w-4 h-4" />} onClick={openCreate}>
            Add Award
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-3 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide w-10">SN</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Nominee</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Year</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Votes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Poll</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading || isFetching ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#1a6b3a] border-t-transparent animate-spin" />
                      Searching...
                    </div>
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    {liveSearch ? `No results for "${liveSearch}".` : hasActiveFilters ? 'No awards match your filters.' : 'No awards found.'}
                  </td>
                </tr>
              ) : (
                visibleRows.map((row: any, idx: number) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3">
                      <span className="text-xs text-gray-400 font-mono">{idx + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 flex-shrink-0 flex items-center justify-center">
                          {row.memberId?.profilePicture ? (
                            <img src={buildImageUrl(row.memberId.profilePicture)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {row.memberId?.firstName} {row.memberId?.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{row.memberId?.memberNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.categoryId?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{row.year}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.totalVotes ?? 0}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadge(row.status)}>{row.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {row.categoryId?.pollActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Inactive</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(row)}
                          className="p-1.5 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(row.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {visibleCount < liveFiltered.length && (
          <div className="px-4 py-4 border-t border-gray-100 text-center">
            <button
              onClick={() => setVisibleCount((v) => v + 20)}
              className="text-sm text-[#1a6b3a] hover:underline font-medium"
            >
              Load More ({liveFiltered.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editId ? 'Edit Award' : 'Add Award'} size="md">
        <div className="space-y-4">
          {/* Member — required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(name &amp; photo from member profile)</span>
            </label>
            {selectedMember ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-[#1a6b3a] bg-[#f0faf4]">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1a6b3a] shrink-0">
                  {selectedMember.profilePicture ? (
                    <img src={buildImageUrl(selectedMember.profilePicture)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{selectedMember.firstName?.[0]}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{selectedMember.firstName} {selectedMember.lastName}</p>
                  <p className="text-xs text-gray-500">{selectedMember.memberNumber}</p>
                </div>
                <button onClick={clearMember} className="text-gray-400 hover:text-red-500 shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-[#1a6b3a]/30">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search member by name or number..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="flex-1 text-sm outline-none"
                  />
                </div>
                {showMemberDropdown && memberResults && (memberResults as any[]).length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                    {(memberResults as any[]).slice(0, 8).map((m: any) => (
                      <button
                        key={m.id}
                        onClick={() => selectMember(m)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1a6b3a] shrink-0">
                          {m.profilePicture ? (
                            <img src={buildImageUrl(m.profilePicture)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{m.firstName?.[0]}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.firstName} {m.lastName}</p>
                          <p className="text-xs text-gray-400">{m.memberNumber}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category */}
          <Select
            label="Category *  (award title comes from category name)"
            value={form.categoryId}
            onChange={(e) => setField('categoryId', e.target.value)}
            options={categorySelectOptions}
          />

          <Select
            label="Year"
            value={form.year}
            onChange={(e) => setField('year', e.target.value)}
            options={yearFormOptions}
          />

          <Input
            label="Voting End Date (optional)"
            type="datetime-local"
            value={form.votingEndDate}
            onChange={(e) => setField('votingEndDate', e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={closeModal} className="flex-1">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={isPending}
              className="flex-1"
              disabled={!form.memberId || !form.categoryId}
            >
              {editId ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Start Poll Modal */}
      <Modal
        isOpen={!!pollCategory}
        onClose={() => setPollCategory(null)}
        title={`Start Poll — ${pollCategory?.name || ''}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">
            Members will be able to vote for nominees in this category once the poll is active.
          </p>
          <Input
            label="Voting Start Date (optional)"
            type="datetime-local"
            value={pollForm.votingStartDate}
            onChange={(e) => setPollForm((p) => ({ ...p, votingStartDate: e.target.value }))}
          />
          <Input
            label="Voting End Date (optional)"
            type="datetime-local"
            value={pollForm.votingEndDate}
            onChange={(e) => setPollForm((p) => ({ ...p, votingEndDate: e.target.value }))}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPollCategory(null)} className="flex-1">Cancel</Button>
            <Button
              onClick={() => startPollMutation.mutate()}
              loading={startPollMutation.isPending}
              className="flex-1"
              iconLeft={<PlayCircle className="w-4 h-4" />}
            >
              Start Poll
            </Button>
          </div>
        </div>
      </Modal>

      {/* End Poll Confirm */}
      <ConfirmModal
        isOpen={!!endPollCategory}
        onClose={() => setEndPollCategory(null)}
        onConfirm={() => endPollCategory && endPollMutation.mutate()}
        title="End Poll"
        message={`Are you sure you want to end the voting poll for "${endPollCategory?.name}"? Members will no longer be able to cast votes.`}
        confirmVariant="danger"
        loading={endPollMutation.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Award"
        message="Are you sure you want to delete this award? All votes will be lost."
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
