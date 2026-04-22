'use client'

import { useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Monitor, Package, ArrowLeft, ArrowRight, Eye, CheckCircle, CreditCard, Landmark } from 'lucide-react'
import {
  getIDCardSettings,
  requestIDCard,
  confirmIDCardPaystackPayment,
  manualIDCardPayment,
} from '@/lib/api_services/idCardApiServices'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { IDCardFrontPreview } from '@/components/member/IDCardFrontPreview'
import { IDCardBackPreview } from '@/components/member/IDCardBackPreview'
import { useAppSelector } from '@/hooks/redux'
import { useMemberPosition } from '@/hooks/useMemberPosition'
import { formatCurrency, buildImageUrl } from '@/lib/utils'
import { captureIdCardToPngDataUrl } from '@/lib/idCardCapture'
import { fetchImageAsDataUrl } from '@/lib/idCardPhoto'
import { buildMemberForIdCardPreview } from '@/lib/idCardMember'
import toast from 'react-hot-toast'

const STEPS = ['Choose Type', 'Upload Photo', 'Preview', 'Pay']

const PaystackPayButton = dynamic(() => import('@/components/member/PaystackPayButton'), { ssr: false })

export default function IDCardRequestPage() {
  const { member } = useAppSelector((s) => s.auth)
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [cardType, setCardType] = useState<'online' | 'physical'>('online')
  const [photo, setPhoto] = useState(member?.profilePicture ? buildImageUrl(member.profilePicture) : '')
  const [photoBase64, setPhotoBase64] = useState('')
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [requestId, setRequestId] = useState('')
  const [payMode, setPayMode] = useState<'paystack' | 'manual'>('paystack')
  const [manualRef, setManualRef] = useState('')
  const [inliningPhoto, setInliningPhoto] = useState(false)
  const txRef = useRef(`RENISA-ID-${Date.now()}`)
  const frontCardRef = useRef<HTMLDivElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)

  const { data: settings } = useQuery({
    queryKey: ['id-card-settings'],
    queryFn: getIDCardSettings,
  })

  const fee = cardType === 'online' ? settings?.onlineFee ?? 0 : settings?.physicalFee ?? 0

  const confirmMutation = useMutation({
    mutationFn: (ref: string) =>
      confirmIDCardPaystackPayment({ requestId, reference: ref, amount: fee }),
    onSuccess: () => {
      toast.success('Payment successful! Your request is being processed.')
      router.push('/member/id-card')
    },
    onError: (err: Error) => toast.error(err.message || 'Payment confirmation failed'),
  })

  const manualMutation = useMutation({
    mutationFn: () => manualIDCardPayment({ requestId, referenceNumber: manualRef }),
    onSuccess: () => {
      toast.success('Manual payment submitted! Admin will verify shortly.')
      router.push('/member/id-card')
    },
    onError: (err: Error) => toast.error(err.message || 'Submission failed'),
  })

  const previewSettings = settings
    ? {
        headerText: settings.headerText,
        footerText: settings.footerText,
        validityYears: settings.validityYears,
      }
    : null

  const cardMember = useMemo(() => (member ? buildMemberForIdCardPreview(member) : null), [member])
  const memberPosition = useMemberPosition(member?.id)

  const requestMutation = useMutation({
    mutationFn: async () => {
      if (!frontCardRef.current || !backCardRef.current) {
        throw new Error('Card preview is not ready. Please wait a moment and try again.')
      }
      const t = toast.loading('Preparing your ID card files…')
      try {
        const [generatedCardFront, generatedCardBack] = await Promise.all([
          captureIdCardToPngDataUrl(frontCardRef.current),
          captureIdCardToPngDataUrl(backCardRef.current),
        ])
        const idPhoto = photoBase64 || photo
        return requestIDCard({
          requestType: cardType,
          photo: idPhoto,
          uploadedPhoto: idPhoto,
          generatedCardFront,
          generatedCardBack,
        })
      } finally {
        toast.dismiss(t)
      }
    },
    onSuccess: (data) => {
      setRequestId(data.id)
      if (fee === 0) {
        toast.success('ID card request submitted successfully!')
        router.push('/member/id-card')
      } else {
        setStep(3)
      }
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create request'),
  })

  const handlePhotoCapture = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      setPhotoBase64(base64)
      setPhoto(base64)
    }
    reader.readAsDataURL(file)
  }

  if (!member) return null

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step > 0 ? setStep(step - 1) : router.push('/member/id-card'))}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Request ID Card</h2>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                step > i
                  ? 'bg-[#1a6b3a] text-white'
                  : step === i
                  ? 'bg-[#d4a017] text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {step > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs ml-1.5 hidden sm:inline ${step === i ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-6 h-0.5 ml-2 ${step > i ? 'bg-[#1a6b3a]' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Step 0: Choose Type */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Select ID Card Type</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  type: 'online' as const,
                  icon: <Monitor className="w-8 h-8" />,
                  title: 'Online (Digital)',
                  desc: 'Download PNG files after approval (same as your preview)',
                  fee: settings?.onlineFee,
                },
                {
                  type: 'physical' as const,
                  icon: <Package className="w-8 h-8" />,
                  title: 'Physical Card',
                  desc: 'Printed card delivered to your address',
                  fee: settings?.physicalFee,
                },
              ].map((option) => (
                <label
                  key={option.type}
                  className={`flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    cardType === option.type
                      ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.type}
                    checked={cardType === option.type}
                    onChange={() => setCardType(option.type)}
                    className="hidden"
                  />
                  <div className={`mb-3 ${cardType === option.type ? 'text-[#1a6b3a]' : 'text-gray-400'}`}>
                    {option.icon}
                  </div>
                  <h4 className="font-bold text-gray-900">{option.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{option.desc}</p>
                  {option.fee != null && (
                    <p className="text-[#1a6b3a] font-bold text-lg mt-3">{formatCurrency(option.fee)}</p>
                  )}
                </label>
              ))}
            </div>
            <Button onClick={() => setStep(1)} iconRight={<ArrowRight className="w-4 h-4" />} className="w-full">
              Continue
            </Button>
          </div>
        )}

        {/* Step 1: Upload Photo */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Photo for ID Card</h3>
            <p className="text-gray-500 text-sm">
              Use a clear, recent passport-style photo (white or plain background preferred)
            </p>
            <div className="flex flex-col items-center gap-4">
              {/* Photo preview — larger and clickable */}
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="relative w-36 h-44 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5 transition-all group"
              >
                {photo ? (
                  <>
                    <img src={photo} alt="ID photo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Eye className="w-8 h-8" />
                    <span className="text-xs text-center px-2">Tap to add photo</span>
                  </div>
                )}
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPhotoModalOpen(true)}
                iconLeft={<Eye className="w-4 h-4" />}
              >
                {photo ? 'Change Photo' : 'Take / Upload Photo'}
              </Button>
            </div>
            <Button
              onClick={async () => {
                if (!photo) return toast.error('Please provide a photo')
                if (!photo.startsWith('data:')) {
                  setInliningPhoto(true)
                  try {
                    const dataUrl = await fetchImageAsDataUrl(photo)
                    setPhoto(dataUrl)
                    setPhotoBase64(dataUrl)
                  } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : 'Could not load your photo'
                    toast.error(msg)
                    setInliningPhoto(false)
                    return
                  }
                  setInliningPhoto(false)
                }
                setStep(2)
              }}
              loading={inliningPhoto}
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="w-full"
            >
              Preview Card
            </Button>
          </div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#1a6b3a]" />
              Preview Your ID Card
            </h3>
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              This preview is exactly what will be stored for your request and used for your digital download after
              approval (same artwork the admin sees).
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              {cardMember && (
                <>
                  <div>
                    <p className="text-xs text-gray-400 text-center mb-2">Front</p>
                    <IDCardFrontPreview
                      ref={frontCardRef}
                      member={cardMember}
                      photoUrl={photoBase64 || photo}
                      settings={previewSettings}
                      position={memberPosition || undefined}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 text-center mb-2">Back</p>
                    <IDCardBackPreview ref={backCardRef} member={cardMember} settings={previewSettings} />
                  </div>
                </>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Card Type</span>
                <span className="font-medium capitalize">{cardType}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                <span>Total Fee</span>
                <span className="text-[#1a6b3a]">{fee > 0 ? formatCurrency(fee) : 'Free'}</span>
              </div>
            </div>
            <Button
              onClick={() => requestMutation.mutate()}
              loading={requestMutation.isPending}
              className="w-full"
              size="lg"
            >
              {fee === 0 ? 'Submit Request' : 'Submit & Proceed to Payment'}
            </Button>
          </div>
        )}

        {/* Step 3: Pay */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-center">
              <CheckCircle className="w-14 h-14 text-[#1a6b3a] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">Request Created!</h3>
              <p className="text-gray-500 text-sm mt-1">Complete payment to process your ID card request.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Reference</span>
                <span className="font-mono text-xs text-gray-600">{txRef.current}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                <span>Amount Due</span>
                <span className="text-[#1a6b3a]">{fee ? formatCurrency(fee) : '—'}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setPayMode('paystack')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    payMode === 'paystack'
                      ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className={`w-5 h-5 ${payMode === 'paystack' ? 'text-[#1a6b3a]' : 'text-gray-400'}`} />
                  <div className="text-center">
                    <p className="font-semibold text-sm text-gray-900">Paystack</p>
                    <p className="text-xs text-gray-500">Card, bank, USSD</p>
                  </div>
                </button>
                <button
                  onClick={() => setPayMode('manual')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    payMode === 'manual'
                      ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Landmark className={`w-5 h-5 ${payMode === 'manual' ? 'text-[#1a6b3a]' : 'text-gray-400'}`} />
                  <div className="text-center">
                    <p className="font-semibold text-sm text-gray-900">Bank Transfer</p>
                    <p className="text-xs text-gray-500">Manual / offline</p>
                  </div>
                </button>
              </div>

              {payMode === 'paystack' && (
                <div className="space-y-3">
                  <PaystackPayButton
                    email={member?.email || ''}
                    reference={txRef.current}
                    amountKobo={fee * 100}
                    loading={confirmMutation.isPending}
                    onPaid={(ref) => confirmMutation.mutate(ref)}
                    className="w-full"
                  >
                    Pay with Paystack
                  </PaystackPayButton>
                  <p className="text-xs text-gray-400 text-center">Secure payment via Paystack</p>
                </div>
              )}

              {payMode === 'manual' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-1">Bank Transfer Details</p>
                    <p>Bank: <span className="font-medium">First Bank Nigeria</span></p>
                    <p>Account No: <span className="font-medium">1234567890</span></p>
                    <p>Account Name: <span className="font-medium">RENISA</span></p>
                    <p className="mt-2 text-xs text-blue-600">
                      Enter your transfer reference number after payment.
                    </p>
                  </div>
                  <Input
                    label="Transfer Reference Number"
                    placeholder="e.g. FBN2024112300012345"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (!manualRef.trim()) return toast.error('Enter your transfer reference')
                      manualMutation.mutate()
                    }}
                    loading={manualMutation.isPending}
                    disabled={!manualRef.trim()}
                    iconLeft={<CheckCircle className="w-4 h-4" />}
                    className="w-full"
                    size="lg"
                    variant="secondary"
                  >
                    Submit Manual Payment
                  </Button>
                  <p className="text-xs text-gray-400 text-center">Admin will verify within 24 hours</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <PhotoCaptureModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        onCapture={handlePhotoCapture}
        title="ID Card Photo"
      />
    </div>
  )
}
