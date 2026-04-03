'use client'

import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function StateExecProfilePage({ params }: { params: { slug: string } }) {
  return (
    <LeadershipProfile
      slug={params.slug}
      backHref="/leadership/state-executives"
      backLabel="Back to State Executives"
    />
  )
}
