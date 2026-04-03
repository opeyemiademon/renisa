'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Key, Users, Shield } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Modal } from '@/components/shared/Modal'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { Badge } from '@/components/shared/Badge'
import { useAppSelector } from '@/hooks/redux'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import graphqlClient from '@/lib/api_services/graphqlClient'

// Admin user management API functions
async function getAdminUsers() {
  const { data } = await graphqlClient.post('', {
    query: `query { adminUsers { id username email role isActive createdAt } }`,
  })
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data.adminUsers
}

async function createAdminUser(input: any) {
  const { data } = await graphqlClient.post('', {
    query: `mutation CreateAdminUser($input: CreateAdminUserInput!) {
      createAdminUser(input: $input) { id username email role }
    }`,
    variables: { input },
  })
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data.createAdminUser
}

async function updateAdminUserRole(id: string, role: string) {
  const { data } = await graphqlClient.post('', {
    query: `mutation UpdateAdminUserRole($id: ID!, $role: String!) {
      updateAdminUserRole(id: $id, role: $role) { id role }
    }`,
    variables: { id, role },
  })
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data.updateAdminUserRole
}

async function deleteAdminUser(id: string) {
  const { data } = await graphqlClient.post('', {
    query: `mutation DeleteAdminUser($id: ID!) { deleteAdminUser(id: $id) { success } }`,
    variables: { id },
  })
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data.deleteAdminUser
}

async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const { data } = await graphqlClient.post('', {
    query: `mutation ChangeAdminPassword($currentPassword: String!, $newPassword: String!) {
      changeAdminPassword(currentPassword: $currentPassword, newPassword: $newPassword) { success message }
    }`,
    variables: { currentPassword, newPassword },
  })
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data.changeAdminPassword
}

export default function SettingsPage() {
  const { adminUser } = useAppSelector((s) => s.auth)
  const queryClient = useQueryClient()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editRoleId, setEditRoleId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createForm, setCreateForm] = useState({ username: '', email: '', password: '', role: 'admin' })
  const [editRole, setEditRole] = useState('admin')
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })

  const { data: admins, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
    enabled: adminUser?.role === 'super_admin',
  })

  const createMutation = useMutation({
    mutationFn: () => createAdminUser(createForm),
    onSuccess: () => {
      toast.success('Admin user created')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setShowCreateModal(false)
      setCreateForm({ username: '', email: '', password: '', role: 'admin' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const updateRoleMutation = useMutation({
    mutationFn: () => updateAdminUserRole(editRoleId!, editRole),
    onSuccess: () => {
      toast.success('Role updated')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setEditRoleId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminUser(id),
    onSuccess: () => {
      toast.success('Admin user deleted')
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const changePasswordMutation = useMutation({
    mutationFn: () => changeAdminPassword(passwordForm.current, passwordForm.new),
    onSuccess: () => {
      toast.success('Password changed successfully')
      setPasswordForm({ current: '', new: '', confirm: '' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.new.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    changePasswordMutation.mutate()
  }

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'content_manager', label: 'Content Manager' },
    { value: 'finance_manager', label: 'Finance Manager' },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-gray-500 text-sm mt-0.5">Admin account and system settings</p>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-[#1a6b3a]" />
          <h3 className="font-semibold text-gray-900">Change Password</h3>
        </div>
        <Input
          label="Current Password"
          type="password"
          value={passwordForm.current}
          onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            value={passwordForm.new}
            onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))}
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
          />
        </div>
        <Button
          onClick={handleChangePassword}
          loading={changePasswordMutation.isPending}
          disabled={!passwordForm.current || !passwordForm.new || !passwordForm.confirm}
          size="sm"
        >
          Update Password
        </Button>
      </div>

      {/* Admin Users (Super Admin only) */}
      {adminUser?.role === 'super_admin' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#1a6b3a]" />
              <h3 className="font-semibold text-gray-900">Admin Users</h3>
            </div>
            <Button size="sm" iconLeft={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
              Add Admin
            </Button>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(admins || []).map((admin: any) => (
                <div key={admin.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1a6b3a] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">{admin.username[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{admin.username}</p>
                      <p className="text-xs text-gray-400">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={admin.role === 'super_admin' ? 'active' : 'secondary'}>
                      {admin.role.replace('_', ' ')}
                    </Badge>
                    {admin.id !== adminUser?.id && (
                      <>
                        <button
                          onClick={() => { setEditRoleId(admin.id); setEditRole(admin.role) }}
                          className="p-1.5 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(admin.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create Admin Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Admin User" size="sm">
        <div className="space-y-4">
          <Input label="Username" value={createForm.username} onChange={(e) => setCreateForm((p) => ({ ...p, username: e.target.value }))} />
          <Input label="Email" type="email" value={createForm.email} onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))} />
          <Input label="Password" type="password" value={createForm.password} onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))} />
          <Select
            label="Role"
            value={createForm.role}
            onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
            options={roleOptions}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button>
            <Button
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              className="flex-1"
              disabled={!createForm.username || !createForm.email || !createForm.password}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal isOpen={!!editRoleId} onClose={() => setEditRoleId(null)} title="Update Role" size="sm">
        <div className="space-y-4">
          <Select label="Role" value={editRole} onChange={(e) => setEditRole(e.target.value)} options={roleOptions} />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setEditRoleId(null)} className="flex-1">Cancel</Button>
            <Button onClick={() => updateRoleMutation.mutate()} loading={updateRoleMutation.isPending} className="flex-1">Update</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Delete Admin User"
        message="Are you sure you want to delete this admin user?"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
