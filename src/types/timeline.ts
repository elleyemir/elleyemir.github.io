/**
 * Timeline data model.
 *
 * The timeline is data-driven: every entry lives in `src/data/timeline.json`.
 * Only `id`, `year` and `title` are required. Everything else is optional and
 * the renderer inspects what is present to decide which sections to draw, so a
 * text-only achievement, a certificate with one image, a competition result and
 * a multi-screenshot project all render correctly without component changes.
 */

/** Keys of the icon map in `src/lib/icons.ts`. Unknown values fall back safely. */
export type TimelineIconName =
  | 'code'
  | 'terminal'
  | 'git'
  | 'gamepad'
  | 'message'
  | 'globe'
  | 'rocket'
  | 'briefcase'
  | 'trophy'
  | 'building'
  | 'monitor'
  | 'graduation'
  | 'sparkles'
  | 'award'
  | 'knight';

/**
 * Free-form category label (e.g. "Learning", "Startup", "Real World Project").
 * Kept as a string so Ali can add new categories in JSON alone; known values get
 * dedicated accent styling via `categoryStyle()` in `src/lib/categories.ts`.
 */
export type TimelineCategory = string;

export interface TimelineLink {
  label?: string;
  url: string;
  /** Optional hint so the UI can pick a matching icon. */
  kind?: 'github' | 'website' | 'certificate' | 'document' | 'external';
}

export interface TimelineImageMedia {
  type: 'image';
  /** Path relative to `public/` (no leading slash) or an absolute URL. */
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface TimelineEmbedMedia {
  type: 'embed';
  /** e.g. a YouTube embed URL. */
  src: string;
  title?: string;
  caption?: string;
}

export type TimelineMedia = TimelineImageMedia | TimelineEmbedMedia;

/** Shared optional fields available to every content variant. */
interface BaseContent {
  /** Bullet points rendered as a highlight list. */
  highlights?: string[];
  /** Arbitrary label/value rows rendered as a definition list. */
  details?: Array<{ label: string; value: string }>;
  /** Extra paragraphs of prose. */
  notes?: string[];
}

export interface ProjectContent extends BaseContent {
  type: 'project';
  /** Intentionally optional — never invent technologies for an entry. */
  technologies?: string[];
  role?: string;
  status?: 'live' | 'archived' | 'closed-source' | 'in-progress';
  repository?: string;
}

export interface AchievementContent extends BaseContent {
  type: 'achievement';
  event?: string;
  placement?: string;
  issuer?: string;
}

export interface CertificateContent extends BaseContent {
  type: 'certificate';
  issuer?: string;
  credentialId?: string;
  issuedOn?: string;
}

export interface ExperienceContent extends BaseContent {
  type: 'experience';
  organization?: string;
  role?: string;
  duration?: string;
  technologies?: string[];
}

export interface EducationContent extends BaseContent {
  type: 'education';
  institution?: string;
  focus?: string;
}

export interface LearningContent extends BaseContent {
  type: 'learning';
  topics?: string[];
}

export interface StartupContent extends BaseContent {
  type: 'startup';
  company?: string;
  role?: string;
  website?: string;
}

/** Escape hatch: any future achievement shape renders via highlights/details/notes. */
export interface GenericContent extends BaseContent {
  type: 'generic';
  label?: string;
}

export type TimelineContent =
  | ProjectContent
  | AchievementContent
  | CertificateContent
  | ExperienceContent
  | EducationContent
  | LearningContent
  | StartupContent
  | GenericContent;

export interface TimelineEntry {
  /** Stable unique id (used for React keys, deep links and modal state). */
  id: string;
  year: number;
  /** Optional finer-grained date, e.g. "2026-05" or "2026-05-14". */
  date?: string;
  title: string;
  category?: TimelineCategory;
  /** One-line summary shown on the card. */
  shortDescription?: string;
  /** Longer prose shown in the modal. Falls back to shortDescription. */
  description?: string;
  icon?: TimelineIconName | string;
  featured?: boolean;
  links?: TimelineLink[];
  media?: TimelineMedia[];
  content?: TimelineContent;
}

export type Timeline = TimelineEntry[];

/** True when the modal has something beyond plain description text to render. */
export function hasRichContent(entry: TimelineEntry): boolean {
  const c = entry.content;
  const hasContentBody =
    !!c &&
    (('highlights' in c && !!c.highlights?.length) ||
      ('details' in c && !!c.details?.length) ||
      ('notes' in c && !!c.notes?.length) ||
      ('technologies' in c && !!c.technologies?.length) ||
      ('topics' in c && !!c.topics?.length));
  return !!entry.media?.length || !!entry.links?.length || hasContentBody;
}
