'use client'

import { LeadershipProfile } from '@/components/public/LeadershipProfile'

export default function DirectorateProfilePage({ params }: { params: { slug: string } }) {
  return (
    <LeadershipProfile
      slug={params.slug}
      backHref="/leadership/directorate"
      backLabel="Back to Directorate"
    />
  )
}
