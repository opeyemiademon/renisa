import { useQuery } from '@tanstack/react-query'
import { getAllExecutives } from '@/lib/api_services/executiveApiServices'
import { getLeadershipMembers } from '@/lib/api_services/leadershipApiServices'

/**
 * Resolves a member's position/title by checking, in order:
 *  1. National executives (admin → Executives)
 *  2. Leadership entries (admin → Leadership: state executives, directorate, board of trustees)
 * Returns an empty string if the member has no assigned position.
 */
export function useMemberPosition(memberId: string | undefined): string {
  const { data: executives } = useQuery({
    queryKey: ['executives-all-for-position'],
    queryFn: getAllExecutives,
    staleTime: 300_000,
    enabled: !!memberId,
  })

  const { data: leadership } = useQuery({
    queryKey: ['leadership-all-for-position'],
    queryFn: () => getLeadershipMembers(),
    staleTime: 300_000,
    enabled: !!memberId,
  })

  if (!memberId) return ''

  if (executives) {
    const exec = executives.find((e: any) => {
      const mid = e.memberId
      const id = typeof mid === 'object' && mid !== null ? mid.id : mid
      return id === memberId
    })
    if (exec?.position) return exec.position
  }

  if (leadership) {
    const entry = leadership.find((l: any) => {
      const mid = l.memberId
      const id = typeof mid === 'object' && mid !== null ? mid.id : mid
      return id === memberId
    })
    if (entry?.position) return entry.position
  }

  return ''
}
