'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { getAwardCategories, createAwardCategory, updateAwardCategory, deleteAwardCategory } from '@/lib/api_services/awardApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import toast from 'react-hot-toast'

export default function AwardCategoriesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const { data: categories, isLoading } = useQuery({
    queryKey: ['award-categories'],
    queryFn: () => getAwardCategories(),
  })

  const createMutation = useMutation({
    mutationFn: () => createAwardCategory(form),
    onSuccess: () => {
      toast.success('Category created')
      queryClient.invalidateQueries({ queryKey: ['award-categories'] })
      setShowModal(false)
      setForm({ name: '', description: '' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateMutation = useMutation({
    mutationFn: () => updateAwardCategory(editId!, form),
    onSuccess: () => {
      toast.success('Category updated')
      queryClient.invalidateQueries({ queryKey: ['award-categories'] })
      setShowModal(false)
      setEditId(null)
      setForm({ name: '', description: '' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAwardCategory(id),
    onSuccess: () => {
      toast.success('Category deleted')
      queryClient.invalidateQueries({ queryKey: ['award-categories'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const openEdit = (cat: any) => {
    setEditId(cat.id)
    setForm({ name: cat.name, description: cat.description || '' })
    setShowModal(true)
  }

  const openCreate = () => {
    setEditId(null)
    setForm({ name: '', description: '' })
    setShowModal(true)
  }

  const handleSubmit = () => editId ? updateMutation.mutate() : createMutation.mutate()
  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Award Categories</h2>
          <p className="text-gray-500 text-sm mt-0.5">Organize awards by category</p>
        </div>
        <Button iconLeft={<Plus className="w-4 h-4" />} onClick={openCreate}>Add Category</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-5 bg-gray-100 rounded w-32 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-64" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(categories || []).map((cat: any) => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                {cat.description && <p className="text-gray-500 text-sm mt-0.5">{cat.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{cat.awardsCount || 0} awards</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {(!categories || categories.length === 0) && (
            <div className="text-center py-12 text-gray-400">
              No categories yet. Create one to organize your awards.
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditId(null); setForm({ name: '', description: '' }) }}
        title={editId ? 'Edit Category' : 'New Category'}
        size="sm"
      >
        <div className="space-y-4">
          <Input label="Category Name" placeholder="e.g. Sports Excellence" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <Input label="Description (optional)" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
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
        title="Delete Category"
        message="Are you sure? Awards in this category will no longer be categorized."
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
