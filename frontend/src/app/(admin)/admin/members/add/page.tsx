'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Save, ArrowLeft, Camera } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { adminRegisterMember } from '@/lib/api_services/memberApiServices'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Button } from '@/components/shared/Button'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { NIGERIAN_STATES, useSports } from '@/lib/nigerianStates'
import { getLgaOptionsForState } from '@/lib/nigerianLgas'
import { fileToBase64 } from '@/lib/fileUpload'
import toast from 'react-hot-toast'

export default function AdminAddMemberPage() {
  const router = useRouter()
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [form, setForm] = useState({
    memberCode: '', firstName: '', lastName: '', middleName: '',
    gender: '', dateOfBirth: '', phone: '', email: '',
    address: '', city: '', state: '', stateOfOrigin: '', lga: '', sport: '',
    profilePicture: '', photoBase64: '', password: '',
  })

  const set = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))
  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
  const sportOptions = useSports().map((s) => ({ value: s, label: s }))
  const lgaOptions = getLgaOptionsForState(form.stateOfOrigin)

  const handlePhotoCapture = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setForm((prev) => ({ ...prev, photoBase64: base64, profilePicture: URL.createObjectURL(file) }))
      toast.success('Photo captured successfully!')
    } catch (error) {
      toast.error('Failed to process photo')
    }
  }

  const mutation = useMutation({
    mutationFn: () => adminRegisterMember(form),
    onSuccess: () => {
      toast.success('Member registered successfully!')
      router.push('/admin/members')
    },
    onError: (err: Error) => toast.error(err.message || 'Registration failed'),
  })

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/members"><button className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button></Link>
        <h2 className="text-xl font-semibold text-gray-900">Add New Member</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-700 border-b pb-2">Personal Information</h3>
        <Input label="Member Code" value={form.memberCode} onChange={(e) => set('memberCode', e.target.value)} required />
        <div className="grid sm:grid-cols-3 gap-4">
          <Input label="First Name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
          <Input label="Middle Name" value={form.middleName} onChange={(e) => set('middleName', e.target.value)} />
          <Input label="Last Name" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select label="Gender" value={form.gender} onChange={(e) => set('gender', e.target.value)}
            options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} placeholder="Select gender" required />
          <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          {form.profilePicture ? (
            <div className="relative w-32 h-32 mx-auto mb-3">
              <Image
                src={form.profilePicture}
                alt="Profile preview"
                fill
                className="rounded-lg object-cover border-2 border-gray-200"
              />
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPhotoModal(true)}
            className="w-full"
            iconLeft={<Camera className="w-4 h-4" />}
          >
            {form.profilePicture ? 'Change Photo' : 'Capture or Upload Photo'}
          </Button>
        </div>

        <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Contact Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        </div>
        <Input label="Address" value={form.address} onChange={(e) => set('address', e.target.value)} required />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="City" value={form.city} onChange={(e) => set('city', e.target.value)} required />
          <Select label="State of Residence" value={form.state} onChange={(e) => set('state', e.target.value)} options={stateOptions} placeholder="Select state" required />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="State of Origin"
            value={form.stateOfOrigin}
            onChange={(e) => {
              const nextState = e.target.value
              set('stateOfOrigin', nextState)
              const valid = getLgaOptionsForState(nextState).some((o) => o.value === form.lga)
              if (!valid) set('lga', '')
            }}
            options={stateOptions}
            placeholder="Select state"
            required
          />
          <Select
            label="LGA"
            value={form.lga}
            onChange={(e) => set('lga', e.target.value)}
            options={lgaOptions}
            placeholder={form.stateOfOrigin ? 'Select LGA' : 'Select state first'}
            disabled={!form.stateOfOrigin}
            required
          />
        </div>
        <Select label="Sport" value={form.sport} onChange={(e) => set('sport', e.target.value)} options={sportOptions} placeholder="Select sport" required />

        <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Account</h3>
        <Input label="Initial Password" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required />

        <div className="flex gap-3 pt-2">
          <Link href="/admin/members"><Button variant="outline">Cancel</Button></Link>
          <Button onClick={() => mutation.mutate()} loading={mutation.isPending} iconLeft={<Save className="w-4 h-4" />}>
            Register Member
          </Button>
        </div>
      </div>

      {/* Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onCapture={handlePhotoCapture}
        title="Capture Profile Photo"
      />
    </div>
  )
}
