'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Camera, X, DollarSign, AlertCircle, CheckCircle, CreditCard, Landmark } from 'lucide-react'
import { usePaystackPayment } from 'react-paystack'
import Link from 'next/link'
import { getElection } from '@/lib/api_services/electionApiServices'
import {
  submitApplication,
  getMyApplicationForElection,
  updateApplicationPayment,
  confirmApplicationPaystackPayment,
} from '@/lib/api_services/electionApplicationApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { PhotoCaptureModal } from '@/components/shared/PhotoCaptureModal'
import { formatCurrency } from '@/lib/utils'
import { fileToBase64 } from '@/lib/fileUpload'
import { useAppSelector } from '@/hooks/redux'
import toast from 'react-hot-toast'

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

export default function ApplyForElectionPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const electionId = params.id as string
  const { member } = useAppSelector((s) => s.auth)

  const [selectedPosition, setSelectedPosition] = useState('')
  const [manifesto, setManifesto] = useState('')
  const [photoBase64, setPhotoBase64] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [payMode, setPayMode] = useState<'paystack' | 'manual'>('paystack')
  const [manualRef, setManualRef] = useState('')
  const [paystackReference, setPaystackReference] = useState('')
  const [applicationId, setApplicationId] = useState('')

  const { data: election, isLoading: electionLoading } = useQuery({
    queryKey: ['election', electionId],
    queryFn: () => getElection(electionId),
  })

  const { data: existingApplication } = useQuery({
    queryKey: ['my-application', electionId],
    queryFn: () => getMyApplicationForElection(electionId),
  })

  const selectedPos = election?.positions.find((p: any) => p.id === selectedPosition)
  const paymentFee = Number(selectedPos?.formFee ?? existingApplication?.paymentAmount ?? 0) || 0

  const paystackConfig = {
    reference: paystackReference,
    email: member?.email || '',
    amount: Math.round(paymentFee * 100),
    publicKey: PAYSTACK_KEY,
    currency: 'NGN' as const,
  }
  const initializePayment = usePaystackPayment(paystackConfig)

  useEffect(() => {
    if (existingApplication) {
      if (existingApplication.status === 'approved') {
        toast.success('Your application has been approved!')
        router.push(`/member/elections/${electionId}`)
      } else if (existingApplication.status === 'pending') {
        if (existingApplication.paymentStatus === 'pending') {
          setShowPayment(true)
          setApplicationId(existingApplication.id)
          setSelectedPosition(existingApplication.positionId.id)
          setPaystackReference(`RENISA-ELEC-${electionId}-${Date.now()}`)
        } else {
          toast('Your application is pending admin approval')
          router.push(`/member/elections/${electionId}`)
        }
      }
    }
  }, [existingApplication, electionId, router])

  const handlePhotoCapture = async (file: File) => {
    try {
      const base64 = await fileToBase64(file)
      setPhotoBase64(base64)
      setPhotoPreview(URL.createObjectURL(file))
      toast.success('Photo captured successfully!')
    } catch {
      toast.error('Failed to process photo')
    }
    setShowPhotoModal(false)
  }

  const submitMutation = useMutation({
    mutationFn: () =>
      submitApplication({
        electionId,
        positionId: selectedPosition,
        manifesto,
        photoBase64,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['my-application', electionId] })
      queryClient.invalidateQueries({ queryKey: ['my-election-applications'] })
      const position = election?.positions.find((p: any) => p.id === selectedPosition)
      if ((position?.formFee ?? 0) > 0) {
        setApplicationId(result.data.id)
        setPaystackReference(`RENISA-ELEC-${electionId}-${Date.now()}`)
        setShowPayment(true)
        toast.success('Application submitted! Please complete payment.')
      } else {
        toast.success('Application submitted successfully!')
        router.push(`/member/elections/${electionId}`)
      }
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const paystackConfirmMutation = useMutation({
    mutationFn: (reference: string) =>
      confirmApplicationPaystackPayment({
        applicationId,
        reference,
        amount: paymentFee,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-election-applications'] })
      queryClient.invalidateQueries({ queryKey: ['my-application', electionId] })
      toast.success('Payment confirmed! Your application is now pending approval.')
      router.push(`/member/elections/${electionId}`)
    },
    onError: (err: Error) => toast.error(err.message || 'Payment confirmation failed'),
  })

  const manualMutation = useMutation({
    mutationFn: () =>
      updateApplicationPayment(applicationId, {
        paymentReference: `RENISA-ELEC-MANUAL-${manualRef.replace(/\s+/g, '-').toUpperCase()}`,
        paymentAmount: paymentFee,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-election-applications'] })
      queryClient.invalidateQueries({ queryKey: ['my-application', electionId] })
      toast.success('Manual payment submitted! Admin will verify shortly.')
      router.push(`/member/elections/${electionId}`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSubmit = () => {
    if (!selectedPosition) {
      toast.error('Please select a position')
      return
    }
    if (!manifesto.trim()) {
      toast.error('Please provide your manifesto')
      return
    }
    submitMutation.mutate()
  }

  const handlePaystack = () => {
    initializePayment({
      onSuccess: (ref: { reference?: string }) => {
        paystackConfirmMutation.mutate(ref.reference || paystackReference)
      },
      onClose: () => toast('Payment cancelled'),
    })
  }

  if (electionLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-48 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-full mb-2" />
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-gray-500">Election not found</p>
      </div>
    )
  }

  if (election.status !== 'active') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Election Not Active</h3>
          <p className="text-gray-600">This election is not currently accepting applications.</p>
          <Link href="/member/elections">
            <Button className="mt-4" variant="outline">
              Back to Elections
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/member/elections/${electionId}`}>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Apply for Election</h2>
          <p className="text-gray-500 text-sm mt-0.5">{election.title}</p>
        </div>
      </div>

      {!showPayment ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You can only apply for ONE position per election</li>
              <li>• If your application is rejected, you can apply for a different position</li>
              <li>• Payment is required before admin review (when a form fee applies)</li>
              <li>• Only approved candidates will appear on the ballot</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Position <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {election.positions.map((position: any) => (
                <label
                  key={position.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPosition === position.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="position"
                      value={position.id}
                      checked={selectedPosition === position.id}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="w-4 h-4 accent-primary"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{position.title}</p>
                      {position.description && (
                        <p className="text-sm text-gray-500">{position.description}</p>
                      )}
                    </div>
                  </div>
                  {(position.formFee ?? 0) > 0 && (
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4" />
                      ₦{(position.formFee ?? 0).toLocaleString()}
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Photo <span className="text-gray-500">(Optional)</span>
            </label>
            {photoPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 w-40 h-40">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoBase64('')
                    setPhotoPreview('')
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-gray-50 transition-colors w-40 h-40"
              >
                <Camera className="w-8 h-8 text-gray-300" />
                <p className="text-xs font-medium text-gray-700">Add Photo</p>
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Manifesto <span className="text-red-500">*</span>
            </label>
            <textarea
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Explain why you're the best candidate for this position and what you plan to achieve..."
            />
            <p className="text-xs text-gray-500 mt-1">{manifesto.length} characters</p>
          </div>

          {selectedPos && (selectedPos.formFee ?? 0) > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                <strong>Form fee:</strong> {formatCurrency(selectedPos.formFee ?? 0)} — payment after submission (Paystack
                or bank transfer)
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Link href={`/member/elections/${electionId}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              onClick={handleSubmit}
              loading={submitMutation.isPending}
              disabled={!selectedPosition || !manifesto.trim()}
            >
              Submit Application
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="text-center">
            <CheckCircle className="w-14 h-14 text-[#1a6b3a] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">Complete payment</h3>
            <p className="text-gray-500 text-sm mt-1">Pay the form fee so your application can be reviewed.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Reference</span>
              <span className="font-mono text-xs text-gray-600">{paystackReference || '—'}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Position</span>
              <span className="font-medium text-gray-900">{selectedPos?.title}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
              <span>Amount due</span>
              <span className="text-[#1a6b3a]">{formatCurrency(paymentFee)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Select payment method</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
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
                type="button"
                onClick={() => setPayMode('manual')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  payMode === 'manual'
                    ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Landmark className={`w-5 h-5 ${payMode === 'manual' ? 'text-[#1a6b3a]' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className="font-semibold text-sm text-gray-900">Bank transfer</p>
                  <p className="text-xs text-gray-500">Manual / offline</p>
                </div>
              </button>
            </div>

            {payMode === 'paystack' && (
              <div className="space-y-3">
                <Button
                  onClick={handlePaystack}
                  loading={paystackConfirmMutation.isPending}
                  disabled={!paystackReference || !PAYSTACK_KEY}
                  iconLeft={<CreditCard className="w-4 h-4" />}
                  className="w-full"
                  size="lg"
                >
                  Pay with Paystack
                </Button>
                {!PAYSTACK_KEY && (
                  <p className="text-xs text-amber-700 text-center">Paystack is not configured on this environment.</p>
                )}
                <p className="text-xs text-gray-400 text-center">Secure payment via Paystack</p>
              </div>
            )}

            {payMode === 'manual' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  <p className="font-semibold mb-1">Bank transfer details</p>
                  <p>
                    Bank: <span className="font-medium">First Bank Nigeria</span>
                  </p>
                  <p>
                    Account No: <span className="font-medium">1234567890</span>
                  </p>
                  <p>
                    Account Name: <span className="font-medium">RENISA</span>
                  </p>
                  <p className="mt-2 text-xs text-blue-600">Enter your transfer reference number after payment.</p>
                </div>
                <Input
                  label="Transfer reference number"
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
                  Submit manual payment
                </Button>
                <p className="text-xs text-gray-400 text-center">Admin will verify within 24 hours</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push(`/member/elections/${electionId}`)} className="flex-1">
              Pay later
            </Button>
          </div>
        </div>
      )}

      <PhotoCaptureModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onCapture={handlePhotoCapture}
        title="Campaign Photo"
      />
    </div>
  )
}
