'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getPaymentTypes, createPaymentType, updatePaymentType, deletePaymentType } from '@/lib/api_services/paymentTypeApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Badge } from '@/components/shared/Badge'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PaymentTypeForm {
  name: string
  description: string
  amount: string
  frequency: string
  isActive: boolean
}

const emptyForm: PaymentTypeForm = {
  name: '', description: '', amount: '', frequency: 'annual', isActive: true,
}

export default function PaymentTypesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<PaymentTypeForm>(emptyForm)

  const setField = (f: keyof PaymentTypeForm, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const { data: paymentTypes, isLoading } = useQuery({
    queryKey: ['payment-types'],
    queryFn: () => getPaymentTypes(),
  })

  
  const createMutation = useMutation({
    mutationFn: () => createPaymentType({ ...form, amount: parseFloat(form.amount) }),
    onSuccess: () => {
      toast.success('Payment type created')
      queryClient.invalidateQueries({ queryKey: ['payment-types'] })
      setShowModal(false)
      setForm(emptyForm)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: () => updatePaymentType(editId!, { ...form, amount: parseFloat(form.amount) }),
    onSuccess: () => {
      toast.success('Payment type updated')
      queryClient.invalidateQueries({ queryKey: ['payment-types'] })
      setShowModal(false)
      setEditId(null)
      setForm(emptyForm)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePaymentType(id),
    onSuccess: () => {
      toast.success('Payment type deleted')
      queryClient.invalidateQueries({ queryKey: ['payment-types'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openEdit = (pt: any) => {
    setEditId(pt.id)
    setForm({
      name: pt.name,
      description: pt.description || '',
      amount: String(pt.amount),
      frequency: pt.frequency,
      isActive: pt.isActive,
    })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const handleSubmit = () => editId ? updateMutation.mutate() : createMutation.mutate()
  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment Types</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage dues and fee categories</p>
        </div>
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={openCreate}>
          Add Payment Type
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-32 mb-3" />
              <div className="h-8 bg-gray-100 rounded w-24 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(paymentTypes || []).map((pt: any) => (
            <div key={pt.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{pt.name}</h3>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{pt.frequency}</p>
                </div>
                <Badge variant={pt.isActive ? 'active' : 'inactive'}>{pt.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className="text-2xl font-bold text-[#1a6b3a] mb-2">{formatCurrency(pt.amount)}</p>
              {pt.description && (
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pt.description}</p>
              )}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEdit(pt)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(pt.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {(!paymentTypes || paymentTypes.length === 0) && (
            <div className="col-span-3 text-center py-16 text-gray-400">
              No payment types yet. Create one to get started.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditId(null); setForm(emptyForm) }}
        title={editId ? 'Edit Payment Type' : 'New Payment Type'}
        size="md"
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="e.g. Annual Dues" value={form.name} onChange={(e) => setField('name', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount (₦)" type="number" value={form.amount} onChange={(e) => setField('amount', e.target.value)} />
            <Select
              label="Frequency"
              value={form.frequency}
              onChange={(e) => setField('frequency', e.target.value)}
              options={[
                { value: 'annual', label: 'Annual' },
                { value: 'one-time', label: 'One-Time' },
                { value: 'monthly', label: 'Monthly' },
              ]}
            />
          </div>
          <Input
            label="Description (optional)"
            placeholder="Brief description of this payment type"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
          />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              className="w-4 h-4 accent-[#1a6b3a]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active (visible to members)</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} loading={isPending} className="flex-1">
              {editId ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Payment Type"
        message="Are you sure you want to delete this payment type? Any existing payments will remain but this type will no longer be selectable."
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
