import { motion } from 'framer-motion';
import profile from '../data/profile';
import { strengthIcons } from '../lib/icons';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';
import KnightMotif from './KnightMotif';

export default function About() {
  const reduceMotion = usePrefersReducedMotion();

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.15 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="about" className="relative py-20 sm:py-28" aria-labelledby="about-heading">
      <div className="shell">
        <motion.div {...reveal()} className="max-w-3xl">
          <p className="eyebrow mb-4">About</p>
          <h2 id="about-heading" className="text-display-lg font-extrabold">
            A developer who learns by shipping.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
          <motion.div {...reveal(0.05)} className="space-y-5">
            {profile.biography.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="max-w-2xl leading-relaxed text-parchment/[0.72]">
                {paragraph}
              </p>
            ))}

            <div className="hairline my-8" aria-hidden="true" />

            <div>
              <p className="eyebrow mb-5">What I build</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {profile.strengths.map((strength, index) => {
                  const Icon = strengthIcons[strength.icon] ?? strengthIcons.layers;
                  return (
                    <motion.li
                      key={strength.title}
                      {...(reduceMotion
                        ? {}
                        : {
                            initial: { opacity: 0, y: 14 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: { once: true, amount: 0.15 },
                            transition: { duration: 0.45, delay: index * 0.05 },
                          })}
                      className="group flex items-start gap-3.5 rounded-xl border border-parchment/[0.1] bg-parchment/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/[0.3] hover:bg-parchment/[0.05]"
                    >
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold-500/[0.25] bg-gold-500/[0.08] text-gold-400 transition-colors duration-300 group-hover:border-gold-500/[0.45]">
                        {Icon ? <Icon className="h-[17px] w-[17px]" aria-hidden="true" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-parchment">
                          {strength.title}
                        </span>
                        <span className="mt-1 block text-[0.82rem] leading-relaxed text-parchment/[0.55]">
                          {strength.description}
                        </span>
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </motion.div>

          <motion.aside {...reveal(0.1)} className="space-y-5">
            <KnightMotif />
            {/* <div className="rounded-2xl border border-parchment/[0.1] bg-parchment/[0.025] p-5">
              <p className="eyebrow mb-3">Chess</p>
              <p className="text-sm leading-relaxed text-parchment/[0.65]">{profile.chess.summary}</p>
              <ul className="mt-4 space-y-2">
                {profile.chess.principles.map((principle) => (
                  <li key={principle} className="flex gap-2.5 text-[0.82rem] text-parchment/[0.55]">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-gold-500/[0.8]" aria-hidden="true" />
                    {principle}
                  </li>
                ))}
              </ul>
            </div> */}
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
