'use client'

import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Save, Eye, EyeOff, Camera, Crown, Medal } from 'lucide-react'
import { updateMember } from '@/lib/api_services/memberApiServices'
import { changePassword } from '@/lib/api_services/authApiServices'
import { getAllExecutives } from '@/lib/api_services/executiveApiServices'
import { getLeadershipMembers } from '@/lib/api_services/leadershipApiServices'
import { getAllAwards } from '@/lib/api_services/awardApiServices'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Button } from '@/components/shared/Button'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { updateMemberProfile } from '@/lib/store/authSlice'
import { NIGERIAN_STATES, SPORTS } from '@/lib/nigerianStates'
import { getLgaOptionsForState } from '@/lib/nigerianLgas'
import { buildImageUrl, getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function MemberProfilePage() {
  const { member } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()

  const [form, setForm] = useState({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    middleName: member?.middleName || '',
    phone: member?.phone || '',
    address: member?.address || '',
    city: member?.city || '',
    state: member?.state || '',
    stateOfOrigin: member?.stateOfOrigin || '',
    lga: member?.lga || '',
    sport: member?.sport || '',
    photoBase64: '' as string,
    photoPreview: member?.profilePicture ? buildImageUrl(member.profilePicture) : '',
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const updateMutation = useMutation({
    mutationFn: () => {
      const { photoPreview, ...data } = form
      return updateMember(member!.id, data as any)
    },
    onSuccess: (data) => {
      dispatch(updateMemberProfile(data as any))
      toast.success('Profile updated successfully!')
    },
    onError: (err: Error) => toast.error(err.message || 'Update failed'),
  })

  const changePwMutation = useMutation({
    mutationFn: () => changePassword({ currentPassword: passwords.current, newPassword: passwords.new }),
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to change password'),
  })

  const handlePhotoCapture = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setForm((p) => ({ ...p, photoBase64: base64, photoPreview: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const { data: executivesData } = useQuery({
    queryKey: ['member-positions-executive', member?.id],
    queryFn: getAllExecutives,
    enabled: !!member?.id,
  })

  const { data: leadershipData } = useQuery({
    queryKey: ['member-positions-leadership', member?.id],
    queryFn: () => getLeadershipMembers(),
    enabled: !!member?.id,
  })

  const { data: awardsData } = useQuery({
    queryKey: ['member-awards', member?.id],
    queryFn: () => getAllAwards({ memberId: member!.id, limit: 100 }),
    enabled: !!member?.id,
  })

  if (!member) return null

  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
  const sportOptions = SPORTS.map((s) => ({ value: s, label: s }))
  const lgaOptions = getLgaOptionsForState(form.stateOfOrigin)
  const memberPositions = [
    ...((executivesData || []) as any[])
      .filter((e: any) => e.memberId?.id === member.id || e.member?.id === member.id)
      .map((e: any) => ({
        id: `exec-${e.id}`,
        roleType: 'Executive',
        roleName: e.title || e.position || e.name,
        groupName: 'Executive Council',
        tenure: e.tenure || '',
      })),
    ...((leadershipData || []) as any[])
      .filter((l: any) => l.memberId?.id === member.id)
      .map((l: any) => ({
        id: `lead-${l.id}`,
        roleType: 'Leadership',
        roleName: l.position || l.title || 'Leadership Member',
        groupName: l.groupId?.name || 'Leadership',
        tenure: l.tenure || '',
      })),
  ]

  const memberAwards = ((awardsData || []) as any[]).filter(
    (a: any) => a.memberId?.id === member.id || a.member?.id === member.id
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Profile Information</h2>
        <div className="space-y-4">
          {/* Profile Photo */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Profile Picture</p>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1a6b3a]/10 border-2 border-gray-200 shrink-0">
                {form.photoPreview ? (
                  <img src={form.photoPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#1a6b3a] text-lg font-bold">
                      {getInitials(`${member.firstName} ${member.lastName}`)}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPhotoModalOpen(true)}
                iconLeft={<Camera className="w-4 h-4" />}
              >
                Change Photo
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="First Name" disabled={true} value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
            <Input label="Middle Name" disabled={true} value={form.middleName} onChange={(e) => set('middleName', e.target.value)} />
            <Input label="Last Name" disabled={true} value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
          </div>
          <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="Home Address" value={form.address} onChange={(e) => set('address', e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
            <Select label="State of Residence" value={form.state} onChange={(e) => set('state', e.target.value)} options={stateOptions} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="State of Origin"
              disabled={true}
              value={form.stateOfOrigin}
              onChange={(e) => {
                const nextState = e.target.value
                set('stateOfOrigin', nextState)
                const valid = getLgaOptionsForState(nextState).some((o) => o.value === form.lga)
                if (!valid) set('lga', '')
              }}
              options={stateOptions}
            />
            <Select
              label="LGA"
        
              value={form.lga}
              onChange={(e) => set('lga', e.target.value)}
              options={lgaOptions}
              placeholder={form.stateOfOrigin ? 'Select LGA' : 'Select state first'}
              disabled={!form.stateOfOrigin}
            />
          </div>
          <Select label="Sport" disabled={true} value={form.sport} onChange={(e) => set('sport', e.target.value)} options={sportOptions} />
          <Button onClick={() => updateMutation.mutate()} loading={updateMutation.isPending} iconLeft={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Member Number', value: member.memberNumber },
            { label: 'Email', value: member.email },
            { label: 'Date of Birth', value: member.dateOfBirth },
            { label: 'Gender', value: member.gender },
            { label: 'Status', value: member.status },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs uppercase tracking-wide">{item.label}</p>
              <p className="text-gray-900 font-medium mt-1 capitalize">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#1a6b3a]" />
          Current Positions
        </h2>
        {memberPositions.length === 0 ? (
          <p className="text-sm text-gray-500">No leadership or executive post assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {memberPositions.map((pos) => (
              <div key={pos.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs bg-[#1a6b3a]/10 text-[#1a6b3a] px-2 py-0.5 rounded-full font-medium">
                    {pos.roleType}
                  </span>
                  <p className="text-sm font-semibold text-gray-900">{pos.roleName}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{pos.groupName}</p>
                {pos.tenure && <p className="text-xs text-gray-500 mt-0.5">Tenure: {pos.tenure}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Medal className="w-5 h-5 text-[#d4a017]" />
          Awards Received
        </h2>
        {memberAwards.length === 0 ? (
          <p className="text-sm text-gray-500">No awards recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {memberAwards.map((award: any) => (
              <div key={award.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-900">
                  {award.categoryId?.name || award.title || 'Award'}
                </p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                  <span>Year: {award.year}</span>
                  {award.status && <span>Status: {award.status}</span>}
                  {typeof award.totalVotes === 'number' && <span>Votes: {award.totalVotes}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Change Password</h2>
        <div className="space-y-4 max-w-sm">
          <div className="relative">
            <Input
              label="Current Password"
              type={showPass ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-gray-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Input label="New Password" type="password" value={passwords.new} onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))} />
          <Input label="Confirm New Password" type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} />
          <Button
            onClick={() => {
              if (!passwords.current || !passwords.new) return toast.error('Fill all fields')
              if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match')
              if (passwords.new.length < 6) return toast.error('New password must be at least 6 characters')
              changePwMutation.mutate()
            }}
            loading={changePwMutation.isPending}
            size="sm"
          >
            Change Password
          </Button>
        </div>
      </div>

      <PhotoCaptureModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        onCapture={handlePhotoCapture}
        title="Update Profile Photo"
      />
    </div>
  )
}
