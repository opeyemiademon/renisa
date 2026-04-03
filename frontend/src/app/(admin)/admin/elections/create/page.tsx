'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createElection } from '@/lib/api_services/electionApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import toast from 'react-hot-toast'

interface Position {
  title: string
  description: string
  maxCandidates: string
  formFee: string
}

export default function CreateElectionPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const currentYear = new Date().getFullYear()

  const [form, setForm] = useState({
    title: '',
    description: '',
    year: String(currentYear),
    startDate: '',
    endDate: '',
    votingStartDate: '',
    votingEndDate: '',
    eligibilityMinYears: '1',
    requiresDuesPayment: true,
  })

  const [positions, setPositions] = useState<Position[]>([
    { title: '', description: '', maxCandidates: '5', formFee: '0' },
  ])

  const setField = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const addPosition = () => setPositions((p) => [...p, { title: '', description: '', maxCandidates: '5', formFee: '0' }])
  const removePosition = (i: number) => setPositions((p) => p.filter((_, idx) => idx !== i))
  const updatePosition = (i: number, f: keyof Position, v: string) =>
    setPositions((p) => p.map((pos, idx) => idx === i ? { ...pos, [f]: v } : pos))

  const mutation = useMutation({
    mutationFn: () => createElection({
      ...form,
      year: parseInt(form.year),
      eligibilityMinYears: parseInt(form.eligibilityMinYears),
      positions: positions
        .filter((p) => p.title.trim())
        .map((p) => ({
          title: p.title,
          description: p.description || undefined,
          maxCandidates: parseInt(p.maxCandidates),
          formFee: parseFloat(p.formFee),
        })),
    }),
    onSuccess: (data) => {
      toast.success('Election created')
      queryClient.invalidateQueries({ queryKey: ['elections'] })
      router.push(`/admin/elections/${data.id}`)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/elections">
          <button className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-5 h-5" /></button>
        </Link>
        <h2 className="text-xl font-semibold text-gray-900">Create Election</h2>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Basic Information</h3>
        <Input label="Election Title" placeholder="e.g. 2025 General Elections" value={form.title} onChange={(e) => setField('title', e.target.value)} />
        <Input label="Description (optional)" placeholder="Brief description..." value={form.description} onChange={(e) => setField('description', e.target.value)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Year" type="number" value={form.year} onChange={(e) => setField('year', e.target.value)} />
          <Input label="Min. Years of Membership" type="number" value={form.eligibilityMinYears} onChange={(e) => setField('eligibilityMinYears', e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="requiresDues"
            checked={form.requiresDuesPayment}
            onChange={(e) => setField('requiresDuesPayment', e.target.checked)}
            className="w-4 h-4 accent-[#1a6b3a]"
          />
          <label htmlFor="requiresDues" className="text-sm font-medium text-gray-700">Requires dues payment to vote</label>
        </div>
      </div>

      {/* Dates */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Dates</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Campaign Start Date" type="datetime-local" value={form.startDate} onChange={(e) => setField('startDate', e.target.value)} />
          <Input label="Campaign End Date" type="datetime-local" value={form.endDate} onChange={(e) => setField('endDate', e.target.value)} />
          <Input label="Voting Start Date" type="datetime-local" value={form.votingStartDate} onChange={(e) => setField('votingStartDate', e.target.value)} />
          <Input label="Voting End Date" type="datetime-local" value={form.votingEndDate} onChange={(e) => setField('votingEndDate', e.target.value)} />
        </div>
      </div>

      {/* Positions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Electoral Positions</h3>
          <Button variant="outline" size="sm" iconLeft={<Plus className="w-4 h-4" />} onClick={addPosition}>Add Position</Button>
        </div>
        {positions.map((pos, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Position {i + 1}</span>
              {positions.length > 1 && (
                <button onClick={() => removePosition(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <Input
              placeholder="Position title (e.g. President)"
              value={pos.title}
              onChange={(e) => updatePosition(i, 'title', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Max candidates"
                type="number"
                value={pos.maxCandidates}
                onChange={(e) => updatePosition(i, 'maxCandidates', e.target.value)}
              />
              <Input
                placeholder="Form fee (₦)"
                type="number"
                value={pos.formFee}
                onChange={(e) => updatePosition(i, 'formFee', e.target.value)}
              />
            </div>
            <Input
              placeholder="Description (optional)"
              value={pos.description}
              onChange={(e) => updatePosition(i, 'description', e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link href="/admin/elections"><Button variant="outline">Cancel</Button></Link>
        <Button
          onClick={() => mutation.mutate()}
          loading={mutation.isPending}
          disabled={!form.title}
        >
          Create Election
        </Button>
      </div>
    </div>
  )
}
