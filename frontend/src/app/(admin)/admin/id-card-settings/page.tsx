'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Save } from 'lucide-react'
import { getIDCardSettings, updateIDCardSettings } from '@/lib/api_services/idCardApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { PageLoader } from '@/components/shared/Spinner'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function IDCardSettingsPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    onlineFee: '',
    physicalFee: '',
    validityYears: '3',
    requiresApproval: true,
    isEnabled: true,
    headerText: '',
    footerText: '',
  })

  const setField = (f: string, v: any) => setForm((p) => ({ ...p, [f]: v }))

  const { data: settings, isLoading } = useQuery({
    queryKey: ['id-card-settings'],
    queryFn: getIDCardSettings,
  })

  useEffect(() => {
    if (settings) {
      setForm({
        onlineFee: String(settings.onlineFee || ''),
        physicalFee: String(settings.physicalFee || ''),
        validityYears: String(settings.validityYears || 3),
        requiresApproval: settings.requiresApproval !== false,
        isEnabled: settings.isEnabled !== false,
        headerText: settings.headerText || '',
        footerText: settings.footerText || '',
      })
    }
  }, [settings])

  const mutation = useMutation({
    mutationFn: () => updateIDCardSettings({
      onlineFee: parseFloat(form.onlineFee),
      physicalFee: parseFloat(form.physicalFee),
      validityYears: parseInt(form.validityYears),
      requiresApproval: form.requiresApproval,
      isEnabled: form.isEnabled,
      headerText: form.headerText || undefined,
      footerText: form.footerText || undefined,
    }),
    onSuccess: () => {
      toast.success('Settings saved')
      queryClient.invalidateQueries({ queryKey: ['id-card-settings'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (isLoading) return <PageLoader />

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-[#1a6b3a]" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">ID Card Settings</h2>
          <p className="text-gray-500 text-sm mt-0.5">Configure ID card request and issuance settings</p>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h3 className="font-semibold text-gray-900">General</h3>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p className="font-medium text-gray-900">ID Card System</p>
            <p className="text-sm text-gray-400">Enable or disable ID card requests</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.isEnabled}
              onChange={(e) => setField('isEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#1a6b3a]/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a6b3a]" />
          </label>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div>
            <p className="font-medium text-gray-900">Requires Admin Approval</p>
            <p className="text-sm text-gray-400">Manually approve each ID card request before processing</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.requiresApproval}
              onChange={(e) => setField('requiresApproval', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#1a6b3a]/30 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a6b3a]" />
          </label>
        </div>

        <Input
          label="Card Validity (years)"
          type="number"
          min="1"
          max="10"
          value={form.validityYears}
          onChange={(e) => setField('validityYears', e.target.value)}
          helperText="Number of years before the card expires"
        />
      </div>

      {/* Fees */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Fees</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              label="Online (Digital) Card Fee"
              type="number"
              placeholder="0"
              value={form.onlineFee}
              onChange={(e) => setField('onlineFee', e.target.value)}
            />
            {form.onlineFee && <p className="text-xs text-gray-400 mt-1">{formatCurrency(parseFloat(form.onlineFee))}</p>}
          </div>
          <div>
            <Input
              label="Physical Card Fee"
              type="number"
              placeholder="0"
              value={form.physicalFee}
              onChange={(e) => setField('physicalFee', e.target.value)}
            />
            {form.physicalFee && <p className="text-xs text-gray-400 mt-1">{formatCurrency(parseFloat(form.physicalFee))}</p>}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Card Content</h3>
        <Input
          label="Header Text (optional)"
          placeholder="Text at top of card"
          value={form.headerText}
          onChange={(e) => setField('headerText', e.target.value)}
        />
        <Input
          label="Footer Text (optional)"
          placeholder="Text at bottom of card"
          value={form.footerText}
          onChange={(e) => setField('footerText', e.target.value)}
        />
      </div>

      <Button
        onClick={() => mutation.mutate()}
        loading={mutation.isPending}
        iconLeft={<Save className="w-4 h-4" />}
      >
        Save Settings
      </Button>
    </div>
  )
}
