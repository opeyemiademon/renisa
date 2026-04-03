'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createAdminUser } from '@/lib/api_services/userApiServices'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Button } from '@/components/shared/Button'
import toast from 'react-hot-toast'

export default function AddUserPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
  })

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const mutation = useMutation({
    mutationFn: () => createAdminUser({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    }),
    onSuccess: () => {
      toast.success('User created successfully!')
      router.push('/admin/users')
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to create user'),
  })

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      return toast.error('Please fill all required fields')
    }
    if (form.password.length < 8) {
      return toast.error('Password must be at least 8 characters')
    }
    if (form.password !== form.confirmPassword) {
      return toast.error('Passwords do not match')
    }
    mutation.mutate()
  }

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'content_manager', label: 'Content Manager' },
    { value: 'superadmin', label: 'Super Admin' },
  ]

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
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

        <h3 className="font-semibold text-gray-700 border-b pb-2 pt-4">Security</h3>

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          placeholder="Minimum 8 characters"
          helperText="Minimum 8 characters"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => set('confirmPassword', e.target.value)}
          placeholder="Re-enter password"
          required
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
            Create User
          </Button>
        </div>
      </div>
    </div>
  )
}
