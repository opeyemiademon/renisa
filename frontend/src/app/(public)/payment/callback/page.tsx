'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { verifyPayment } from '@/lib/api_services/paymentApiServices'
import { verifyIDCardPayment } from '@/lib/api_services/idCardApiServices'
import { verifyDonationPayment } from '@/lib/api_services/donationApiServices'
import { Button } from '@/components/shared/Button'
import { formatCurrency } from '@/lib/utils'

type VerifyStatus = 'verifying' | 'success' | 'failed'

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const reference = searchParams.get('reference') || searchParams.get('trxref') || ''
  const type = searchParams.get('type') || 'payment'   // payment | idcard | donation

  const [status, setStatus] = useState<VerifyStatus>('verifying')
  const [message, setMessage] = useState('')
  const [amount, setAmount] = useState<number | null>(null)
  const [redirectPath, setRedirectPath] = useState('/member/dashboard')

  useEffect(() => {
    if (!reference) {
      setStatus('failed')
      setMessage('No payment reference found.')
      return
    }

    const verify = async () => {
      try {
        if (type === 'idcard') {
          const result = await verifyIDCardPayment(reference)
          setAmount(null)
          setMessage('ID card payment confirmed. Your request is being processed.')
          setRedirectPath('/member/id-card')
          setStatus('success')
        } else if (type === 'donation') {
          const result = await verifyDonationPayment(reference)
          setAmount((result as any).amount ?? null)
          setMessage('Thank you for your donation! It has been received successfully.')
          setRedirectPath('/')
          setStatus('success')
        } else {
          // default: member dues payment
          const result = await verifyPayment(reference)
          setAmount(result.amount)
          setMessage(`Payment for ${result.year} dues confirmed.`)
          setRedirectPath('/member/payments')
          setStatus('success')
        }
      } catch (err: any) {
        setStatus('failed')
        setMessage(err?.message || 'Payment verification failed. Please contact support.')
      }
    }

    verify()
  }, [reference, type])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 text-[#1a6b3a] animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-500">Please wait while we confirm your payment…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-10 h-10 text-[#1a6b3a]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            {amount !== null && (
              <p className="text-3xl font-bold text-[#1a6b3a] mb-3">
                {formatCurrency(amount)}
              </p>
            )}
            <p className="text-gray-600 mb-2">{message}</p>
            {reference && (
              <p className="text-xs text-gray-400 mb-6">Ref: {reference}</p>
            )}
            <Button onClick={() => router.push(redirectPath)} className="w-full">
              {type === 'donation' ? 'Back to Home' : 'View Details'}
            </Button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.back()} className="flex-1">
                Go Back
              </Button>
              <Button onClick={() => router.push('/')} className="flex-1">
                Home
              </Button>
            </div>
          </>
        )}

        {/* RENISA branding */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Secured by <span className="font-semibold text-[#1a6b3a]">RENISA</span> × Paystack
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#1a6b3a] animate-spin" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  )
}
