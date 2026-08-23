export interface CategoryStyle {
  /** Tailwind classes for the small category chip. */
  chip: string;
  /** Tailwind classes for the timeline node ring. */
  node: string;
}

const GOLD: CategoryStyle = {
  chip: 'border-gold-500/[0.35] bg-gold-500/[0.1] text-gold-400',
  node: 'border-gold-500/[0.7] bg-gold-500/[0.2]',
};

const AZURE: CategoryStyle = {
  chip: 'border-azure-400/[0.35] bg-azure-400/[0.1] text-azure-300',
  node: 'border-azure-400/[0.7] bg-azure-400/[0.2]',
};

const NEUTRAL: CategoryStyle = {
  chip: 'border-parchment/[0.2] bg-parchment/[0.06] text-parchment/[0.7]',
  node: 'border-parchment/[0.4] bg-parchment/[0.1]',
};

/**
 * Known categories get dedicated accents; unknown categories added later in
 * timeline.json fall back to a neutral treatment instead of breaking.
 */
export function categoryStyle(category?: string): CategoryStyle {
  if (!category) return NEUTRAL;
  const key = category.toLowerCase();
  if (/achievement|award|contest/.test(key)) return GOLD;
  if (/startup|real world/.test(key)) return GOLD;
  if (/project/.test(key)) return AZURE;
  if (/experience|internship/.test(key)) return AZURE;
  if (/learning|development|education/.test(key)) return NEUTRAL;
  return NEUTRAL;
}
