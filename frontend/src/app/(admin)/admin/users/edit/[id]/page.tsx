'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getUser, updateAdminUser } from '@/lib/api_services/userApiServices'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Button } from '@/components/shared/Button'
import toast from 'react-hot-toast'

export default function EditUserPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'admin',
    password: '',
    confirmPassword: '',
  })

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (user) {
      setForm((p) => ({ ...p, name: user.name, email: user.email, role: user.role }))
    }
  }, [user])

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const mutation = useMutation({
    mutationFn: () => {
      const update: Record<string, any> = {
        name: form.name,
        email: form.email,
        role: form.role,
      }
      if (form.password) update.password = form.password
      return updateAdminUser(id, update)
    },
    onSuccess: () => {
      toast.success('User updated successfully!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      router.push('/admin/users')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to update user'),
  })

  const handleSubmit = () => {
    if (!form.name || !form.email) return toast.error('Name and email are required')
    if (form.password && form.password.length < 8) return toast.error('Password must be at least 8 characters')
    if (form.password && form.password !== form.confirmPassword) return toast.error('Passwords do not match')
    mutation.mutate()
  }

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'content_manager', label: 'Content Manager' },
    { value: 'superadmin', label: 'Super Admin' },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a6b3a]" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Edit User</h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-700 border-b pb-2">User Information</h3>

        <Input
          label="Full Name"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="Enter full name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          placeholder="user@example.com"
          required
        />

        <Select
          label="Role"
          value={form.role}
          onChange={(e) => set('role', e.target.value)}
          options={roleOptions}
          required
        />

        <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Change Password <span className="text-gray-400 font-normal text-sm">(leave blank to keep current)</span></h3>

        <Input
          label="New Password"
          type="password"
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          placeholder="Minimum 8 characters"
        />

        <Input
          label="Confirm New Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => set('confirmPassword', e.target.value)}
          placeholder="Re-enter new password"
        />

        <div className="flex gap-3 pt-4">
          <Link href="/admin/users">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button
            onClick={handleSubmit}
            loading={mutation.isPending}
            iconLeft={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
