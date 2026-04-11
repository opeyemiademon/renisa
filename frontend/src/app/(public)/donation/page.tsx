'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Heart, Package, CreditCard, Users, Landmark } from 'lucide-react'
import {
  getDonationTypes,
  submitPhysicalDonation,
  initiateMonetaryDonation,
  submitManualMonetaryDonation,
} from '@/lib/api_services/donationApiServices'
import { getPublicDonationBankDetails } from '@/lib/donationBankDetails'
import { Input, Textarea } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import { Modal } from '@/components/shared/Modal'
import { PageLoader } from '@/components/shared/Spinner'
import { DonationType } from '@/types'
import toast from 'react-hot-toast'
import { getPublicSiteStats } from '@/lib/api_services/publicSiteApiServices'

const modeIcon = (mode: string) =>
  mode === 'physical'
    ? <Package className="w-6 h-6 text-[#1a6b3a]" />
    : <CreditCard className="w-6 h-6 text-[#1a6b3a]" />

export default function DonationPage() {
  const [selectedType, setSelectedType] = useState<DonationType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { data: apiTypes, isLoading } = useQuery({
    queryKey: ['donation-types'],
    queryFn: () => getDonationTypes(true),
  })

  const { data: siteStats } = useQuery({
    queryKey: ['public-site-stats'],
    queryFn: getPublicSiteStats,
    staleTime: 60_000,
  })

  const types: DonationType[] = (apiTypes || []).filter((t) => t.isActive !== false)

  const impactStats = siteStats
    ? [
        { value: String(siteStats.activeMembers), label: 'Active members' },
        { value: String(siteStats.awardedHonors), label: 'Honours recorded' },
      ]
    : []

  const openModal = (type: DonationType) => {
    setSelectedType(type)
    setModalOpen(true)
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0d4a25] via-[#0d4a25] to-[#1a6b3a] py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-2 border-[#EBD279]" />
          <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full border-2 border-[#EBD279]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="w-16 h-16 bg-[#d4a017] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-[#EBD279] font-medium text-xs uppercase tracking-[0.3em] mb-4">Give Back</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">Support RENISA</h1>
          <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
            Your generous contribution helps us continue honoring Nigeria&apos;s sports legends and
            providing welfare support to retired athletes across the country.
          </p>
        </div>
      </section>

      {impactStats.length > 0 && (
        <section className="bg-[#0d4a25] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 text-center">
              {impactStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl md:text-3xl font-bold text-[#EBD279]">{stat.value}</p>
                  <p className="text-white/60 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Donation types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#1a6b3a] text-xs font-semibold uppercase tracking-widest mb-2">Make a Difference</p>
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Ways to Donate</h2>
            <p className="text-gray-500 mt-2">Choose a donation category below to get started</p>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : types.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No donation categories are available at the moment. Please check back later.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {types.map((type) => (
                <div
                  key={type.id}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#d4a017]/40 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#1a6b3a]/8 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a6b3a]/15 transition-colors">
                      {modeIcon(type.donationMode || 'monetary')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base leading-tight">{type.name}</h3>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {type.donationMode === 'physical' ? 'Physical Item' : 'Monetary'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">{type.description}</p>

                  <Button
                    size="sm"
                    onClick={() => openModal(type)}
                    className="w-full"
                  >
                    {type.donationMode === 'physical' ? 'Donate Items' : 'Donate Now'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bank details CTA strip */}
      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-10 h-10 mx-auto mb-4 text-[#1a6b3a] opacity-70" />
          <h3 className="text-xl font-bold text-gray-900 font-serif mb-2">Prefer a Direct Bank Transfer?</h3>
          <p className="text-gray-500 text-sm mb-5">
            You can also donate directly to our association account. Contact us for bank details.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#1a6b3a] hover:bg-[#0d4a25] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Donation Modal */}
      {selectedType && (
        <DonationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          type={selectedType}
        />
      )}
    </div>
  )
}

function DonationModal({
  isOpen,
  onClose,
  type,
}: {
  isOpen: boolean
  onClose: () => void
  type: DonationType
}) {
  const [payMode, setPayMode] = useState<'paystack' | 'manual'>('paystack')
  const [form, setForm] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    description: '',
    items: '',
    manualTransferReference: '',
  })

  const isPhysical = type.donationMode === 'physical'
  const bank = getPublicDonationBankDetails()

  const physicalMutation = useMutation({
    mutationFn: () =>
      submitPhysicalDonation({
        donationTypeId: type.id,
        donorName: form.donorName,
        donorEmail: form.donorEmail || undefined,
        donorPhone: form.donorPhone || undefined,
        description: form.description || undefined,
        items: form.items || undefined,
      }),
    onSuccess: () => {
      toast.success('Donation submitted! Thank you for your generosity.')
      onClose()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const paystackMutation = useMutation({
    mutationFn: () =>
      initiateMonetaryDonation({
        donationTypeId: type.id,
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        donorPhone: form.donorPhone || undefined,
        amount: Number(form.amount),
        description: form.description || undefined,
      }),
    onSuccess: (data) => {
      if (data.authorizationUrl) {
        toast.success('Redirecting to Paystack…')
        window.location.href = data.authorizationUrl
        return
      }
      toast.error(
        data.message ||
          'Online payment could not be started. Configure Paystack on the server or use bank transfer.'
      )
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const manualMutation = useMutation({
    mutationFn: () =>
      submitManualMonetaryDonation({
        donationTypeId: type.id,
        donorName: form.donorName,
        donorEmail: form.donorEmail,
        donorPhone: form.donorPhone || undefined,
        amount: Number(form.amount),
        description: form.description || undefined,
        manualTransferReference: form.manualTransferReference.trim(),
      }),
    onSuccess: () => {
      toast.success('Thank you! We recorded your transfer and will verify it soon.')
      onClose()
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.donorName.trim()) return toast.error('Enter your name')
    if (isPhysical) {
      physicalMutation.mutate()
    } else {
      if (!form.donorEmail.trim()) return toast.error('Email is required for monetary donations')
      if (!form.amount || Number(form.amount) < 100) return toast.error('Enter a valid amount (min ₦100)')
      if (payMode === 'manual') {
        if (!form.manualTransferReference.trim()) return toast.error('Enter your bank transfer reference')
        manualMutation.mutate()
      } else {
        paystackMutation.mutate()
      }
    }
  }

  const loading =
    physicalMutation.isPending || paystackMutation.isPending || manualMutation.isPending

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Donate: ${type.name}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name"
          value={form.donorName}
          onChange={(e) => setForm({ ...form, donorName: e.target.value })}
          required
        />
        <Input
          label={isPhysical ? 'Email (optional)' : 'Email Address'}
          type="email"
          value={form.donorEmail}
          onChange={(e) => setForm({ ...form, donorEmail: e.target.value })}
          required={!isPhysical}
        />
        <Input
          label="Phone"
          required
          type="tel"
          value={form.donorPhone}
          onChange={(e) => setForm({ ...form, donorPhone: e.target.value })}
        />
        {!isPhysical && (
          <Input
            label="Amount (₦)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="5000"
            required
            min={100}
          />
        )}
        {!isPhysical && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Payment method</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPayMode('paystack')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm transition-all ${
                  payMode === 'paystack'
                    ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-5 h-5 ${payMode === 'paystack' ? 'text-[#1a6b3a]' : 'text-gray-400'}`} />
                <span className="font-semibold text-gray-900">Paystack</span>
                <span className="text-[10px] text-gray-500 text-center">Card, bank, USSD</span>
              </button>
              <button
                type="button"
                onClick={() => setPayMode('manual')}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm transition-all ${
                  payMode === 'manual'
                    ? 'border-[#1a6b3a] bg-[#1a6b3a]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Landmark className={`w-5 h-5 ${payMode === 'manual' ? 'text-[#1a6b3a]' : 'text-gray-400'}`} />
                <span className="font-semibold text-gray-900">Bank transfer</span>
                <span className="text-[10px] text-gray-500 text-center">Manual / offline</span>
              </button>
            </div>
          </div>
        )}
        {payMode === 'manual' && !isPhysical && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950 space-y-1">
            <p className="font-semibold text-amber-900">Pay into</p>
            <p>
              <span className="text-amber-800/80">Bank: </span>
              {bank.bankName}
            </p>
            <p>
              <span className="text-amber-800/80">Account name: </span>
              {bank.accountName}
            </p>
            <p>
              <span className="text-amber-800/80">Account no.: </span>
              <span className="font-mono font-medium">{bank.accountNumber}</span>
            </p>
            <p className="text-xs text-amber-800/90 pt-1">
              Use your name or the reference below in the transfer narration. After paying, submit the reference
              your bank gave you.
            </p>
            <Input
              label="Transfer reference (from bank / receipt)"
              value={form.manualTransferReference}
              onChange={(e) => setForm({ ...form, manualTransferReference: e.target.value })}
              placeholder="e.g. NIP txn ref or receipt ID"
              required
            />
          </div>
        )}
        {isPhysical && (
          <Textarea
            label="Items Description"
            value={form.items}
            onChange={(e) => setForm({ ...form, items: e.target.value })}
            placeholder="Describe the items you're donating..."
            rows={3}
          />
        )}
        <Textarea
          label="Additional Notes (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
        />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            {isPhysical
              ? 'Submit Donation'
              : payMode === 'manual'
                ? 'Submit transfer details'
                : 'Pay with Paystack'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
