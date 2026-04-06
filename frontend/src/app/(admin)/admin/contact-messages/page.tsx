'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, MailOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { getContactMessages, markContactMessageRead } from '@/lib/api_services/contactMessageApiServices'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { PageLoader } from '@/components/shared/Spinner'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ContactMessagesPage() {
  const queryClient = useQueryClient()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: getContactMessages,
  })

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markContactMessageRead(id),
    onSuccess: () => {
      toast.success('Marked as read')
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const list = messages || []
  const unread = list.filter((m) => !m.read).length

  if (isLoading) {
    return (
      <div className="py-12">
        <PageLoader />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Contact messages</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          Messages sent from the public contact form
          {unread > 0 && (
            <span className="ml-2">
              · <span className="text-amber-700 font-medium">{unread} unread</span>
            </span>
          )}
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center text-gray-500 text-sm">
          No messages yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((m) => {
            const open = expandedId === m.id
            return (
              <li
                key={m.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : m.id)}
                  className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50/80 transition-colors"
                >
                  <div
                    className={`mt-0.5 p-2 rounded-lg ${m.read ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-800'}`}
                  >
                    {m.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900">{m.name}</span>
                      {!m.read && (
                        <Badge variant="pending" className="text-[10px]">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-0.5">{m.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(m.createdAt)}</p>
                  </div>
                  {open ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {open && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                    <div className="pt-4 space-y-3 text-sm">
                      <p>
                        <span className="text-gray-500">Email: </span>
                        <a href={`mailto:${m.email}`} className="text-[#1a6b3a] font-medium hover:underline">
                          {m.email}
                        </a>
                      </p>
                      <div>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-1">Message</p>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                      </div>
                      {!m.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markReadMutation.mutate(m.id)}
                          loading={markReadMutation.isPending}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
