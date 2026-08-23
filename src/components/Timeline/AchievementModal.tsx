import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  FileBadge,
  Github,
  Globe,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import type { TimelineEntry, TimelineLink } from '../../types/timeline';
import { timelineIcon } from '../../lib/icons';
import { categoryStyle } from '../../lib/categories';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import { useScrollLock } from '../../hooks/useScrollLock';
import MediaGallery from './MediaGallery';

interface AchievementModalProps {
  entry: TimelineEntry;
  onClose: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function linkIcon(link: TimelineLink) {
  if (link.kind === 'github' || /github\.com/.test(link.url)) return Github;
  if (link.kind === 'certificate') return FileBadge;
  if (link.kind === 'website') return Globe;
  if (link.kind === 'document') return FileBadge;
  return LinkIcon;
}

/** Sentence-case label for the content variant, e.g. "Project details". */
function sectionHeading(type: string): string {
  switch (type) {
    case 'project':
      return 'Project details';
    case 'achievement':
      return 'Achievement details';
    case 'certificate':
      return 'Certificate';
    case 'experience':
      return 'Role details';
    case 'education':
      return 'Education';
    case 'learning':
      return 'What I learned';
    case 'startup':
      return 'Venture details';
    default:
      return 'Details';
  }
}

export default function AchievementModal({ entry, onClose }: AchievementModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<Element | null>(null);
  const reduceMotion = usePrefersReducedMotion();
  useScrollLock(true);

  const Icon = timelineIcon(entry.icon);
  const style = categoryStyle(entry.category);
  const content = entry.content;

  // Remember and restore focus.
  useEffect(() => {
    restoreRef.current = document.activeElement;
    closeRef.current?.focus();
    return () => {
      const target = restoreRef.current;
      if (target instanceof HTMLElement) target.focus({ preventScroll: true });
    };
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  const details = content && 'details' in content ? content.details : undefined;
  const highlights = content?.highlights;
  const notes = content?.notes;
  const technologies =
    content && 'technologies' in content ? content.technologies : undefined;
  const topics = content && 'topics' in content ? content.topics : undefined;

  const metaRows: Array<{ label: string; value: string }> = [];
  if (content) {
    const push = (label: string, value?: string) => {
      if (value) metaRows.push({ label, value });
    };
    if ('organization' in content) push('Organization', content.organization);
    if ('company' in content) push('Company', content.company);
    if ('institution' in content) push('Institution', content.institution);
    if ('role' in content) push('Role', content.role);
    if ('duration' in content) push('Duration', content.duration);
    if ('event' in content) push('Event', content.event);
    if ('placement' in content) push('Result', content.placement);
    if ('issuer' in content) push('Issued by', content.issuer);
    if ('issuedOn' in content) push('Issued', content.issuedOn);
    if ('credentialId' in content) push('Credential ID', content.credentialId);
    if ('focus' in content) push('Focus', content.focus);
    if ('status' in content && content.status) {
      const label: Record<string, string> = {
        live: 'Live in production',
        archived: 'Archived',
        'closed-source': 'Closed source',
        'in-progress': 'In progress',
      };
      push('Status', label[content.status] ?? content.status);
    }
    if (details) metaRows.push(...details);
  }

  const dateLabel = entry.date ? `${entry.date} · ${entry.year}` : String(entry.year);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
      onKeyDown={onKeyDown}
    >
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/[0.78] backdrop-blur-md"
        aria-hidden="true"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
        transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-parchment/[0.12] bg-ink-900/[0.97] shadow-lift sm:max-h-[88vh] sm:max-w-3xl sm:rounded-3xl"
      >
        {/* Header */}
        <div className="relative shrink-0 border-b border-parchment/[0.1] bg-gradient-to-br from-gold-500/[0.07] via-transparent to-azure-500/[0.06] px-5 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-7">
          <div className="flex items-start gap-4 pr-12">
            <span
              className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl border bg-ink-900 ${style.node}`}
            >
              <Icon className="h-5 w-5 text-parchment/[0.85]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs tracking-[0.2em] text-gold-400">{dateLabel}</span>
                {entry.category && (
                  <span className={`chip ${style.chip}`}>{entry.category}</span>
                )}
              </div>
              <h2
                id="modal-title"
                className="mt-2 font-display text-2xl font-extrabold leading-tight text-parchment sm:text-3xl"
              >
                {entry.title}
              </h2>
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-4 top-4 rounded-full border border-parchment/[0.15] bg-ink-950/[0.6] p-2.5 text-parchment/[0.7] transition-colors hover:border-gold-500/[0.4] hover:text-gold-400 sm:right-6 sm:top-6"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="thin-scroll flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">
          <p className="text-[0.95rem] leading-relaxed text-parchment/[0.75]">
            {entry.description || entry.shortDescription}
          </p>

          {entry.media && entry.media.length > 0 && (
            <MediaGallery media={entry.media} title={entry.title} />
          )}

          {metaRows.length > 0 && (
            <section>
              <h3 className="eyebrow mb-3">{sectionHeading(content?.type ?? 'generic')}</h3>
              <dl className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {metaRows.map((row) => (
                  <div key={`${row.label}-${row.value}`} className="min-w-0">
                    <dt className="text-[0.68rem] uppercase tracking-[0.16em] text-parchment/[0.4]">
                      {row.label}
                    </dt>
                    <dd className="mt-0.5 break-words text-sm text-parchment/[0.8]">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {highlights && highlights.length > 0 && (
            <section>
              <h3 className="eyebrow mb-3">Highlights</h3>
              <ul className="space-y-2">
                {highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-parchment/[0.75]">
                    <span
                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-500/[0.8]"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {((technologies && technologies.length > 0) || (topics && topics.length > 0)) && (
            <section>
              <h3 className="eyebrow mb-3">{technologies?.length ? 'Technologies' : 'Topics'}</h3>
              <ul className="flex flex-wrap gap-2">
                {(technologies?.length ? technologies : (topics ?? [])).map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-azure-400/[0.25] bg-azure-400/[0.07] px-3 py-1.5 text-xs text-azure-300"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {notes && notes.length > 0 && (
            <section className="space-y-3">
              {notes.map((note) => (
                <p key={note.slice(0, 24)} className="text-sm leading-relaxed text-parchment/[0.65]">
                  {note}
                </p>
              ))}
            </section>
          )}

          {entry.links && entry.links.length > 0 && (
            <section>
              <h3 className="eyebrow mb-3">Links</h3>
              <ul className="flex flex-wrap gap-2.5">
                {entry.links.map((link) => {
                  const LinkGlyph = linkIcon(link);
                  return (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-parchment/[0.15] bg-parchment/[0.04] px-4 py-2 text-sm text-parchment/[0.85] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/[0.4] hover:text-gold-400"
                      >
                        <LinkGlyph className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{link.label || link.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}
