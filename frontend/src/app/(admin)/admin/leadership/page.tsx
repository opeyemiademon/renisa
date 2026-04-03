'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import Link from 'next/link'
import { getLeadershipGroups, getLeadershipMembers, deleteLeadershipMember } from '@/lib/api_services/leadershipApiServices'
import { Button } from '@/components/shared/Button'
import { Badge } from '@/components/shared/Badge'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { buildImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function LeadershipPage() {
  const queryClient = useQueryClient()
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['leadership-groups'],
    queryFn: () => getLeadershipGroups(),
  })

  // Once groups load, default to the first one
  const effectiveGroupId = activeGroupId ?? (groups && groups.length > 0 ? (groups[0] as any).id : null)
  const activeGroup = groups?.find((g: any) => g.id === effectiveGroupId) as any

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['leadership-members', effectiveGroupId],
    queryFn: () => getLeadershipMembers({ groupId: effectiveGroupId! }),
    enabled: !!effectiveGroupId,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteLeadershipMember(id),
    onSuccess: () => {
      toast.success('Member removed')
      queryClient.invalidateQueries({ queryKey: ['leadership-members', effectiveGroupId] })
      setDeleteId(null)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const members = ((membersData || []) as any[]).filter((m: any) =>
    !search || `${m.name} ${m.position || ''} ${m.state || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const isLoading = groupsLoading || (!!effectiveGroupId && membersLoading)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Leadership</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage all leadership groups</p>
        </div>
        {effectiveGroupId && (
          <Link href={`/admin/leadership/create?groupId=${effectiveGroupId}`}>
            <Button iconLeft={<Plus className="w-4 h-4" />}>Add Member</Button>
          </Link>
        )}
      </div>

      {/* Group Tabs — built from fetched groups */}
      {groupsLoading ? (
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-32 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(groups || []).map((g: any) => (
            <button
              key={g.id}
              onClick={() => { setActiveGroupId(g.id); setSearch('') }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                g.id === effectiveGroupId
                  ? 'bg-[#1a6b3a] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a6b3a]/50'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, title, state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b3a]/30"
        />
      </div>

      {/* Members grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse flex gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p>No members in {activeGroup?.name || 'this group'} yet.</p>
          {effectiveGroupId && (
            <Link href={`/admin/leadership/create?groupId=${effectiveGroupId}`}>
              <Button className="mt-4" size="sm">Add First Member</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member: any) => {
            const photo = member.profilePicture || member.photo || member.memberId?.profilePicture
            const displayName = member.name || `${member.memberId?.firstName || ''} ${member.memberId?.lastName || ''}`.trim()
            return (
              <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 group">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#1a6b3a] shrink-0">
                  {photo ? (
                    <img src={buildImageUrl(photo)} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white font-bold">{displayName[0]}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{displayName}</p>
                  <p className="text-[#1a6b3a] text-sm truncate">{member.position || member.title}</p>
                  {member.state && <p className="text-gray-400 text-xs mt-0.5">{member.state}</p>}
                  {member.tenure && <p className="text-gray-400 text-xs">{member.tenure}</p>}
                  {member.isActive !== undefined && (
                    <Badge variant={member.isActive ? 'active' : 'inactive'} className="mt-1.5 text-xs">
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/leadership/${member.id}`}>
                    <button className="p-1.5 text-gray-400 hover:text-[#1a6b3a] hover:bg-[#1a6b3a]/5 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(member.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Remove Leadership Member"
        message="Are you sure you want to remove this member from leadership?"
        confirmVariant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
