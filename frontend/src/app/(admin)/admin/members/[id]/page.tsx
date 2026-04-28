'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit, UserCheck, GraduationCap, Camera, Plus, Trash2, Twitter, Linkedin, Facebook, Instagram, Globe } from 'lucide-react'
import Link from 'next/link'
import { getMember, updateMember, updateMemberStatus, markMemberAsAlumni } from '@/lib/api_services/memberApiServices'
import { getMemberPayments } from '@/lib/api_services/paymentApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { DataTable } from '@/components/shared/DataTable'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { PageLoader } from '@/components/shared/Spinner'
import { buildImageUrl, formatDate, formatCurrency } from '@/lib/utils'
import { NIGERIAN_STATES, useSports } from '@/lib/nigerianStates'
import { getLgaOptionsForState } from '@/lib/nigerianLgas'
import { fileToBase64 } from '@/lib/fileUpload'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const SOCIAL_PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X', icon: Twitter },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'website', label: 'Website', icon: Globe },
]

export default function MemberDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const queryClient = useQueryClient()

  const [editing, setEditing] = useState(false)
  const [confirmAction, setConfirmAction] = useState<string | null>(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)

  const [editForm, setEditForm] = useState<Record<string, any>>({})
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([])

  const setField = (f: string, v: any) => setEditForm((p) => ({ ...p, [f]: v }))

  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => getMember(id),
  })

  const { data: payments } = useQuery({
    queryKey: ['member-payments', id],
    queryFn: () => getMemberPayments(id),
    enabled: !!member,
  })

  // Auto-activate edit mode when ?edit=1 is in URL
  useEffect(() => {
    if (searchParams.get('edit') === '1' && member && !editing) {
      startEdit()
    }
  }, [member, searchParams])

  const startEdit = () => {
    if (!member) return
    const m = member as any
    setEditForm({
      firstName: m.firstName || '',
      lastName: m.lastName || '',
      middleName: m.middleName || '',
      phone: m.phone || '',
      alternatePhone: m.alternatePhone || '',
      dateOfBirth: (() => { if (!m.dateOfBirth) return ''; const d = new Date(m.dateOfBirth); return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0] })(),
      gender: m.gender || '',
      address: m.address || '',
      city: m.city || '',
      state: m.state || '',
      stateOfOrigin: m.stateOfOrigin || '',
      lga: m.lga || '',
      sport: m.sport || '',
      profilePicture: m.profilePicture || '',
      photoBase64: '',
      bio: m.bio || '',
    })
    // Convert socialLinks object to array
    const existing = m.socialLinks || {}
    const links = SOCIAL_PLATFORMS
      .filter((p) => existing[p.value])
      .map((p) => ({ platform: p.value, url: existing[p.value] }))
    setSocialLinks(links)
    setEditing(true)
  }

  const handlePhotoCapture = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setEditForm((p) => ({
        ...p,
        photoBase64: base64,
        profilePicture: URL.createObjectURL(file),
      }))
      toast.success('Photo captured')
    } catch {
      toast.error('Failed to process photo')
    }
  }

  const addSocialLink = () => {
    const used = socialLinks.map((l) => l.platform)
    const next = SOCIAL_PLATFORMS.find((p) => !used.includes(p.value))
    if (next) setSocialLinks((prev) => [...prev, { platform: next.value, url: '' }])
  }

  const removeSocialLink = (i: number) => setSocialLinks((prev) => prev.filter((_, idx) => idx !== i))
  const updateSocialLink = (i: number, key: 'platform' | 'url', val: string) =>
    setSocialLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, [key]: val } : l))

  const updateMutation = useMutation({
    mutationFn: () => {
      const socialLinksObj: Record<string, string> = {}
      socialLinks.forEach(({ platform, url }) => { if (url) socialLinksObj[platform] = url })
      return updateMember(id, {
        ...editForm,
        socialLinks: Object.keys(socialLinksObj).length ? socialLinksObj : undefined,
      } as any)
    },
    onSuccess: () => {
      toast.success('Member updated')
      queryClient.invalidateQueries({ queryKey: ['member', id] })
      setEditing(false)
      // Remove ?edit=1 from URL
      router.replace(`/admin/members/${id}`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateMemberStatus(id, status),
    onSuccess: () => { toast.success('Status updated'); queryClient.invalidateQueries({ queryKey: ['member', id] }); setConfirmAction(null) },
    onError: (err: Error) => toast.error(err.message),
  })

  const alumniMutation = useMutation({
    mutationFn: () => markMemberAsAlumni(id),
    onSuccess: () => { toast.success('Marked as alumni'); queryClient.invalidateQueries({ queryKey: ['member', id] }); setConfirmAction(null) },
    onError: (err: Error) => toast.error(err.message),
  })

  const sports = useSports()

  if (isLoading) return <PageLoader />
  if (!member) return <div className="text-gray-400 text-center py-10">Member not found</div>

  const m = member as any
  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
  const sportOptions = sports.map((s) => ({ value: s, label: s }))
  const lgaOptions = getLgaOptionsForState(editForm.stateOfOrigin || '')
  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (p) => !socialLinks.some((l) => l.platform === p.value)
  )

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/members">
            <button className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
          </Link>
          <h2 className="text-xl font-semibold text-gray-900">
            {editing ? 'Edit Member' : 'Member Details'}
          </h2>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <Button variant="outline" size="sm" iconLeft={<Edit className="w-4 h-4" />} onClick={startEdit}>
              Edit
            </Button>
          )}
          <Button
            variant="outline" size="sm"
            iconLeft={<UserCheck className="w-4 h-4" />}
            onClick={() => setConfirmAction(m.status === 'active' ? 'suspend' : 'activate')}
          >
            {m.status === 'active' ? 'Suspend' : 'Activate'}
          </Button>
         {/*  {!m.isAlumni && (
            <Button variant="secondary" size="sm" iconLeft={<GraduationCap className="w-4 h-4" />}
              onClick={() => setConfirmAction('alumni')}>
              Mark Alumni
            </Button>
          )} */}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {editing ? (
          <div className="space-y-5">
            {/* Photo section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#1a6b3a] flex-shrink-0">
                  {editForm.profilePicture ? (
                    <img src={editForm.profilePicture.startsWith('blob:') || editForm.profilePicture.startsWith('data:')
                      ? editForm.profilePicture
                      : buildImageUrl(editForm.profilePicture)}
                      alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{m.firstName?.[0]}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline" size="sm"
                    iconLeft={<Camera className="w-4 h-4" />}
                    onClick={() => setShowPhotoModal(true)}
                  >
                    {editForm.profilePicture ? 'Change Photo' : 'Capture Photo'}
                  </Button>
                  {editForm.profilePicture && (
                    <button
                      onClick={() => setEditForm((p) => ({ ...p, profilePicture: '', photoBase64: '' }))}
                      className="block text-xs text-red-500 hover:underline"
                    >
                      Remove photo
                    </button>
                  )}
                  <p className="text-xs text-gray-400">Use camera or upload from device</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="First Name" value={editForm.firstName} onChange={(e) => setField('firstName', e.target.value)} />
              <Input label="Middle Name" value={editForm.middleName} onChange={(e) => setField('middleName', e.target.value)} />
              <Input label="Last Name" value={editForm.lastName} onChange={(e) => setField('lastName', e.target.value)} />
            </div>

            {/* Contact */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone" value={editForm.phone} onChange={(e) => setField('phone', e.target.value)} />
              <Input label="Alternate Phone" value={editForm.alternatePhone} onChange={(e) => setField('alternatePhone', e.target.value)} />
            </div>

            {/* Personal */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Gender" value={editForm.gender} onChange={(e) => setField('gender', e.target.value)}
                placeholder="Select gender"
                options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]} />
              <Input label="Date of Birth" type="date" value={editForm.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} />
            </div>

            <Select label="Sport" value={editForm.sport} onChange={(e) => setField('sport', e.target.value)} options={sportOptions} />
            <Input label="Address" value={editForm.address} onChange={(e) => setField('address', e.target.value)} />

            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="City" value={editForm.city} onChange={(e) => setField('city', e.target.value)} />
              <Select label="State of Residence" value={editForm.state} onChange={(e) => setField('state', e.target.value)} options={stateOptions} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="State of Origin"
                value={editForm.stateOfOrigin}
                onChange={(e) => {
                  const nextState = e.target.value
                  setField('stateOfOrigin', nextState)
                  const valid = getLgaOptionsForState(nextState).some((o) => o.value === editForm.lga)
                  if (!valid) setField('lga', '')
                }}
                options={stateOptions}
              />
              <Select
                label="LGA"
                value={editForm.lga}
                onChange={(e) => setField('lga', e.target.value)}
                options={lgaOptions}
                placeholder={editForm.stateOfOrigin ? 'Select LGA' : 'Select state first'}
                disabled={!editForm.stateOfOrigin}
              />
            </div>

            {/* Biography */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biography (optional)</label>
              <textarea
                rows={4}
                value={editForm.bio}
                onChange={(e) => setField('bio', e.target.value)}
                placeholder="Brief biography or background..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 resize-none"
              />
            </div>

            {/* Social Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Social Links</label>
                {availablePlatforms.length > 0 && (
                  <button onClick={addSocialLink} className="text-xs text-[#1a6b3a] hover:underline flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
              </div>
              {socialLinks.length === 0 && (
                <p className="text-xs text-gray-400">No social links added.</p>
              )}
              <div className="space-y-2">
                {socialLinks.map((link, i) => {
                  const PlatformIcon = SOCIAL_PLATFORMS.find((p) => p.value === link.platform)?.icon
                  return (
                    <div key={i} className="flex gap-2 items-center">
                      <Select
                        value={link.platform}
                        onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                        options={[
                          { value: link.platform, label: SOCIAL_PLATFORMS.find((p) => p.value === link.platform)?.label || link.platform },
                          ...availablePlatforms.map((p) => ({ value: p.value, label: p.label })),
                        ]}
                      />
                      <div className="flex-1 relative">
                        {PlatformIcon && (
                          <PlatformIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        )}
                        <input
                          type="url"
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30"
                        />
                      </div>
                      <button onClick={() => removeSocialLink(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button variant="outline" onClick={() => { setEditing(false); router.replace(`/admin/members/${id}`) }}>Cancel</Button>
              <Button onClick={() => updateMutation.mutate()} loading={updateMutation.isPending}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* View mode: photo + basic info */}
            <div className="flex items-start gap-5">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#1a6b3a] flex-shrink-0">
                {m.profilePicture ? (
                  <img src={buildImageUrl(m.profilePicture)} alt={m.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{m.firstName?.[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {m.firstName} {m.middleName || ''} {m.lastName}
                  </h3>
                  <Badge variant={m.status}>{m.status}</Badge>
                  {m.isAlumni && <Badge variant="alumni">Alumni</Badge>}
                </div>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  {[
                    { label: 'Member No.', value: m.memberNumber },
                    { label: 'Email', value: m.email },
                    { label: 'Phone', value: m.phone },
                    { label: 'Alt. Phone', value: m.alternatePhone },
                    { label: 'Sport', value: m.sport },
                    { label: 'State', value: m.state },
                    { label: 'State of Origin', value: m.stateOfOrigin },
                    { label: 'LGA', value: m.lga },
                    { label: 'City', value: m.city },
                    { label: 'Gender', value: m.gender },
                    { label: 'Date of Birth', value: m.dateOfBirth ? formatDate(m.dateOfBirth) : undefined },
                    { label: 'Joined', value: formatDate(m.createdAt) },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-gray-400 text-xs uppercase tracking-wide">{item.label}</p>
                      <p className="text-gray-900 font-medium mt-0.5 capitalize">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Address */}
            {m.address && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Address</p>
                <p className="text-gray-900 text-sm mt-0.5">{m.address}</p>
              </div>
            )}

            {/* Bio */}
            {m.bio && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Biography</p>
                <p className="text-gray-700 text-sm leading-relaxed">{m.bio}</p>
              </div>
            )}

            {/* Social Links */}
            {m.socialLinks && Object.values(m.socialLinks).some((v) => v) && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Social Links</p>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_PLATFORMS.filter((p) => m.socialLinks?.[p.value]).map((p) => {
                    const Icon = p.icon
                    return (
                      <a key={p.value} href={'https://'+m.socialLinks[p.value]} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 transition-colors">
                        <Icon className="w-3.5 h-3.5" />{p.label}
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-semibold text-gray-900">Payment History</h3>
        </div>
        <DataTable
          columns={[
            { key: 'date', header: 'Date', render: (row) => formatDate(row.createdAt) },
            { key: 'type', header: 'Type', render: (row) => row.paymentType?.name || '—' },
            { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount) },
            { key: 'year', header: 'Year', render: (row) => String(row.year) },
            { key: 'status', header: 'Status', render: (row) => <Badge variant={row.status}>{row.status}</Badge> },
          ]}
          data={payments || []}
          keyExtractor={(row) => row.id}
          emptyMessage="No payment history"
        />
      </div>

      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onCapture={handlePhotoCapture}
        title="Update Profile Photo"
      />

      <ConfirmModal
        isOpen={confirmAction === 'suspend' || confirmAction === 'activate'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => statusMutation.mutate(confirmAction === 'suspend' ? 'suspended' : 'active')}
        title={`${confirmAction === 'suspend' ? 'Suspend' : 'Activate'} Member`}
        message={`Are you sure you want to ${confirmAction} this member?`}
        confirmVariant={confirmAction === 'suspend' ? 'danger' : 'primary'}
        loading={statusMutation.isPending}
      />

      <ConfirmModal
        isOpen={confirmAction === 'alumni'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => alumniMutation.mutate()}
        title="Mark as Alumni"
        message="Are you sure you want to mark this member as alumni?"
        loading={alumniMutation.isPending}
      />
    </div>
  )
}
