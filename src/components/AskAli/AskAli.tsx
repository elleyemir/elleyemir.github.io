import { Suspense, lazy, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';

// Code-split: the chat UI (and its client) load on first open.
const ChatWindow = lazy(() => import('./ChatWindow'));

export default function AskAli() {
  const [open, setOpen] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <Suspense fallback={null}>
            <ChatWindow onClose={() => setOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close the Ask About Ali assistant' : 'Open the Ask About Ali assistant'}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        className="group flex items-center gap-2.5 rounded-full border border-gold-500/[0.3] bg-ink-900/[0.9] px-4 py-3 text-sm font-medium text-parchment shadow-glow backdrop-blur-xl transition-colors hover:border-gold-500/[0.55]"
      >
        <span className="relative grid h-6 w-6 place-items-center text-gold-400">
          {open ? (
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
          {!open && !reduceMotion && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold-500 animate-pulse-node"
            />
          )}
        </span>
        <span className="hidden sm:inline">{open ? 'Close' : 'Ask About Ali'}</span>
      </motion.button>
    </div>
  );
}
