import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, Github, Linkedin, Mail } from 'lucide-react';
import profile from '../data/profile';
import { asset } from '../config';
import { KnightMark } from './Logo';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';

function scrollToId(id: string, reduceMotion: boolean) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

/** Elegant fallback shown when public/images/profile.jpg is absent. */
function PortraitPlaceholder() {
  return (
    <div className="board-pattern relative flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 via-ink-850 to-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(227,180,71,0.2),transparent_62%)]" />
      <div className="relative flex flex-col items-center gap-4 px-6 text-center">
        <span className="font-display text-6xl font-extrabold tracking-tight text-parchment/[0.9] sm:text-7xl">
          AA
        </span>
        <KnightMark className="h-10 w-10 text-parchment/[0.45]" />
        <span className="max-w-[15rem] font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.22em] text-parchment/[0.4]">
          Portrait coming soon
        </span>
      </div>
    </div>
  );
}

export default function Hero() {
  const [imageFailed, setImageFailed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const fade = (delay: number) =>
    reduceMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-44"
      aria-labelledby="hero-heading"
    >
      {/* decorative knight-move accent grid */}
      <div
        aria-hidden="true"
        className="board-pattern pointer-events-none absolute inset-0 -z-10 opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-azure-500/[0.09] blur-3xl"
      />

      <div className="shell grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <motion.p {...fade(0)} className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-gold-500/[0.6]" aria-hidden="true" />
            Self-taught since 2019
          </motion.p>

          <motion.h1
            id="hero-heading"
            {...fade(0.06)}
            className="text-display-xl font-extrabold text-parchment"
          >
            Ali Amir
          </motion.h1>

          <motion.p
            {...fade(0.12)}
            className="mt-4 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-gold-400 sm:text-sm sm:tracking-[0.26em]"
          >
            Software Developer <span className="text-parchment/[0.3]">•</span> Builder{' '}
            <span className="text-parchment/[0.3]">•</span> Chess Enthusiast
          </motion.p>

          <motion.p
            {...fade(0.18)}
            className="mt-7 max-w-xl text-base leading-relaxed text-parchment/[0.7] sm:text-lg"
          >
            {profile.heroDescription}
          </motion.p>

          <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToId('journey', reduceMotion)}
              className="btn-primary"
            >
              View My Journey
              <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToId('contact', reduceMotion)}
              className="btn-ghost"
            >
              Contact Me
            </button>
          </motion.div>

          <motion.ul {...fade(0.3)} className="mt-10 flex flex-wrap items-center gap-2.5">
            {[
              { icon: Github, label: 'GitHub', href: profile.github },
              { icon: Linkedin, label: 'LinkedIn', href: profile.linkedin },
              { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
            ].map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="inline-flex items-center gap-2 rounded-full border border-parchment/[0.12] bg-parchment/[0.03] px-4 py-2 text-xs text-parchment/[0.65] transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/[0.35] hover:text-parchment"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="max-w-[13rem] truncate">{label}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Portrait */}
        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.15 }}
          className="relative mx-auto w-full max-w-[22rem] lg:max-w-none"
        >
          <div
            aria-hidden="true"
            className={`absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-gold-500/[0.25] via-transparent to-azure-500/[0.25] blur-xl ${
              reduceMotion ? '' : 'animate-float'
            }`}
          />
          <div className="relative overflow-hidden rounded-[1.6rem] border border-parchment/[0.12] bg-ink-900 shadow-lift">
            <div className="aspect-[4/5] w-full">
              {imageFailed ? (
                <PortraitPlaceholder />
              ) : (
                <img
                  src={asset('images/profile.jpg')}
                  alt="Ali Amir"
                  width={880}
                  height={1100}
                  decoding="async"
                  className="h-full w-full object-cover"
                  onError={() => setImageFailed(true)}
                />
              )}
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/[0.7] via-transparent to-transparent"
            />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between gap-3 border-t border-parchment/[0.1] bg-ink-950/[0.55] px-4 py-3 backdrop-blur-md">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-parchment/[0.55]">
                Building since 2019
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-gold-400">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" aria-hidden="true" />
                PixelWeave
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
