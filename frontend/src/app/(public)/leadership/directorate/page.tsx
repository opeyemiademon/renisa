import { LeadershipGrid } from '@/components/public/LeadershipGrid'

export default function DirectoratePage() {
  return (
    <LeadershipGrid
      groupSlug="directorate"
      groupTitle="Directorate"
      description="Technical and administrative directors managing the key departments and operations of RENISA."
      profileUrlPrefix="/leadership/directorate"
    />
  )
}
