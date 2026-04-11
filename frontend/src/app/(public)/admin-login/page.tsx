'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { loginAdmin } from '@/lib/api_services/authApiServices'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import { useAppDispatch } from '@/hooks/redux'
import { setCredentials } from '@/lib/store/authSlice'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const loginAdminMutation = useMutation({
    mutationFn: () => loginAdmin({ email, password }),

    onSuccess: (data) => {
      dispatch(setCredentials({ token: data.token, adminUser: data.adminUser, portal: 'admin' }))

      toast.success(`Welcome, ${data.adminUser?.username}!`)
      router.push('/admin/dashboard')
    },
    onError: (err: Error) => toast.error(err.message || 'Invalid credentials'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Enter email and password')
    loginAdminMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d4a25] via-[#1a6b3a] to-[#2d9a57] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
      

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-[#0d4a25] px-8 py-5 flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#d4a017]" />
            <div>
              <h2 className="text-white font-semibold text-base">Administrator Access</h2>
              <p className="text-white/60 text-xs mt-0.5">Restricted to authorised personnel only</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              loading={loginAdminMutation.isPending}
              className="w-full"
              size="lg"
            >
              Sign In as Admin
            </Button>

            <p className="text-center text-sm text-gray-500">
              Not an admin?{' '}
              <Link href="/login" className="text-[#1a6b3a] font-medium hover:underline">
                Member login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
