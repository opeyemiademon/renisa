'use client'

import { useState, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { CreditCard, Landmark, CheckCircle, ShieldCheck } from 'lucide-react'
import { usePaystackPayment } from 'react-paystack'
import { getPaymentTypes } from '@/lib/api_services/paymentTypeApiServices'
import { getMemberPayments, recordPaystackPayment, submitManualPayment } from '@/lib/api_services/paymentApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { formatCurrency } from '@/lib/utils'
import { useAppSelector } from '@/hooks/redux'
import toast from 'react-hot-toast'

const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

export default function MakePaymentPage() {
  const router = useRouter()
  const { member } = useAppSelector((s) => s.auth)
  const [selectedTypeId, setSelectedTypeId] = useState('')
  const [payMode, setPayMode] = useState<'paystack' | 'manual'>('paystack')
  const [manualRef, setManualRef] = useState('')
  const [manualNotes, setManualNotes] = useState('')
  const currentYear = new Date().getFullYear()
  const txRef = useRef(`RENISA-${Date.now()}`)

  const { data: paymentTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['payment-types-active'],
    queryFn: () => getPaymentTypes(),
  })

  // Fetch existing payments to determine what's already paid
  const { data: existingPayments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['my-payments', member?.id],
    queryFn: () => getMemberPayments(member!.id),
    enabled: !!member?.id,
  })

  // Build a set of payment type IDs already paid/pending for this year
  const paidTypeIds = new Set(
    (existingPayments || [])
      .filter((p: any) =>
        p.year === currentYear &&
        (String(p.status) === 'successful' || String(p.status) === 'pending')
      )
      .map((p: any) => p.paymentType?.id)
      .filter(Boolean)
  )

  const selectedType = paymentTypes?.find((t) => t.id === selectedTypeId)

  const paystackConfig = {
    reference: txRef.current,
    email: member?.email || '',
    amount: (selectedType?.amount || 0) * 100,
    publicKey: PAYSTACK_KEY,
    currency: 'NGN',
  }
  const initializePayment = usePaystackPayment(paystackConfig)

  const recordMutation = useMutation({
    mutationFn: (ref: string) =>
      recordPaystackPayment({
        reference: ref,
        paymentTypeId: selectedTypeId,
        amount: selectedType!.amount,
        year: currentYear,
      }),
    onSuccess: () => {
      toast.success('Payment successful!')
      router.push('/member/payments')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to record payment'),
  })

  const manualMutation = useMutation({
    mutationFn: () =>
      submitManualPayment({
        paymentTypeId: selectedTypeId,
        year: currentYear,
        referenceNumber: manualRef,
        notes: manualNotes || undefined,
      }),
    onSuccess: () => {
      toast.success('Manual payment submitted! Awaiting admin verification.')
      router.push('/member/payments')
    },
    onError: (err: Error) => toast.error(err.message || 'Submission failed'),
  })

  const handlePaystack = () => {
    if (!selectedTypeId) return toast.error('Please select a payment type')
    if (!selectedType) return

    initializePayment({
      onSuccess: (ref: any) => {
        recordMutation.mutate(ref.reference || txRef.current)
      },
      onClose: () => {
        toast('Payment cancelled')
      },
    })
  }

  const handleManual = () => {
    if (!selectedTypeId) return toast.error('Please select a payment type')
    if (!manualRef.trim()) return toast.error('Please enter your bank transfer reference')
    manualMutation.mutate()
  }

  const isLoading = typesLoading || paymentsLoading

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Make a Payment</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Payment Type Selection */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Type</p>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : !paymentTypes?.length ? (
            <p className="text-gray-400 text-sm">No active payment types available</p>
          ) : (
            <div className="space-y-2">
              {paymentTypes.map((type) => {
                const alreadyPaid = paidTypeIds.has(type.id)
                const paidEntry = (existingPayments || []).find(
                  (p: any) => p.paymentType?.id === type.id && p.year === currentYear &&
                    (String(p.status) === 'successful' || String(p.status) === 'pending')
                )
                const statusLabel = paidEntry
                  ? String(paidEntry.status) === 'successful' ? 'Paid' : 'Pending'
                  : null

                return (
                  <label
                    key={type.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      alreadyPaid
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : selectedTypeId === type.id
                        ? 'border-[#1a6b3a] bg-[#1a6b3a]/5 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentType"
                        value={type.id}
                        checked={selectedTypeId === type.id}
                        onChange={() => !alreadyPaid && setSelectedTypeId(type.id)}
                        disabled={alreadyPaid}
                        className="accent-[#1a6b3a]"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{type.name}</p>
                        {type.description && <p className="text-xs text-gray-500">{type.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1a6b3a]">{formatCurrency(type.amount)}</span>
                      {statusLabel && (
                        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          statusLabel === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {statusLabel === 'Paid' && <ShieldCheck className="w-3 h-3" />}
                          {statusLabel}
                        </span>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          )}
          {paidTypeIds.size > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Items marked <span className="text-green-600 font-medium">Paid</span> or <span className="text-yellow-600 font-medium">Pending</span> are unavailable for {currentYear}.
            </p>
          )}
        </div>

        {/* Order Summary */}
        {selectedType && !paidTypeIds.has(selectedTypeId) && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Payment Type</span>
              <span className="font-medium">{selectedType.name}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Year</span>
              <span className="font-medium">{currentYear}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Reference</span>
              <span className="font-mono text-xs text-gray-600">{txRef.current}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span className="text-[#1a6b3a]">{formatCurrency(selectedType.amount)}</span>
            </div>
          </div>
        )}

        {/* Payment Method Tabs */}
        {selectedType && !paidTypeIds.has(selectedTypeId) && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Payment Method</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setPayMode('paystack')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  payMode === 'paystack'
                    ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${payMode === 'paystack' ? 'text-[#1a6b3a]' : 'text-gray-400'}`} />
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
                <Landmark className={`w-6 h-6 ${payMode === 'manual' ? 'text-[#1a6b3a]' : 'text-gray-400'}`} />
                <div className="text-center">
                  <p className="font-semibold text-sm text-gray-900">Bank Transfer</p>
                  <p className="text-xs text-gray-500">Manual / offline</p>
                </div>
              </button>
            </div>

            {payMode === 'paystack' && (
              <div className="space-y-3">
                <Button
                  onClick={handlePaystack}
                  loading={recordMutation.isPending}
                  iconLeft={<CreditCard className="w-4 h-4" />}
                  className="w-full"
                  size="lg"
                >
                  Pay with Paystack
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  Secure payment via Paystack — card, bank transfer, or USSD
                </p>
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
                    Transfer the exact amount, then enter your reference number below.
                  </p>
                </div>
                <Input
                  label="Transfer Reference Number"
                  placeholder="e.g. FBN2024112300012345"
                  value={manualRef}
                  onChange={(e) => setManualRef(e.target.value)}
                />
                <Input
                  label="Additional Notes (optional)"
                  placeholder="Any other info for the admin"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                />
                <Button
                  onClick={handleManual}
                  loading={manualMutation.isPending}
                  disabled={!manualRef.trim()}
                  iconLeft={<CheckCircle className="w-4 h-4" />}
                  className="w-full"
                  size="lg"
                  variant="secondary"
                >
                  Submit Manual Payment
                </Button>
                <p className="text-xs text-gray-400 text-center">
                  Your payment will be verified by an admin within 24 hours
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
