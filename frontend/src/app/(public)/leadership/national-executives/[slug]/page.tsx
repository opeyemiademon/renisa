'use client'

import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function NECProfilePage({ params }: { params: { slug: string } }) {
  return (
    <LeadershipProfile
      slug={params.slug}
      backHref="/leadership/national-executives"
      backLabel="Back to National Executives"
    />
  )
}
