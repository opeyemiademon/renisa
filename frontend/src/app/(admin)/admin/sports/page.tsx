'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, X, Trophy } from 'lucide-react'
import { getSports, createSport, deleteSport } from '@/lib/api_services/sportApiServices'
import toast from 'react-hot-toast'

export default function SportsListPage() {
  const queryClient = useQueryClient()
  const [newSport, setNewSport] = useState('')

  const { data: sports = [], isLoading } = useQuery({
    queryKey: ['sports'],
    queryFn: () => getSports(),
    staleTime: 60_000,
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => createSport(name),
    onSuccess: () => {
      toast.success('Sport added')
      setNewSport('')
      queryClient.invalidateQueries({ queryKey: ['sports'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSport(id),
    onSuccess: () => {
      toast.success('Sport removed')
      queryClient.invalidateQueries({ queryKey: ['sports'] })
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleAdd = () => {
    const trimmed = newSport.trim()
    if (!trimmed) return
    createMutation.mutate(trimmed)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sports List</h2>
          <p className="text-gray-500 text-sm mt-0.5">Manage the sports shown in registration and member forms</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Add new sport */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSport}
            onChange={(e) => setNewSport(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            placeholder="Type a sport name and press Enter or click Add…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={createMutation.isPending || !newSport.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Sports list */}
        {isLoading ? (
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>
        ) : sports.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm bg-gray-50 rounded-lg border border-gray-200">
            No sports yet. Add your first one above.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-20">
            {sports.map((sport) => (
              <span
                key={sport.id}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-full shadow-sm"
              >
                {sport.name}
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(sport.id)}
                  disabled={deleteMutation.isPending}
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400">{sports.length} sport{sports.length !== 1 ? 's' : ''} total</p>
      </div>
    </div>
  )
}
