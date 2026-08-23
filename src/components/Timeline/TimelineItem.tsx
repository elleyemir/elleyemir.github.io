import { motion } from 'framer-motion';
import { ArrowUpRight, Star } from 'lucide-react';
import type { TimelineEntry } from '../../types/timeline';
import { timelineIcon } from '../../lib/icons';
import { categoryStyle } from '../../lib/categories';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';

interface TimelineItemProps {
  entry: TimelineEntry;
  /** Desktop side. Mobile is always a single column. */
  side: 'left' | 'right';
  index: number;
  onOpen: (entry: TimelineEntry) => void;
}

function formatDate(entry: TimelineEntry): string {
  if (!entry.date) return String(entry.year);
  const parts = entry.date.split('-');
  if (parts.length >= 2) {
    const month = Number(parts[1]);
    const name = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][month - 1];
    return name ? `${name} ${parts[0]}` : String(entry.year);
  }
  return String(entry.year);
}

export default function TimelineItem({ entry, side, index, onOpen }: TimelineItemProps) {
  const reduceMotion = usePrefersReducedMotion();
  const Icon = timelineIcon(entry.icon);
  const style = categoryStyle(entry.category);
  const isRight = side === 'right';

  const animation = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.55, delay: Math.min(index, 4) * 0.04, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <li className="relative pl-16 sm:pl-20 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0 md:pl-0">
      {/* Card column */}
      <div
        className={`md:col-start-1 md:row-start-1 ${
          isRight ? 'md:col-start-3 md:pl-10' : 'md:pr-10 md:text-right'
        }`}
      >
        <motion.article {...animation}>
          <button
            type="button"
            onClick={() => onOpen(entry)}
            aria-label={`Open details for ${entry.title}, ${entry.year}`}
            className={`group relative w-full overflow-hidden rounded-2xl border border-parchment/[0.1] bg-ink-900/[0.7] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/[0.3] hover:bg-ink-850/[0.8] hover:shadow-lift sm:p-6 ${
              isRight ? '' : 'md:text-right'
            }`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-gold-500/[0.07] via-transparent to-azure-500/[0.06] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <span
              className={`flex flex-wrap items-center gap-2 ${
                isRight ? '' : 'md:justify-end'
              }`}
            >
              <span className="chip border-parchment/[0.15] bg-parchment/[0.04] text-parchment/[0.55] md:hidden">
                {formatDate(entry)}
              </span>
              {entry.category && <span className={`chip ${style.chip}`}>{entry.category}</span>}
              {entry.featured && (
                <span className="chip border-gold-500/[0.3] bg-gold-500/[0.07] text-gold-400">
                  <Star className="h-3 w-3" aria-hidden="true" />
                  Featured
                </span>
              )}
            </span>

            <h3 className="mt-3.5 font-display text-lg font-bold leading-snug text-parchment transition-colors duration-300 group-hover:text-gold-400 sm:text-xl">
              {entry.title}
            </h3>

            {entry.shortDescription && (
              <p className="mt-2.5 text-[0.88rem] leading-relaxed text-parchment/[0.62]">
                {entry.shortDescription}
              </p>
            )}

            <span
              className={`mt-4 flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment/[0.4] transition-colors duration-300 group-hover:text-gold-400 ${
                isRight ? '' : 'md:justify-end'
              }`}
            >
              View details
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </button>
        </motion.article>
      </div>

      {/* Node + year */}
      <div className="absolute left-0 top-6 flex flex-col items-center md:relative md:left-auto md:top-auto md:col-start-2 md:row-start-1 md:px-1">
        <span
          className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border bg-ink-900 transition-transform duration-300 ${style.node} ${
            entry.featured && !reduceMotion ? 'animate-pulse-node' : ''
          }`}
        >
          <Icon className="h-[18px] w-[18px] text-parchment/[0.85]" aria-hidden="true" />
        </span>
      </div>

      {/* Year label — opposite column on desktop */}
      <div
        className={`hidden font-mono text-sm tracking-[0.2em] text-parchment/[0.45] md:block md:row-start-1 ${
          isRight ? 'md:col-start-1 md:pr-10 md:text-right' : 'md:col-start-3 md:pl-10 md:text-left'
        }`}
      >
        <span className="md:inline-block md:rounded-full md:border md:border-parchment/[0.1] md:bg-parchment/[0.03] md:px-4 md:py-1.5">
          {formatDate(entry)}
        </span>
      </div>
    </li>
  );
}
