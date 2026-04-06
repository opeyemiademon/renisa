'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, CheckCircle, CreditCard, Landmark, FileText, Loader2, User } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { getElection } from '@/lib/api_services/electionApiServices'
import {
  applyForPosition,
  confirmCandidateFormPayment,
  manualCandidateFormPayment,
  submitCandidacy,
} from '@/lib/api_services/candidateApiServices'
import { uploadFile } from '@/lib/api_services/uploadApiService'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { useAppSelector } from '@/hooks/redux'
import { buildImageUrl, formatCurrency } from '@/lib/utils'

const STEPS = ['Choose Position', 'Pay Form Fee', 'Submit Application']

const PaystackPayButton = dynamic(() => import('@/components/member/PaystackPayButton'), { ssr: false })

type Step = 0 | 1 | 2

function ElectionApplyPageContent() {
  const searchParams = useSearchParams()
  const redirectElectionId = searchParams.get('election')
  const electionId = redirectElectionId || ''
  const router = useRouter()
  const queryClient = useQueryClient()
  const { member } = useAppSelector((s) => s.auth)

  useEffect(() => {
    if (redirectElectionId) {
      router.replace(`/member/elections/${redirectElectionId}/apply`)
    }
  }, [redirectElectionId, router])

  const [step, setStep] = useState<Step>(0)
  const [selectedPositionId, setSelectedPositionId] = useState('')
  const [candidateId, setCandidateId] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<any>(null)
  const [payMode, setPayMode] = useState<'paystack' | 'manual'>('paystack')
  const [manualRef, setManualRef] = useState('')
  const [manifesto, setManifesto] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState(member?.profilePicture ? buildImageUrl(member.profilePicture) : '')
  const [uploading, setUploading] = useState(false)
  const txRef = useRef(`RENISA-FORM-${Date.now()}`)

  const { data: election, isLoading } = useQuery({
    queryKey: ['election', electionId],
    queryFn: () => getElection(electionId),
    enabled: !!electionId && !redirectElectionId,
  })

  const formFee = selectedPosition?.formFee ?? 0

  const applyMutation = useMutation({
    mutationFn: () => applyForPosition(electionId, selectedPositionId),
    onSuccess: (res) => {
      setCandidateId(res.candidateId || res.data?.id)
      if (formFee === 0) {
        setStep(2)
      } else {
        setStep(1)
      }
    },
    onError: (e: any) => toast.error(e.message),
  })

  const confirmMutation = useMutation({
    mutationFn: (ref: string) => confirmCandidateFormPayment(candidateId, ref),
    onSuccess: () => {
      toast.success('Payment confirmed!')
      setStep(2)
    },
    onError: (e: any) => toast.error(e.message),
  })

  const manualMutation = useMutation({
    mutationFn: () => manualCandidateFormPayment(candidateId, manualRef),
    onSuccess: () => {
      toast.success('Manual payment submitted. Please proceed to fill your application.')
      setStep(2)
    },
    onError: (e: any) => toast.error(e.message),
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      let photoUrl = ''
      if (photoFile) {
        setUploading(true)
        try {
          const result = await uploadFile(photoFile, undefined, 'members')
          photoUrl = result.url
        } finally {
          setUploading(false)
        }
      }
      return submitCandidacy({
        electionId,
        positionId: selectedPositionId,
        manifesto,
        ...(photoUrl && { profilePicture: photoUrl }),
      })
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!')
      queryClient.invalidateQueries({ queryKey: ['my-election-applications'] })
      router.push('/member/elections')
    },
    onError: (e: any) => toast.error(e.message),
  })

  const handlePositionSelect = (pos: any) => {
    setSelectedPositionId(pos.id)
    setSelectedPosition(pos)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (redirectElectionId) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-sm">Opening application form…</p>
      </div>
    )
  }

  if (!electionId) return (
    <div className="text-center py-16 text-gray-400">
      <p>No election specified.</p>
      <Link href="/member/elections" className="text-primary text-sm mt-2 inline-block">Back to elections</Link>
    </div>
  )

  if (isLoading) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  )

  if (!election) return <div className="text-center py-16 text-gray-400">Election not found</div>

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/member/elections" className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Apply as Candidate</h2>
          <p className="text-sm text-gray-500">{election.title}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step > i ? 'bg-primary text-white' : step === i ? 'bg-[#d4a017] text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {step > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs text-center hidden sm:block ${step === i ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 mb-4 ${step > i ? 'bg-primary' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">

        {/* Step 0: Choose Position */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Select a Position</h3>
            <p className="text-sm text-gray-500">Choose the position you want to contest for. You can only apply for one position per election.</p>

            {election.positions?.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No positions available in this election.</p>
            ) : (
              <div className="space-y-3">
                {election.positions?.map((pos: any) => (
                  <label
                    key={pos.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedPositionId === pos.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="position"
                      value={pos.id}
                      checked={selectedPositionId === pos.id}
                      onChange={() => handlePositionSelect(pos)}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{pos.title}</p>
                      {pos.description && <p className="text-sm text-gray-500 mt-0.5">{pos.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-bold text-primary">
                          Form Fee: {pos.formFee > 0 ? formatCurrency(pos.formFee) : 'Free'}
                        </span>
                        {pos.maxCandidates && (
                          <span className="text-xs text-gray-400">Max {pos.maxCandidates} candidates</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <Button
              onClick={() => applyMutation.mutate()}
              disabled={!selectedPositionId || applyMutation.isPending}
              loading={applyMutation.isPending}
              iconRight={<ArrowRight className="w-4 h-4" />}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 1: Pay Form Fee */}
        {step === 1 && selectedPosition && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Pay Form Fee</h3>
              <p className="text-sm text-gray-500 mt-1">Pay the candidacy form fee to proceed</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Position</span>
                <span className="font-medium">{selectedPosition.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reference</span>
                <span className="font-mono text-xs text-gray-600">{txRef.current}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
                <span>Amount Due</span>
                <span className="text-primary">{formatCurrency(formFee)}</span>
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'paystack', label: 'Paystack', sub: 'Card, bank, USSD', icon: CreditCard },
                { key: 'manual', label: 'Bank Transfer', sub: 'Manual / offline', icon: Landmark },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setPayMode(m.key as any)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    payMode === m.key ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <m.icon className={`w-5 h-5 ${payMode === m.key ? 'text-primary' : 'text-gray-400'}`} />
                  <div className="text-center">
                    <p className="font-semibold text-sm text-gray-900">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.sub}</p>
                  </div>
                </button>
              ))}
            </div>

            {payMode === 'paystack' && (
              <PaystackPayButton
                email={member?.email || ''}
                reference={txRef.current}
                amountKobo={formFee * 100}
                loading={confirmMutation.isPending}
                onPaid={(ref) => confirmMutation.mutate(ref)}
              >
                Pay {formatCurrency(formFee)} with Paystack
              </PaystackPayButton>
            )}

            {payMode === 'manual' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  <p className="font-semibold mb-2">Bank Transfer Details</p>
                  <p>Bank: <span className="font-medium">First Bank Nigeria</span></p>
                  <p>Account No: <span className="font-medium">1234567890</span></p>
                  <p>Account Name: <span className="font-medium">RENISA</span></p>
                  <p className="mt-2 text-xs text-blue-600">Enter your transfer reference after payment.</p>
                </div>
                <Input
                  label="Transfer Reference Number"
                  placeholder="e.g. FBN2024112300012345"
                  value={manualRef}
                  onChange={(e) => setManualRef(e.target.value)}
                />
                <Button
                  onClick={() => { if (!manualRef.trim()) { toast.error('Enter your transfer reference'); return; } manualMutation.mutate() }}
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
        )}

        {/* Step 2: Submit Manifesto */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Submit Your Application
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Provide your manifesto and a photo for the ballot. Admin will review and approve.
              </p>
            </div>

            {selectedPosition && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 text-sm">
                Applying for: <span className="font-semibold text-primary">{selectedPosition.title}</span>
              </div>
            )}

            {/* Photo upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Photo <span className="text-gray-400 font-normal">(optional — uses profile photo if not set)</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer text-sm text-primary hover:underline font-medium">
                  Change Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                </label>
              </div>
            </div>

            {/* Manifesto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manifesto / Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                value={manifesto}
                onChange={(e) => setManifesto(e.target.value)}
                placeholder="Write your manifesto, goals, and why members should vote for you..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{manifesto.length} / 2000 characters</p>
            </div>

            <Button
              onClick={() => {
                if (!manifesto.trim()) { toast.error('Please write your manifesto'); return; }
                submitMutation.mutate()
              }}
              loading={submitMutation.isPending || uploading}
              iconLeft={<CheckCircle className="w-4 h-4" />}
              className="w-full"
              size="lg"
            >
              Submit Application
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ElectionApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm">Loading…</p>
        </div>
      }
    >
      <ElectionApplyPageContent />
    </Suspense>
  )
}
