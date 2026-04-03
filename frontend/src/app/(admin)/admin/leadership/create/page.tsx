'use client'

import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Search, X } from 'lucide-react'
import Link from 'next/link'
import { createLeadershipMember, getLeadershipGroups } from '@/lib/api_services/leadershipApiServices'
import { getAllMembers } from '@/lib/api_services/memberApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { NIGERIAN_STATES } from '@/lib/nigerianStates'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Suspense } from "react";

const CreateLeadershipMemberPage =()=> {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const preselectedGroupId = searchParams.get('groupId') || ''

  const [memberId, setMemberId] = useState('')
  const [memberSearch, setMemberSearch] = useState('')
  const [showMemberDropdown, setShowMemberDropdown] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [form, setForm] = useState({
    groupId: preselectedGroupId,
    position: '',
    state: '',
    order: '1',
    isActive: true,
    isCurrent: true,
    tenure: '',
  })

  const setField = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const { data: groups } = useQuery({
    queryKey: ['leadership-groups'],
    queryFn: () => getLeadershipGroups(),
  })

  const { data: memberResults } = useQuery({
    queryKey: ['member-search', debouncedSearch],
    queryFn: () => getAllMembers({ search: debouncedSearch }),
    enabled: debouncedSearch.length >= 3,
  })

  // Fall back to first group only if no group was pre-selected via URL
  useEffect(() => {
    if (groups && groups.length > 0 && !form.groupId) {
      setField('groupId', (groups[0] as any).id)
    }
  }, [groups])

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(memberSearch)
      setShowMemberDropdown(memberSearch.length >= 3)
    }, 300)
  }, [memberSearch])

  const selectMember = (member: any) => {
    setSelectedMember(member)
    setMemberId(member.id)
    setMemberSearch(`${member.firstName} ${member.lastName}`)
    setShowMemberDropdown(false)
  }

  const clearMember = () => {
    setSelectedMember(null)
    setMemberId('')
    setMemberSearch('')
  }

  const mutation = useMutation({
    mutationFn: () => createLeadershipMember({
      groupId: form.groupId || undefined,
      memberId,
      position: form.position,
      state: form.state || undefined,
      order: parseInt(form.order),
      isActive: form.isActive,
      isCurrent: form.isCurrent,
      tenure: form.tenure || undefined,
    }),
    onSuccess: () => {
      toast.success('Leadership member created')
      queryClient.invalidateQueries({ queryKey: ['leadership-members'] })
      router.push('/admin/leadership')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const groupOptions = (groups || []).map((g: any) => ({ value: g.id, label: g.name }))
  const selectedGroup = groups?.find((g: any) => g.id === form.groupId)
  const isStateGroup = selectedGroup?.slug === 'state-executives'

  const stateOptions = [
    { value: '', label: 'Select state (for state executives)' },
    ...NIGERIAN_STATES.map((s) => ({ value: s, label: s })),
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/leadership">
          <button className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Add Leadership Member</h2>
      </div>

      {/* Member selection — required */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900">Select Member <span className="text-red-500">*</span></h3>
          <p className="text-sm text-gray-500 mt-0.5">Name and photo will be pulled from the member's profile.</p>
        </div>

        {selectedMember ? (
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-primary bg-[#f0faf4]">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-primary shrink-0">
              {selectedMember.profilePicture ? (
                <img src={buildImageUrl(selectedMember.profilePicture)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-bold">{selectedMember.firstName?.[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{selectedMember.firstName} {selectedMember.lastName}</p>
              <p className="text-xs text-gray-500">{selectedMember.memberNumber} · {selectedMember.sport}</p>
            </div>
            <button onClick={clearMember} className="text-gray-400 hover:text-red-500 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-primary/30">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Type 3+ characters to search member..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="flex-1 text-sm outline-none"
              />
            </div>
            {showMemberDropdown && memberResults && memberResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-52 overflow-y-auto">
                {(memberResults as any[]).slice(0, 8).map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => selectMember(m)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-left"
                  >
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-primary shrink-0">
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
                      <p className="text-xs text-gray-400">{m.memberNumber} · {m.state}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Role & group info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Role Information</h3>
        <Select
          label="Leadership Group"
          value={form.groupId}
          onChange={(e) => setField('groupId', e.target.value)}
          options={groupOptions}
        />
        <Input
          label="Position / Role *"
          placeholder="e.g. President"
          value={form.position}
          onChange={(e) => setField('position', e.target.value)}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Display Order" type="number" value={form.order} onChange={(e) => setField('order', e.target.value)} />
          {isStateGroup && (
            <Select label="State" value={form.state} onChange={(e) => setField('state', e.target.value)} options={stateOptions} />
          )}
        </div>
        <Input label="Tenure (e.g. 2023–2025)" value={form.tenure} onChange={(e) => setField('tenure', e.target.value)} />
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setField('isActive', e.target.checked)} className="w-4 h-4 accent-primary" />
            Active (visible on website)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isCurrent} onChange={(e) => setField('isCurrent', e.target.checked)} className="w-4 h-4 accent-primary" />
            Current tenure
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/admin/leadership"><Button variant="outline">Cancel</Button></Link>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!memberId || !form.position || !form.groupId}
        >
          Create Member
        </Button>
      </div>
    </div>
  )
}
function SearchFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-pulse text-muted-foreground">Loading ...</div>
    </div>
  );
}
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <CreateLeadershipMemberPage />
    </Suspense>
  );
}
