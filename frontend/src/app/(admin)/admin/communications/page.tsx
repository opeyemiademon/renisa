'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, MessageSquare, Clock, X, Users } from 'lucide-react'
import { sendCommunication, getCommunicationHistory } from '@/lib/api_services/communicationApiServices'
import { getAllMembers } from '@/lib/api_services/memberApiServices'
import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'
import { Select } from '@/components/shared/Select'
import { Badge } from '@/components/shared/Badge'
import { formatDate } from '@/lib/utils'
import { RichTextEditor, EMAIL_MODULES, EMAIL_FORMATS } from '@/components/shared/RichTextEditor'
import toast from 'react-hot-toast'
import { NIGERIAN_STATES } from '@/lib/nigerianStates'

type Tab = 'send' | 'history'
type RecipientType = 'all' | 'active' | 'state' | 'specific'



function MemberSearch({
  selected,
  onChange,
}: {
  selected: { id: string; name: string }[]
  onChange: (members: { id: string; name: string }[]) => void
}) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const { data: members = [] } = useQuery({
    queryKey: ['members-search', search],
    queryFn: () => getAllMembers({ search }),
    enabled: search.length >= 2,
  })

  const add = (m: any) => {
    if (!selected.find((s) => s.id === m.id)) {
      onChange([...selected, { id: m.id, name: `${m.firstName} ${m.lastName}` }])
    }
    setSearch('')
    setOpen(false)
  }

  const remove = (id: string) => onChange(selected.filter((s) => s.id !== id))

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 mb-1.5">Select Member(s)</span>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map((m) => (
            <span key={m.id} className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {m.name}
              <button type="button" onClick={() => remove(m.id)} className="hover:text-red-500 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Input
          placeholder="Search by name or member number..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true) }}
          onFocus={() => search.length >= 2 && setOpen(true)}
        />
        {open && members.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
            {(members as any[]).map((m: any) => (
              <button
                key={m.id}
                type="button"
                onClick={() => add(m)}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm"
              >
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-900">{m.firstName} {m.lastName}</span>
                <span className="text-gray-400 text-xs ml-auto">{m.memberNumber}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const RECIPIENT_LABELS: Record<RecipientType, string> = {
  all: 'All Members',
  active: 'Active Members',
  state: 'Members by State',
  specific: 'Specific Member(s)',
}

export default function CommunicationsPage() {
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<Tab>('send')
  const [recipients, setRecipients] = useState<RecipientType>('all')
  const [filterState, setFilterState] = useState('')
  const [specificMembers, setSpecificMembers] = useState<{ id: string; name: string }[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['communication-history'],
    queryFn: () => getCommunicationHistory({ limit: 30 }),
    enabled: tab === 'history',
  })

  const sendMutation = useMutation({
    mutationFn: () => sendCommunication({
      recipients,
      subject,
      message,
      filterState: recipients === 'state' ? filterState : undefined,
      specificMembers: recipients === 'specific' ? specificMembers.map((m) => m.id) : undefined,
    }),
    onSuccess: (data: any) => {
      toast.success(data.message || 'Email sent')
      queryClient.invalidateQueries({ queryKey: ['communication-history'] })
      setSubject('')
      setMessage('')
      setFilterState('')
      setSpecificMembers([])
      setRecipients('all')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const canSend = subject.trim() && message.trim() &&
    (recipients !== 'state' || filterState) &&
    (recipients !== 'specific' || specificMembers.length > 0)

  const history = historyData?.communications || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Communications</h2>
        <p className="text-gray-500 text-sm mt-0.5">Compose and send emails to members</p>
      </div>

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
              <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" />Compose</span>
            ) : (
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />History</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'send' && (
        <div className="max-w-3xl bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <Select
            label="Send To"
            value={recipients}
            onChange={(e) => { setRecipients(e.target.value as RecipientType); setFilterState(''); setSpecificMembers([]) }}
            options={[
              { value: 'all', label: 'All Members' },
              { value: 'active', label: 'Active Members Only' },
              { value: 'state', label: 'Members in a State' },
              { value: 'specific', label: 'Specific Member(s)' },
            ]}
          />

          {recipients === 'state' && (
            <Select
              label="Select State"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              options={[
                { value: '', label: 'Choose a state...' },
                ...NIGERIAN_STATES.map((s) => ({ value: s, label: s })),
              ]}
            />
          )}

          {recipients === 'specific' && (
            <MemberSearch selected={specificMembers} onChange={setSpecificMembers} />
          )}

          <Input
            label="Subject"
            placeholder="Email subject line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <RichTextEditor
            label="Message Body"
            value={message}
            onChange={setMessage}
            placeholder="Write your email message here…"
            height={380}
            modules={EMAIL_MODULES}
            formats={EMAIL_FORMATS}
          />

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              To: <span className="font-medium text-gray-700">{RECIPIENT_LABELS[recipients]}{recipients === 'state' && filterState ? ` — ${filterState}` : ''}</span>
            </p>
            <Button
              onClick={() => sendMutation.mutate()}
              loading={sendMutation.isPending}
              disabled={!canSend}
              iconLeft={<Send className="w-4 h-4" />}
            >
              Send Email
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
              <p>No emails sent yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((item: any) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={item.status === 'sent' ? 'active' : 'inactive'} className="text-xs capitalize">{item.status}</Badge>
                        <Badge variant="secondary" className="text-xs">{RECIPIENT_LABELS[item.recipients as RecipientType] || item.recipients}{item.filterState ? ` — ${item.filterState}` : ''}</Badge>
                        <span className="text-xs text-gray-400">{item.sentCount} sent{item.failedCount > 0 ? `, ${item.failedCount} failed` : ''}</span>
                      </div>
                      <p className="font-medium text-gray-900 text-sm truncate">{item.subject}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{formatDate(item.sentAt || item.createdAt)}</p>
                    </div>
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
