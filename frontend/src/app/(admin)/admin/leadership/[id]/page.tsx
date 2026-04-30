'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Camera, User } from 'lucide-react'
import Link from 'next/link'
import { getLeadershipMember, updateLeadershipMember, getLeadershipGroups } from '@/lib/api_services/leadershipApiServices'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
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
  const [isNonMember, setIsNonMember] = useState(false)

  // Non-member fields
  const [nonMemberName, setNonMemberName] = useState('')
  const [nonMemberBio, setNonMemberBio] = useState('')
  const [nonMemberPhoto, setNonMemberPhoto] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

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

  useEffect(() => {
    if (!memberData) return
    const data = memberData as any
    const groupId = data.groupId?.id || data.group?.id || (typeof data.groupId === 'string' ? data.groupId : '') || ''
    const linked = data.memberId || data.member || null
    const hasLinkedMember = linked && typeof linked === 'object' && linked.id
    setLinkedMember(hasLinkedMember ? linked : null)
    setIsNonMember(!hasLinkedMember)
    setForm({
      groupId,
      position: data.position || data.title || '',
      state: data.state || '',
      order: String(data.order ?? 1),
      isActive: data.isActive !== false,
      isCurrent: data.isCurrent !== false,
      tenure: data.tenure || '',
    })
    if (!hasLinkedMember) {
      setNonMemberName(data.nonMemberName || '')
      setNonMemberBio(data.nonMemberBio || '')
      setNonMemberPhoto(data.nonMemberPhoto || '')
      if (data.nonMemberPhoto) setPhotoPreview(buildImageUrl(data.nonMemberPhoto))
    }
  }, [memberData])

  const handlePhotoCapture = async (file: File) => {
    setPhotoPreview(URL.createObjectURL(file))
    setUploadingPhoto(true)
    try {
      const res = await uploadFile(file, undefined, 'leadership')
      setNonMemberPhoto(res.url)
    } catch {
      toast.error('Photo upload failed')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const mutation = useMutation({
    mutationFn: () => updateLeadershipMember(id, {
      groupId: form!.groupId || undefined,
      position: form!.position,
      state: form!.state || undefined,
      order: parseInt(form!.order),
      isActive: form!.isActive,
      isCurrent: form!.isCurrent,
      tenure: form!.tenure || undefined,
      ...(isNonMember ? {
        nonMemberName,
        nonMemberPhoto: nonMemberPhoto || undefined,
        nonMemberBio: nonMemberBio || undefined,
      } : {}),
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
  const isDirectorate = selectedGroup?.slug === 'directorate'

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

      {/* Linked member — read-only (member entry) */}
      {!isNonMember && memberObj && (
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

      {/* Non-member details — editable */}
      {isDirectorate && isNonMember && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Non-member Details</h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Non-member</span>
          </div>

          {/* Photo */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Photo</p>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPhotoModal(true)}
                loading={uploadingPhoto}
                iconLeft={<Camera className="w-4 h-4" />}
              >
                {photoPreview ? 'Change Photo' : 'Capture or Upload Photo'}
              </Button>
            </div>
          </div>

          <Input
            label="Full Name *"
            placeholder="e.g. Dr. John Doe"
            value={nonMemberName}
            onChange={(e) => setNonMemberName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={4}
              placeholder="Brief biography or description..."
              value={nonMemberBio}
              onChange={(e) => setNonMemberBio(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
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
          placeholder="e.g. Director"
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
          disabled={!form.position || uploadingPhoto || (isNonMember && !nonMemberName)}
        >
          Save Changes
        </Button>
      </div>

      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onCapture={handlePhotoCapture}
        title="Capture Directorate Photo"
      />
    </div>
  )
}
