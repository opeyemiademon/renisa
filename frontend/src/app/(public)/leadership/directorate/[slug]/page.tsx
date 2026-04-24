'use client'

import { use } from 'react'
import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function DirectorateProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return (
    <LeadershipProfile
      slug={slug}
      backHref="/leadership/directorate"
      backLabel="Back to Directorate"
    />
  )
}
