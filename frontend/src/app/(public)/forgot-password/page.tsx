'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { KeyRound } from 'lucide-react'
import { forgotPassword } from '@/lib/api_services/authApiServices'
import { Input } from '@/components/shared/Input'
import { Button } from '@/components/shared/Button'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const mutation = useMutation({
    mutationFn: () => forgotPassword(email.trim()),
    onSuccess: (res) => {
      toast.success(res.message)
      setSubmitted(true)
    },
    onError: (err: Error) => toast.error(err.message || 'Something went wrong'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!v) return toast.error('Enter your email address')
    mutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d4a25] via-[#1a6b3a] to-[#2d9a57] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#0d4a25] px-8 py-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EBD279]/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-[#EBD279]" />
            </div>
            <div>
              <p className="text-white font-semibold text-base">Forgot password</p>
              <p className="text-white/60 text-xs">We will email you a link to reset your password</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <p className="text-sm text-gray-600">
              Enter the email address associated with your member account. If we find a match, you will receive an email
              with a reset link (check spam). Links expire after one hour.
            </p>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={submitted}
            />
            <Button type="submit" loading={mutation.isPending} className="w-full" size="lg" disabled={submitted}>
              Send reset link
            </Button>
            <p className="text-center text-sm text-gray-500">
              <Link href="/login" className="text-[#1a6b3a] font-medium hover:underline">
                Back to sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
