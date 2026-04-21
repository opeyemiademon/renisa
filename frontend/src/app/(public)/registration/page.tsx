'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { CheckCircle, User, MapPin, Upload, Eye, EyeOff, ArrowRight, ArrowLeft, Camera } from 'lucide-react'
import { checkMemberCode } from '@/lib/api_services/memberCodeApiServices'
import { registerMember } from '@/lib/api_services/memberApiServices'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Button } from '@/components/shared/Button'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { NIGERIAN_STATES, SPORTS } from '@/lib/nigerianStates'
import { getLgaOptionsForState } from '@/lib/nigerianLgas'
import { useAppDispatch } from '@/hooks/redux'
import { setCredentials } from '@/lib/store/authSlice'
import { fileToBase64 } from '@/lib/fileUpload'
import toast from 'react-hot-toast'
import Image from 'next/image'

const STEPS = [
  { id: 1, label: 'Verify Code', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 2, label: 'Personal Info', icon: <User className="w-5 h-5" /> },
  { id: 3, label: 'Contact', icon: <MapPin className="w-5 h-5" /> },
  { id: 4, label: 'Photo & Password', icon: <Upload className="w-5 h-5" /> },
  { id: 5, label: 'Review', icon: <CheckCircle className="w-5 h-5" /> },
]

interface FormData {
  memberCode: string
  firstName: string
  lastName: string
  middleName: string
  gender: string
  dateOfBirth: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  stateOfOrigin: string
  lga: string
  sport: string
  profilePicture: string
  photoBase64: string
  password: string
  confirmPassword: string
}

export default function RegistrationPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [codeValid, setCodeValid] = useState(false)
  const [checkingCode, setCheckingCode] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [form, setForm] = useState<FormData>({
    memberCode: '', firstName: '', lastName: '', middleName: '',
    gender: '', dateOfBirth: '', phone: '', email: '',
    address: '', city: '', state: '', stateOfOrigin: '', lga: '', sport: '',
    profilePicture: '', photoBase64: '', password: '', confirmPassword: '',
  })
  const dispatch = useAppDispatch()
  const router = useRouter()

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const checkCode = async () => {
    if (!form.memberCode.trim()) return toast.error('Enter your member code')
    setCheckingCode(true)
    try {
      const result = await checkMemberCode(form.memberCode.trim())
      if (result.valid) {
        setCodeValid(true)
        toast.success('Code verified! Proceed to fill your details.')
        setStep(2)
      } else {
        toast.error(result.message || 'Invalid member code')
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to verify code')
    } finally {
      setCheckingCode(false)
    }
  }

  const handlePhotoCapture = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setForm((prev) => ({ ...prev, photoBase64: base64, profilePicture: URL.createObjectURL(file) }))
      toast.success('Photo captured successfully!')
    } catch (error) {
      toast.error('Failed to process photo')
    }
  }

  const registerMutation = useMutation({
    mutationFn: () =>
      registerMember({
        memberCode: form.memberCode,
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName || undefined,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        stateOfOrigin: form.stateOfOrigin,
        lga: form.lga,
        sport: form.sport,
        photoBase64: form.photoBase64 || undefined,
        password: form.password,
      }),
    onSuccess: (data) => {
     
      dispatch(setCredentials({ token: data.token, member: data.member, portal: 'member' }))
      toast.success('Registration successful! Welcome to RENISA.')
      router.push('/member/dashboard')
    },
    onError: (err: Error) => {
      const raw = err.message || ''
      let message = 'Registration failed. Please check your details and try again.'
      if (raw.toLowerCase().includes('email') && raw.toLowerCase().includes('exist')) {
        message = 'An account with this email address already exists. Please use a different email or log in.'
      } else if (raw.toLowerCase().includes('phone') && raw.toLowerCase().includes('exist')) {
        message = 'An account with this phone number already exists. Please use a different phone number.'
      } else if (raw.toLowerCase().includes('member code')) {
        message = 'Your member code is invalid or has already been used. Please contact the RENISA secretariat.'
      } else if (raw) {
        message = raw
      }
      toast.error(message)
    },
  })

  const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
  const sportOptions = SPORTS.map((s) => ({ value: s, label: s }))
  const lgaOptions = getLgaOptionsForState(form.stateOfOrigin)

  const progressWidth = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-serif">Member Registration</h1>
          <p className="text-gray-500 mt-2">Join the RENISA community today</p>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                  step > s.id ? 'bg-[#1a6b3a] text-white' :
                  step === s.id ? 'bg-[#d4a017] text-white' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.id ? <CheckCircle className="w-5 h-5" /> : s.id}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-8 sm:w-16 mx-1 transition-all ${step > s.id ? 'bg-[#1a6b3a]' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-700 text-center">
            Step {step}: {STEPS[step - 1].label}
          </p>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* Step 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Enter Member Code</h2>
              <p className="text-gray-500 text-sm mb-6">
                You need a valid member code to register. Contact the RENISA secretariat to obtain one.
              </p>
              <Input
                label="Member Code"
                value={form.memberCode}
                onChange={(e) => set('memberCode', e.target.value.toUpperCase())}
                placeholder="e.g. RNS-XXXX-XXXX"
                required
              />
              <Button
                className="mt-6 w-full"
                onClick={checkCode}
                loading={checkingCode}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Verify Code
              </Button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="First Name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
                  <Input label="Last Name" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
                </div>
                <Input label="Middle Name" value={form.middleName} onChange={(e) => set('middleName', e.target.value)} />
                <Select
                  label="Gender"
                  value={form.gender}
                  onChange={(e) => set('gender', e.target.value)}
                  options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
                  placeholder="Select gender"
                  required
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => set('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(1)} iconLeft={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!form.firstName || !form.lastName || !form.gender || !form.dateOfBirth) return toast.error('Fill all required fields')
                    setStep(3)
                  }}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact &amp; Location</h2>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required />
                  <Input label="Email Address" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
                </div>
                <Input label="Home Address" value={form.address} onChange={(e) => set('address', e.target.value)} required />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="City" value={form.city} onChange={(e) => set('city', e.target.value)} required />
                  <Select
                    label="State of Residence"
                    value={form.state}
                    onChange={(e) => set('state', e.target.value)}
                    options={stateOptions}
                    placeholder="Select state"
                    required
                  />
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
                <Select
                  label="Sport"
                  value={form.sport}
                  onChange={(e) => set('sport', e.target.value)}
                  options={sportOptions}
                  placeholder="Select sport"
                  required
                />
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(2)} iconLeft={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!form.phone || !form.email || !form.address || !form.state || !form.sport) return toast.error('Fill all required fields')
                    setStep(4)
                  }}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Photo &amp; Password</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  {form.profilePicture ? (
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <Image
                        src={form.profilePicture}
                        alt="Profile preview"
                        fill
                        className="rounded-lg object-cover border-2 border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="w-12 h-12 text-gray-400" />
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
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    required
                    helperText="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Input
                  label="Confirm Password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(3)} iconLeft={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (!form.password || form.password.length < 8) return toast.error('Password must be at least 8 characters')
                    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')
                    setStep(5)
                  }}
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Review
                </Button>
              </div>
            </div>
          )}

          {/* Step 5 - Review */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Information</h2>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Member Code', value: form.memberCode },
                  { label: 'Full Name', value: `${form.firstName} ${form.middleName || ''} ${form.lastName}`.trim() },
                  { label: 'Gender', value: form.gender },
                  { label: 'Date of Birth', value: form.dateOfBirth },
                  { label: 'Phone', value: form.phone },
                  { label: 'Email', value: form.email },
                  { label: 'Address', value: form.address },
                  { label: 'City', value: form.city },
                  { label: 'State', value: form.state },
                  { label: 'State of Origin', value: form.stateOfOrigin },
                  { label: 'LGA', value: form.lga },
                  { label: 'Sport', value: form.sport },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-8">
                <Button variant="outline" onClick={() => setStep(4)} iconLeft={<ArrowLeft className="w-4 h-4" />}>Back</Button>
                <Button
                  className="flex-1"
                  onClick={() => registerMutation.mutate()}
                  loading={registerMutation.isPending}
                >
                  Submit Registration
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Photo Capture Modal */}
        <PhotoCaptureModal
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          onCapture={handlePhotoCapture}
          title="Capture Profile Photo"
        />
      </div>
    </div>
  )
}
