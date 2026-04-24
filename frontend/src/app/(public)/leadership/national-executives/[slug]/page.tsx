'use client'

import { use } from 'react'
import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function NECProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return (
    <LeadershipProfile
      slug={slug}
      backHref="/leadership/national-executives"
      backLabel="Back to National Executives"
    />
  )
}
