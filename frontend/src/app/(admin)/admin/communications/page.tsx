'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Send, MessageSquare, Clock } from 'lucide-react'
import { sendCommunication, getCommunicationHistory } from '@/lib/api_services/communicationApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Badge } from '@/components/shared/Badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

type Tab = 'send' | 'history'

export default function CommunicationsPage() {
  const [tab, setTab] = useState<Tab>('send')
  const [form, setForm] = useState({
    type: 'email',
    recipients: 'all',
    subject: '',
    message: '',
    sport: '',
    state: '',
  })

  const setField = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['communication-history'],
    queryFn: () => getCommunicationHistory({ limit: 30 }),
    enabled: tab === 'history',
  })

  const sendMutation = useMutation({
    mutationFn: () => sendCommunication({
      type: form.type as 'email' | 'sms' | 'both',
      recipients: form.recipients as 'all' | 'active' | string[],
      subject: form.subject,
      message: form.message,
      filters: {
        sport: form.sport || undefined,
        state: form.state || undefined,
      },
    }),
    onSuccess: (data: any) => {
      toast.success(`Message sent to ${data.recipientCount || 'all'} recipients`)
      setForm({ type: 'email', recipients: 'all', subject: '', message: '', sport: '', state: '' })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const history = historyData?.data || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Communications</h2>
        <p className="text-gray-500 text-sm mt-0.5">Send messages and announcements to members</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {(['send', 'history'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'send' ? (
              <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Send</span>
            ) : (
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />History</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'send' && (
        <div className="max-w-2xl bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Communication Type"
              value={form.type}
              onChange={(e) => setField('type', e.target.value)}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
                { value: 'push', label: 'Push Notification' },
              ]}
            />
            <Select
              label="Recipients"
              value={form.recipients}
              onChange={(e) => setField('recipients', e.target.value)}
              options={[
                { value: 'all', label: 'All Members' },
                { value: 'active', label: 'Active Members' },
                { value: 'alumni', label: 'Alumni' },
                { value: 'filtered', label: 'Filtered (by sport/state)' },
              ]}
            />
          </div>

          {form.recipients === 'filtered' && (
            <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <Input
                label="Filter by Sport (optional)"
                placeholder="e.g. Football"
                value={form.sport}
                onChange={(e) => setField('sport', e.target.value)}
              />
              <Input
                label="Filter by State (optional)"
                placeholder="e.g. Lagos"
                value={form.state}
                onChange={(e) => setField('state', e.target.value)}
              />
            </div>
          )}

          {form.type === 'email' && (
            <Input
              label="Subject"
              placeholder="Email subject line"
              value={form.subject}
              onChange={(e) => setField('subject', e.target.value)}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={form.message}
              onChange={(e) => setField('message', e.target.value)}
              placeholder="Type your message here..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{form.message.length} characters</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-400">
              Recipients: <span className="font-medium text-gray-700">{form.recipients === 'all' ? 'All Members' : form.recipients}</span>
            </p>
            <Button
              onClick={() => sendMutation.mutate()}
              loading={sendMutation.isPending}
              disabled={!form.message || (form.type === 'email' && !form.subject)}
              iconLeft={<Send className="w-4 h-4" />}
            >
              Send Now
            </Button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="bg-white rounded-xl border border-gray-200">
          {historyLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No communication history</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((item: any) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="active" className="text-xs">{item.type}</Badge>
                        <Badge variant="secondary" className="text-xs">{item.recipients}</Badge>
                        {item.recipientCount && (
                          <span className="text-xs text-gray-400">{item.recipientCount} recipients</span>
                        )}
                      </div>
                      {item.subject && (
                        <p className="font-medium text-gray-900 text-sm">{item.subject}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{item.message}</p>
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
