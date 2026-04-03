'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import { getAllExecutives, createExecutive, updateExecutive, deleteExecutive } from '@/lib/api_services/executiveApiServices'
import { getAllMembers } from '@/lib/api_services/memberApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ExecutiveForm {
  memberId: string
  position: string
  order: string
  tenure: string
}

const emptyForm: ExecutiveForm = {
  memberId: '', position: '', order: '1', tenure: '',
}

export default function ExecutivesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<ExecutiveForm>(emptyForm)
  const [memberSearch, setMemberSearch] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const setField = (f: keyof ExecutiveForm, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const { data: executives, isLoading } = useQuery({
    queryKey: ['executives'],
    queryFn: () => getAllExecutives(),
  })

  const { data: memberResults } = useQuery({
    queryKey: ['member-search', debouncedSearch],
    queryFn: () => getAllMembers({ search: debouncedSearch }),
    enabled: debouncedSearch.length >= 3,
  })

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(memberSearch)
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
    mutationFn: () => createExecutive({
      memberId: form.memberId,
      name: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : '',
      position: form.position,
      profilePicture: selectedMember?.profilePicture || undefined,
      order: parseInt(form.order),
      tenure: form.tenure || undefined,
    }),
    onSuccess: () => {
      toast.success('Executive added')
      queryClient.invalidateQueries({ queryKey: ['executives'] })
      setShowModal(false)
      setForm(emptyForm)
      setSelectedMember(null)
      setMemberSearch('')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateExecutive(editId!, {
      memberId: form.memberId || undefined,
      name: selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : undefined,
      position: form.position,
      profilePicture: selectedMember?.profilePicture || undefined,
      order: parseInt(form.order),
      tenure: form.tenure || undefined,
    }),
    onSuccess: () => {
      toast.success('Executive updated')
      queryClient.invalidateQueries({ queryKey: ['executives'] })
      setShowModal(false)
      setEditId(null)
      setForm(emptyForm)
      setSelectedMember(null)
      setMemberSearch('')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExecutive(id),
    onSuccess: () => {
      toast.success('Executive removed')
      queryClient.invalidateQueries({ queryKey: ['executives'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openEdit = (exec: any) => {
    setEditId(exec.id)
    const memberObj = exec.member || exec.memberId
    setSelectedMember(memberObj || null)
    setMemberSearch(memberObj ? `${memberObj.firstName} ${memberObj.lastName}` : '')
    setForm({
      memberId: memberObj?.id || '',
      position: exec.position || exec.title || '',
      order: String(exec.order || exec.displayOrder || 1),
      tenure: exec.tenure || '',
    })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditId(null)
    setSelectedMember(null)
    setMemberSearch('')
    setForm({ ...emptyForm, order: String(((executives?.length || 0) + 1)) })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Executives</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage association executive members</p>
        </div>
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Executive</Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4" />
              <div className="h-5 bg-gray-100 rounded w-32 mx-auto mb-2" />
              <div className="h-4 bg-gray-100 rounded w-24 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(executives || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((exec: any) => (
            <div key={exec.id} className="bg-white rounded-xl border border-gray-200 p-5 text-center group">
              <div className="w-20 h-20 rounded-full mx-auto overflow-hidden bg-[#1a6b3a] mb-4">
                {(exec.profilePicture || exec.photo) ? (
                  <img src={buildImageUrl(exec.profilePicture || exec.photo)} alt={exec.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{exec.name?.[0]}</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900">{exec.name}</h3>
              <p className="text-[#1a6b3a] text-sm font-medium mt-0.5">{exec.position || exec.title}</p>
              {exec.tenure && <p className="text-gray-400 text-xs mt-1">{exec.tenure}</p>}
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(exec)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg"
                >
                  <Edit className="w-3.5 h-3.5" />Edit
                </button>
                <button
                  onClick={() => setDeleteId(exec.id)}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />Remove
                </button>
              </div>
            </div>
          ))}
          {(!executives || executives.length === 0) && (
            <div className="col-span-3 text-center py-16 text-gray-400">No executives yet</div>
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={closeModal} title={editId ? 'Edit Executive' : 'Add Executive'} size="md">
        <div className="space-y-4">
          {/* Member search — required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Member <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal ml-1">(name &amp; photo come from member profile)</span>
            </label>
            {selectedMember ? (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-primary bg-[#f0faf4]">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary shrink-0">
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
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 focus-within:ring-2 focus-within:ring-primary/30">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search member by name or member number..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="flex-1 text-sm outline-none"
                  />
                </div>
                {showMemberDropdown && memberResults && memberResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
                    {(memberResults as any[]).slice(0, 8).map((m: any) => (
                      <button
                        key={m.id}
                        onClick={() => selectMember(m)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-primary shrink-0">
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

          <Input label="Position / Title *" value={form.position} onChange={(e) => setField('position', e.target.value)} placeholder="e.g. President" />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Display Order" type="number" value={form.order} onChange={(e) => setField('order', e.target.value)} />
            <Input label="Tenure (e.g. 2023–2025)" value={form.tenure} onChange={(e) => setField('tenure', e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={closeModal} className="flex-1">Cancel</Button>
            <Button
              onClick={handleSubmit}
              loading={isPending}
              className="flex-1"
              disabled={!form.memberId || !form.position}
            >
              {editId ? 'Save' : 'Add'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Remove Executive"
        message="Are you sure you want to remove this executive from the list?"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
