import { LeadershipGrid } from '@/components/public/LeadershipGrid'

export default function NationalExecutivesPage() {
  return (
    <LeadershipGrid
      groupSlug="national-executives"
      groupTitle="National Executives"
      description="The executive team responsible for the day-to-day operations and policy implementation of RENISA."
      profileUrlPrefix="/leadership/national-executives"
    />
  )
}
