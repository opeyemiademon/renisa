import LeadershipGroup from '../modules/leadershipGroup/leadershipGroup.model.js';

/**
 * Public site URLs use board-of-trustees / national-executives; legacy DB seeds used bot / nec.
 */
const PUBLIC_SLUG_TO_LEGACY: Record<string, string> = {
  'board-of-trustees': 'bot',
  'national-executives': 'nec',
};

export async function findLeadershipGroupBySlugParam(slug: string) {
  if (!slug) return null;
  let g = await LeadershipGroup.findOne({ slug });
  if (g) return g;
  const legacy = PUBLIC_SLUG_TO_LEGACY[slug];
  if (legacy) {
    g = await LeadershipGroup.findOne({ slug: legacy });
    if (g) return g;
  }
  return null;
}
