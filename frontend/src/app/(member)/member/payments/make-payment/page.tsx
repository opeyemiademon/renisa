'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { CreditCard } from 'lucide-react'
import { getPaymentTypes } from '@/lib/api_services/paymentTypeApiServices'
import { initiatePayment } from '@/lib/api_services/paymentApiServices'
import { Button } from '@/components/shared/Button'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function MakePaymentPage() {
  const [selectedTypeId, setSelectedTypeId] = useState('')
  const currentYear = new Date().getFullYear()

  const { data: paymentTypes, isLoading } = useQuery({
    queryKey: ['payment-types-active'],
    queryFn: () => getPaymentTypes(true),
  })

  const initiateMutation = useMutation({
    mutationFn: () => initiatePayment({ paymentTypeId: selectedTypeId, year: currentYear }),
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to initiate payment'),
  })

  const selectedType = paymentTypes?.find((t) => t.id === selectedTypeId)

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Make a Payment</h2>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Type</p>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !paymentTypes || paymentTypes.length === 0 ? (
            <p className="text-gray-400 text-sm">No active payment types available</p>
          ) : (
            <div className="space-y-2">
              {paymentTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedTypeId === type.id
                      ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentType"
                      value={type.id}
                      checked={selectedTypeId === type.id}
                      onChange={() => setSelectedTypeId(type.id)}
                      className="accent-[#1a6b3a]"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{type.name}</p>
                      {type.description && <p className="text-xs text-gray-500">{type.description}</p>}
                    </div>
                  </div>
                  <span className="font-bold text-[#1a6b3a]">{formatCurrency(type.amount)}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {selectedType && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Payment Type</span>
              <span className="font-medium">{selectedType.name}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Year</span>
              <span className="font-medium">{currentYear}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span className="text-[#1a6b3a]">{formatCurrency(selectedType.amount)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={() => initiateMutation.mutate()}
          loading={initiateMutation.isPending}
          disabled={!selectedTypeId}
          iconLeft={<CreditCard className="w-4 h-4" />}
          className="w-full"
          size="lg"
        >
          Pay with Paystack
        </Button>
        <p className="text-xs text-gray-400 text-center">
          You will be redirected to Paystack for secure payment processing
        </p>
      </div>
    </div>
  )
}
