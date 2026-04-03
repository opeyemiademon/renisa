'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Save, Eye, EyeOff } from 'lucide-react'
import { updateMember } from '@/lib/api_services/memberApiServices'
import { changePassword } from '@/lib/api_services/authApiServices'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Button } from '@/components/shared/Button'
import { FileUpload } from '@/components/shared/FileUpload'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { updateMemberProfile } from '@/lib/store/authSlice'
import { NIGERIAN_STATES, SPORTS } from '@/lib/nigerianStates'
import { SAMPLE_MEMBER } from '@/lib/sampleData'
import toast from 'react-hot-toast'

export default function MemberProfilePage() {
  const { member: authMember } = useAppSelector((s) => s.auth)
  const member = authMember || SAMPLE_MEMBER as any
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
    profilePicture: member?.profilePicture || '',
  })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)

  const set = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const updateMutation = useMutation({
    mutationFn: () => updateMember(member!.id, form),
    onSuccess: (data) => {
      dispatch(updateMemberProfile(data))
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

  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
  const sportOptions = SPORTS.map((s) => ({ value: s, label: s }))

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Profile Information</h2>
        <div className="space-y-4">
          <FileUpload
            label="Profile Picture"
            value={form.profilePicture}
            onChange={(url) => set('profilePicture', url)}
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input label="First Name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
            <Input label="Middle Name" value={form.middleName} onChange={(e) => set('middleName', e.target.value)} />
            <Input label="Last Name" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
          </div>
          <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="Home Address" value={form.address} onChange={(e) => set('address', e.target.value)} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="City" value={form.city} onChange={(e) => set('city', e.target.value)} />
            <Select label="State of Residence" value={form.state} onChange={(e) => set('state', e.target.value)} options={stateOptions} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Select label="State of Origin" value={form.stateOfOrigin} onChange={(e) => set('stateOfOrigin', e.target.value)} options={stateOptions} />
            <Input label="LGA" value={form.lga} onChange={(e) => set('lga', e.target.value)} />
          </div>
          <Select label="Sport" value={form.sport} onChange={(e) => set('sport', e.target.value)} options={sportOptions} />
          <Button
            onClick={() => updateMutation.mutate()}
            loading={updateMutation.isPending}
            iconLeft={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Read-only info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Member Number', value: member?.memberNumber },
            { label: 'Email', value: member?.email },
            { label: 'Date of Birth', value: member?.dateOfBirth },
            { label: 'Gender', value: member?.gender },
            { label: 'Status', value: member?.status },
          ].map((item) => (
            <div key={item.label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-500 text-xs uppercase tracking-wide">{item.label}</p>
              <p className="text-gray-900 font-medium mt-1 capitalize">{item.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
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
          <Input
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
          />
          <Button
            onClick={() => {
              if (!passwords.current || !passwords.new) return toast.error('Fill all fields')
              if (passwords.new !== passwords.confirm) return toast.error('Passwords do not match')
              changePwMutation.mutate()
            }}
            loading={changePwMutation.isPending}
            size="sm"
          >
            Change Password
          </Button>
        </div>
      </div>
    </div>
  )
}
