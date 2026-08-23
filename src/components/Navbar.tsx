import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Linkedin, Menu, X } from 'lucide-react';
import Logo from './Logo';
import profile from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const ids = useMemo(() => SECTIONS.map((s) => s.id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = useCallback(
    (id: string) => {
      setMenuOpen(false);
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      // Move focus for keyboard users without stealing scroll position.
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    },
    [reduceMotion],
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        menuOpen
          ? 'border-b border-parchment/[0.1] bg-ink-950/[0.97] py-2 backdrop-blur-xl'
          : scrolled
            ? 'border-b border-parchment/[0.1] bg-ink-950/[0.8] py-2 backdrop-blur-xl'
            : 'border-b border-transparent py-4'
      }`}
    >
      <nav className="shell flex items-center justify-between gap-4" aria-label="Main">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goTo('home');
          }}
          className="rounded-md"
          aria-label="Ali Amir — home"
        >
          <Logo />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {SECTIONS.map((section) => {
            const isActive = active === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(section.id);
                }}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                  isActive ? 'text-parchment' : 'text-parchment/[0.55] hover:text-parchment/[0.9]'
                }`}
              >
                {section.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={
                      reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }
                    }
                    className="absolute inset-0 -z-10 rounded-full border border-gold-500/[0.3] bg-gold-500/[0.09]"
                  />
                )}
              </a>
            );
          })}

          <span className="mx-2 h-5 w-px bg-parchment/[0.12]" aria-hidden="true" />

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub profile"
            className="rounded-full p-2.5 text-parchment/[0.6] transition-colors hover:bg-parchment/[0.06] hover:text-gold-400"
          >
            <Github className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="LinkedIn profile"
            className="rounded-full p-2.5 text-parchment/[0.6] transition-colors hover:bg-parchment/[0.06] hover:text-azure-300"
          >
            <Linkedin className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="glass rounded-full p-2.5 text-parchment md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className="md:hidden"
          >
            <div className="shell pb-4 pt-3">
              <ul className="overflow-hidden rounded-2xl border border-parchment/[0.12] bg-ink-900/[0.98] p-2 shadow-lift backdrop-blur-xl">
                {SECTIONS.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goTo(section.id);
                      }}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
                        active === section.id
                          ? 'bg-gold-500/[0.1] text-parchment'
                          : 'text-parchment/[0.7]'
                      }`}
                    >
                      {section.label}
                      <span className="font-mono text-[0.6rem] text-parchment/[0.35]">
                        0{SECTIONS.indexOf(section) + 1}
                      </span>
                    </a>
                  </li>
                ))}
                <li className="mt-1 flex gap-2 border-t border-parchment/[0.1] px-2 pt-3">
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-parchment/[0.12] py-2.5 text-xs text-parchment/[0.75]"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" /> GitHub
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-parchment/[0.12] py-2.5 text-xs text-parchment/[0.75]"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
