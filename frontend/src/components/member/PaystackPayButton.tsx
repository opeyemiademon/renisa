'use client'

import { CreditCard } from 'lucide-react'
import { usePaystackPayment } from 'react-paystack'
import toast from 'react-hot-toast'
import { Button } from '@/components/shared/Button'

const DEFAULT_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

export type PaystackPayButtonProps = {
  email: string
  reference: string
  amountKobo: number
  publicKey?: string
  loading?: boolean
  disabled?: boolean
  onPaid: (reference: string) => void
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showCancelToast?: boolean
}

/** Client-only: load via `next/dynamic(..., { ssr: false })` so prerender never touches `window`. */
export default function PaystackPayButton({
  email,
  reference,
  amountKobo,
  publicKey = DEFAULT_KEY,
  loading,
  disabled,
  onPaid,
  children,
  size = 'lg',
  className,
  showCancelToast = true,
}: PaystackPayButtonProps) {
  const initializePayment = usePaystackPayment({
    reference,
    email,
    amount: amountKobo,
    publicKey,
    currency: 'NGN',
  })

  return (
    <Button
      type="button"
      onClick={() =>
        initializePayment({
          onSuccess: (ref: { reference?: string }) => onPaid(ref.reference || reference),
          onClose: () => {
            if (showCancelToast) toast('Payment cancelled')
          },
        })
      }
      loading={loading}
      disabled={disabled || !publicKey || !email || amountKobo <= 0}
      iconLeft={<CreditCard className="w-4 h-4" />}
      className={className}
      size={size}
    >
      {children}
    </Button>
  )
}
