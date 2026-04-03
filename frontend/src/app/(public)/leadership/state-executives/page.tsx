import { LeadershipGrid } from '@/components/public/LeadershipGrid'

export default function StateExecutivesPage() {
  return (
    <LeadershipGrid
      groupSlug="state-executives"
      groupTitle="State Executives"
      description="RENISA state-level representatives and executives across all 36 states and FCT."
      profileUrlPrefix="/leadership/state-executives"
      showStateFilter={true}
    />
  )
}
