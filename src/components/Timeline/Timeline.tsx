import { Suspense, lazy, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { timeline as timelineEntries } from '../../data/profile';
import type { TimelineEntry } from '../../types/timeline';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import TimelineItem from './TimelineItem';

// Code-split: the modal only loads when a milestone is opened.
const AchievementModal = lazy(() => import('./AchievementModal'));

export default function Timeline() {
  const [active, setActive] = useState<TimelineEntry | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  const entries = useMemo(
    () => [...timelineEntries].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id)),
    [],
  );

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 75%', 'end 55%'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const height = useTransform(smooth, (v) => `${Math.max(0, Math.min(1, v)) * 100}%`);

  const years = useMemo(() => {
    const set = new Set(entries.map((e) => e.year));
    return Array.from(set).sort((a, b) => a - b);
  }, [entries]);

  return (
    <section id="journey" className="relative py-20 sm:py-28" aria-labelledby="journey-heading">
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow mb-4">Journey</p>
          <h2 id="journey-heading" className="text-display-lg font-extrabold">
            From first tutorial to production software.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-parchment/[0.65]">
            A timeline of how I went from watching tutorials to shipping software that businesses
            depend on. Select any milestone for the full picture.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Years covered">
            {years.map((year) => (
              <li
                key={year}
                className="rounded-full border border-parchment/[0.1] bg-parchment/[0.03] px-3 py-1 font-mono text-[0.66rem] tracking-[0.14em] text-parchment/[0.45]"
              >
                {year}
              </li>
            ))}
          </ul>
        </div>

        <div ref={trackRef} className="relative mt-14 sm:mt-16">
          {/* Rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[21px] top-0 w-px bg-gradient-to-b from-transparent via-parchment/[0.12] to-transparent md:left-1/2 md:-translate-x-1/2"
          >
            <motion.div
              className="w-px bg-gradient-to-b from-gold-500/[0.7] via-gold-500/[0.35] to-transparent"
              style={reduceMotion ? { height: '100%' } : { height }}
            />
          </div>

          <ol className="space-y-10 sm:space-y-12 md:space-y-16">
            {entries.map((entry, index) => (
              <TimelineItem
                key={entry.id}
                entry={entry}
                index={index}
                side={index % 2 === 0 ? 'left' : 'right'}
                onOpen={setActive}
              />
            ))}
          </ol>

          {/* Rail terminus */}
          <div
            aria-hidden="true"
            className="relative mt-10 flex justify-start pl-4 md:justify-center md:pl-0"
          >
            <span className="h-2.5 w-2.5 rotate-45 border border-gold-500/[0.5] bg-gold-500/[0.2]" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <Suspense fallback={null}>
            <AchievementModal entry={active} onClose={() => setActive(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
}
