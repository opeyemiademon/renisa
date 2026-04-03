'use client'

import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function BOTProfilePage({ params }: { params: { slug: string } }) {
  return (
    <LeadershipProfile
      slug={params.slug}
      backHref="/leadership/board-of-trustees"
      backLabel="Back to Board of Trustees"
    />
  )
}
