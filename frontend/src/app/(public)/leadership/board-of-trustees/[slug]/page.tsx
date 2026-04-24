'use client'

import { use } from 'react'
import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function BOTProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return (
    <LeadershipProfile
      slug={slug}
      backHref="/leadership/board-of-trustees"
      backLabel="Back to Board of Trustees"
    />
  )
}
