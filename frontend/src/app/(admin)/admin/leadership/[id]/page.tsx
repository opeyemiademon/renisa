'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getLeadershipMember, updateLeadershipMember, getLeadershipGroups } from '@/lib/api_services/leadershipApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { PageLoader } from '@/components/shared/Spinner'
import { NIGERIAN_STATES } from '@/lib/nigerianStates'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function EditLeadershipMemberPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const id = params.id as string

  const [form, setForm] = useState<{
    groupId: string; position: string; state: string;
    order: string; isActive: boolean; isCurrent: boolean; tenure: string;
  } | null>(null)
  const [linkedMember, setLinkedMember] = useState<any>(null)

  const setField = (f: string, v: any) => setForm((p: any) => ({ ...p, [f]: v }))

  const { data: groups } = useQuery({
    queryKey: ['leadership-groups'],
    queryFn: () => getLeadershipGroups(),
  })

  const { data: memberData, isLoading } = useQuery({
    queryKey: ['leadership-member', id],
    queryFn: () => getLeadershipMember(id),
    enabled: !!id,
  })

  // Populate form when data loads (avoids deprecated onSuccess)
  useEffect(() => {
    if (!memberData) return
    const data = memberData as any
    const groupId = data.groupId?.id || data.group?.id || (typeof data.groupId === 'string' ? data.groupId : '') || ''
    setLinkedMember(data.memberId || data.member || null)
    setForm({
      groupId,
      position: data.position || data.title || '',
      state: data.state || '',
      order: String(data.order ?? 1),
      isActive: data.isActive !== false,
      isCurrent: data.isCurrent !== false,
      tenure: data.tenure || '',
    })
  }, [memberData])

  const mutation = useMutation({
    mutationFn: () => updateLeadershipMember(id, {
      groupId: form!.groupId || undefined,
      position: form!.position,
      state: form!.state || undefined,
      order: parseInt(form!.order),
      isActive: form!.isActive,
      isCurrent: form!.isCurrent,
      tenure: form!.tenure || undefined,
    }),
    onSuccess: () => {
      toast.success('Leadership member updated')
      queryClient.invalidateQueries({ queryKey: ['leadership-members'] })
      queryClient.invalidateQueries({ queryKey: ['leadership-member', id] })
      router.push('/admin/leadership')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isLoading || !form) return <PageLoader />

  const groupOptions = (groups || []).map((g: any) => ({ value: g.id, label: g.name }))
  const selectedGroup = groups?.find((g: any) => g.id === form.groupId)
  const isStateGroup = selectedGroup?.slug === 'state-executives'

  const stateOptions = [
    { value: '', label: 'Select state' },
    ...NIGERIAN_STATES.map((s) => ({ value: s, label: s })),
  ]

  const memberObj = linkedMember && typeof linkedMember === 'object' ? linkedMember : null

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/leadership">
          <button className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Edit Leadership Member</h2>
      </div>

      {/* Linked member — read-only */}
      {memberObj && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Linked Member</p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-primary shrink-0">
              {memberObj.profilePicture ? (
                <img src={buildImageUrl(memberObj.profilePicture)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{memberObj.firstName?.[0]}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{memberObj.firstName} {memberObj.lastName}</p>
              <p className="text-sm text-gray-500">{memberObj.memberNumber}</p>
              {memberObj.sport && <p className="text-xs text-gray-400 mt-0.5">{memberObj.sport}</p>}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Name and photo are managed via the member's profile.</p>
        </div>
      )}

      {/* Role & group fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Role Information</h3>

        <Select
          label="Leadership Group"
          value={form.groupId}
          onChange={(e) => setField('groupId', e.target.value)}
          options={groupOptions}
        />

        <Input
          label="Position / Role"
          value={form.position}
          onChange={(e) => setField('position', e.target.value)}
          placeholder="e.g. President"
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Display Order"
            type="number"
            value={form.order}
            onChange={(e) => setField('order', e.target.value)}
          />
          {isStateGroup && (
            <Select
              label="State"
              value={form.state}
              onChange={(e) => setField('state', e.target.value)}
              options={stateOptions}
            />
          )}
        </div>

        <Input
          label="Tenure (e.g. 2023–2025)"
          value={form.tenure}
          onChange={(e) => setField('tenure', e.target.value)}
        />

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            Active (visible on website)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={(e) => setField('isCurrent', e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            Current tenure
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/admin/leadership"><Button variant="outline">Cancel</Button></Link>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!form.position}
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
