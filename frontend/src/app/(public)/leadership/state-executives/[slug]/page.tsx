'use client'

import { use } from 'react'
import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function StateExecProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return (
    <LeadershipProfile
      slug={slug}
      backHref="/leadership/state-executives"
      backLabel="Back to State Executives"
    />
  )
}
