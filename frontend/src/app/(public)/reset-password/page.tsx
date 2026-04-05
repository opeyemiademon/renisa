'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { resetPassword } from '@/lib/api_services/authApiServices'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import toast from 'react-hot-toast'

const MIN_LEN = 8

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')?.trim() || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)

  const mutation = useMutation({
    mutationFn: () => resetPassword({ token, newPassword: password }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message)
        router.push('/login')
      } else {
        toast.error(res.message)
      }
    },
    onError: (err: Error) => toast.error(err.message || 'Something went wrong'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return toast.error('Invalid or missing reset link.')
    if (password.length < MIN_LEN) return toast.error(`Password must be at least ${MIN_LEN} characters`)
    if (password !== confirm) return toast.error('Passwords do not match')
    mutation.mutate()
  }

  if (!token) {
    return (
      <div className="p-8 space-y-4 text-center">
        <p className="text-gray-600 text-sm">This page needs a valid reset link from your email.</p>
        <Link href="/forgot-password" className="text-[#1a6b3a] font-medium text-sm hover:underline inline-block">
          Request a new link
        </Link>
        <p>
          <Link href="/login" className="text-gray-500 text-sm hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-5">
      <p className="text-sm text-gray-600">Choose a new password for your member account.</p>
      <div className="relative">
        <Input
          label="New password"
          type={showPass ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`At least ${MIN_LEN} characters`}
          required
          minLength={MIN_LEN}
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
          aria-label={showPass ? 'Hide password' : 'Show password'}
        >
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <Input
        label="Confirm password"
        type={showPass ? 'text' : 'password'}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Repeat new password"
        required
        minLength={MIN_LEN}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full" size="lg">
        Update password
      </Button>
      <p className="text-center text-sm text-gray-500">
        <Link href="/login" className="text-[#1a6b3a] font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d4a25] via-[#1a6b3a] to-[#2d9a57] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#0d4a25] px-8 py-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EBD279]/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#EBD279]" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">Set new password</p>
              <p className="text-white/60 text-xs">Complete your password reset</p>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
