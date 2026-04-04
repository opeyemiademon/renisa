'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getDonationTypes, createDonationType, updateDonationType, deleteDonationType } from '@/lib/api_services/donationApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Badge } from '@/components/shared/Badge'
import toast from 'react-hot-toast'

interface DonationTypeForm {
  name: string
  description: string
  donationMode: string
  isActive: boolean
}

const emptyForm: DonationTypeForm = {
  name: '', description: '', donationMode: 'monetary', isActive: true,
}

export default function DonationTypesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState<DonationTypeForm>(emptyForm)

  const setField = (f: keyof DonationTypeForm, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const { data: donationTypes, isLoading } = useQuery({
    queryKey: ['donation-types'],
    queryFn: () => getDonationTypes(),
  })

  const createMutation = useMutation({
    mutationFn: () => createDonationType(form),
    onSuccess: () => {
      toast.success('Donation type created')
      queryClient.invalidateQueries({ queryKey: ['donation-types'] })
      setShowModal(false)
      setForm(emptyForm)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateDonationType(editId!, form),
    onSuccess: () => {
      toast.success('Donation type updated')
      queryClient.invalidateQueries({ queryKey: ['donation-types'] })
      setShowModal(false)
      setEditId(null)
      setForm(emptyForm)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDonationType(id),
    onSuccess: () => {
      toast.success('Donation type deleted')
      queryClient.invalidateQueries({ queryKey: ['donation-types'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openEdit = (dt: any) => {
    setEditId(dt.id)
    setForm({ name: dt.name, description: dt.description || '', donationMode: dt.donationType || 'monetary', isActive: dt.isActive !== false })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const handleSubmit = () => editId ? updateMutation.mutate() : createMutation.mutate()
  const isPending = createMutation.isPending || updateMutation.isPending

  const typeIcon: Record<string, string> = { monetary: '💰', physical: '📦', both: '🎁' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Donation Types</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage donation categories</p>
        </div>
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Type</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(donationTypes || []).map((dt: any) => (
            <div key={dt.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{typeIcon[dt.donationType] || '🎁'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{dt.name}</h3>
                    <Badge variant={dt.isActive ? 'active' : 'inactive'}>{dt.isActive ? 'Active' : 'Inactive'}</Badge>
                    <span className="text-xs text-gray-400 capitalize">{dt.donationMode}</span>
                  </div>
                  {dt.description && <p className="text-gray-500 text-sm mt-0.5">{dt.description}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(dt)} className="p-2 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(dt.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {(!donationTypes || donationTypes.length === 0) && (
            <div className="text-center py-12 text-gray-400">No donation types yet</div>
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditId(null); setForm(emptyForm) }}
        title={editId ? 'Edit Donation Type' : 'New Donation Type'}
        size="sm"
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="e.g. Equipment Donation" value={form.name} onChange={(e) => setField('name', e.target.value)} />
          <Select
            label="Type"
            value={form.donationMode}
            onChange={(e) => setField('donationMode', e.target.value)}
            options={[
              { value: 'monetary', label: 'Monetary (Cash/Transfer)' },
              { value: 'physical', label: 'Physical (Items/Goods)' },
              { value: 'both', label: 'Both' },
            ]}
          />
          <Input label="Description (optional)" value={form.description} onChange={(e) => setField('description', e.target.value)} />
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="dtActive"
              checked={form.isActive}
              onChange={(e) => setField('isActive', e.target.checked)}
              className="w-4 h-4 accent-[#1a6b3a]"
            />
            <label htmlFor="dtActive" className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button onClick={handleSubmit} loading={isPending} className="flex-1" disabled={!form.name}>
              {editId ? 'Save' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Donation Type"
        message="Are you sure you want to delete this donation type?"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
