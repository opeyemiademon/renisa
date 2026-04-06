/** Map legacy DB slugs to public URL segments (matches app routes under /leadership). */
export function leadershipUrlSegment(dbSlug: string): string {
  const map: Record<string, string> = {
    bot: 'board-of-trustees',
    nec: 'national-executives',
  }
  return map[dbSlug] || dbSlug
}

export function leadershipListPath(dbSlug: string): string {
  return `/leadership/${leadershipUrlSegment(dbSlug)}`
}
