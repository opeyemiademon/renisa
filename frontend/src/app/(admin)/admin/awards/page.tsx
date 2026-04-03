'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Vote, Trophy, Search, X } from 'lucide-react'
import { getAllAwards, createAward, updateAward, deleteAward, enableAwardVoting, getAwardCategories } from '@/lib/api_services/awardApiServices'
import { getAllMembers } from '@/lib/api_services/memberApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { SearchBar } from '@/components/shared/SearchBar'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

interface AwardForm {
  memberId: string
  categoryId: string
  year: string
  votingEndDate: string
}

const emptyForm: AwardForm = {
  memberId: '', categoryId: '', year: String(new Date().getFullYear()), votingEndDate: '',
}

export default function AwardsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [votingId, setVotingId] = useState<string | null>(null)
  const [form, setForm] = useState<AwardForm>(emptyForm)

  const [memberSearch, setMemberSearch] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [debouncedMemberSearch, setDebouncedMemberSearch] = useState('')
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setField = (f: keyof AwardForm, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const { data, isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: () => getAllAwards(),
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
      setShowModal(false)
      setForm(emptyForm)
      setSelectedMember(null)
      setMemberSearch('')
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
      setShowModal(false)
      setEditId(null)
      setForm(emptyForm)
      setSelectedMember(null)
      setMemberSearch('')
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

  const votingMutation = useMutation({
    mutationFn: (id: string) => enableAwardVoting(id, form.votingEndDate || undefined),
    onSuccess: () => {
      toast.success('Voting enabled')
      queryClient.invalidateQueries({ queryKey: ['awards'] })
      setVotingId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openEdit = (award: any) => {
    setEditId(award.id)
    const memberObj = award.member || award.memberId
    setSelectedMember(memberObj || null)
    if (memberObj) {
      setMemberSearch(`${memberObj.firstName} ${memberObj.lastName}`)
    } else {
      setMemberSearch('')
    }
    setForm({
      memberId: memberObj?.id || '',
      categoryId: (award.category?.id || award.categoryId) || '',
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

  const allAwards = (data || []) as any[]

  const filteredData = useMemo(() => {
    if (!search.trim()) return allAwards
    const q = search.toLowerCase()
    return allAwards.filter((a: any) =>
      a.title?.toLowerCase().includes(q) ||
      a.recipientName?.toLowerCase().includes(q)
    )
  }, [allAwards, search])

  const visibleRows = filteredData.slice(0, visibleCount)

  const categoryOptions = [
    { value: '', label: 'No Category' },
    ...(categories || []).map((c: any) => ({ value: c.id, label: c.name })),
  ]

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear - i), label: String(currentYear - i),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Awards</h2>
          <p className="text-gray-500 text-sm mt-0.5">{allAwards.length} awards</p>
        </div>
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Award</Button>
      </div>

      <SearchBar
        value={search}
        onChange={(v) => { setSearch(v); setVisibleCount(20) }}
        placeholder="Search awards..."
        className="max-w-sm"
      />

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Award</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Year</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Votes</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Voting</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">Loading...</td></tr>
              ) : visibleRows.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">No records found</td></tr>
              ) : (
                visibleRows.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#d4a017]/10 flex-shrink-0 flex items-center justify-center">
                          {row.memberId.profilePicture ? (
                            <img src={buildImageUrl(row.memberId.profilePicture)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Trophy className="w-5 h-5 text-[#d4a017]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{row.categoryId?.name}</p>
                          <p className="text-xs text-gray-400">{row.memberId?.firstName} {row.memberId?.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{row.categoryId?.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{String(row.year)}</td>
                    <td className="px-4 py-3 text-gray-500">{row.totalVotes || 0}</td> 
                    <td className="px-4 py-3">
                      <Badge variant={row.votingEnabled ? 'active' : 'inactive'}>
                        {row.votingEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        {!row.votingEnabled && (
                          <button
                            onClick={() => setVotingId(row.id)}
                            className="p-1.5 text-[#d4a017] hover:bg-[#d4a017]/10 rounded-lg"
                            title="Enable Voting"
                          >
                            <Vote className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => openEdit(row)} className="p-1.5 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
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

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={closeModal} title={editId ? 'Edit Award Title' : 'Add Award Title'} size="md">
        <div className="space-y-4">
          {/* Member — required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(recipient name &amp; photo come from member profile)</span>
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
                    placeholder="Search member by name or member number..."
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

          {/* Category — required; title derived from it */}
          <div>
            <Select
              label="Category *  (award title comes from category name)"
              value={form.categoryId}
              onChange={(e) => setField('categoryId', e.target.value)}
              options={categoryOptions}
            />
          </div>

          <Select label="Year" value={form.year} onChange={(e) => setField('year', e.target.value)} options={yearOptions} />

          <Input
            label="Voting End Date (optional)"
            type="datetime-local"
            value={form.votingEndDate}
            onChange={(e) => setField('votingEndDate', e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={closeModal} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} loading={isPending} className="flex-1" disabled={!form.memberId || !form.categoryId}>
              {editId ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enable Voting Modal */}
      <Modal isOpen={!!votingId} onClose={() => setVotingId(null)} title="Enable Award Voting" size="sm">
        <div className="space-y-4">
          <p className="text-gray-500 text-sm">Set an end date for voting, or leave blank for indefinite voting.</p>
          <Input
            label="Voting End Date (optional)"
            type="datetime-local"
            value={form.votingEndDate}
            onChange={(e) => setField('votingEndDate', e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setVotingId(null)} className="flex-1">Cancel</Button>
            <Button
              onClick={() => votingId && votingMutation.mutate(votingId)}
              loading={votingMutation.isPending}
              className="flex-1"
              iconLeft={<Vote className="w-4 h-4" />}
            >
              Enable Voting
            </Button>
          </div>
        </div>
      </Modal>

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
