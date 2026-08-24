import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Send, X } from 'lucide-react';
import { askAli, MAX_MESSAGE_LENGTH, type ChatMessage } from '../../lib/ai';
import config from '../../config';
import { KnightMark } from '../Logo';
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion';
import Message, { TypingIndicator, type ChatBubble } from './Message';

const SUGGESTIONS = [
  'What did Ali build in 2026?',
  'Tell me about PixelWeave.',
  "What is Ali's strongest real-world project?",
  "What's Ali's relationship with chess?",
  'How did Ali start programming?',
];

const GREETING: ChatBubble = {
  id: 'greeting',
  role: 'assistant',
  content:
    "Hi — I'm Ali's portfolio assistant. Ask me about his projects, journey, skills or chess interest.",
};

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export default function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatBubble[]>([GREETING]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    inputRef.current?.focus();
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, pending, reduceMotion]);

  async function send(question: string) {
    const text = question.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!text || pending) return;

    const userBubble: ChatBubble = { id: nextId(), role: 'user', content: text };
    const history: ChatMessage[] = [...messages, userBubble]
      .filter((m) => m.id !== 'greeting' && !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userBubble]);
    setInput('');
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const result = await askAli(history, { signal: controller.signal });
    abortRef.current = null;

    if (result.ok) {
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: result.answer }]);
    } else if (result.reason !== 'aborted') {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: 'assistant', content: result.error, isError: true },
      ]);
    }
    setPending(false);
  }

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
      role="dialog"
      aria-label="Ask About Ali assistant"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      className="flex h-[min(78vh,560px)] w-[min(92vw,384px)] flex-col overflow-hidden rounded-2xl border border-parchment/[0.12] bg-ink-900/[0.98] shadow-lift backdrop-blur-xl"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-parchment/[0.1] bg-gradient-to-r from-gold-500/[0.09] to-transparent px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-gold-500/[0.3] bg-gold-500/[0.1] text-gold-400">
            <KnightMark className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold text-parchment">Ask About Ali</p>
            <p className="truncate text-[0.66rem] text-parchment/[0.45]">
              Answers only about Ali &amp; this portfolio
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="rounded-full border border-parchment/[0.12] p-2 text-parchment/[0.65] transition-colors hover:border-gold-500/[0.4] hover:text-gold-400"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div
        ref={transcriptRef}
        className="thin-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {pending && <TypingIndicator />}
      </div>

      {messages.length <= 2 && (
        <div className="shrink-0 px-4 pb-2">
          <ul className="flex flex-wrap gap-1.5">
            {SUGGESTIONS.slice(0, 3).map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => void send(suggestion)}
                  className="rounded-full border border-parchment/[0.12] bg-parchment/[0.03] px-3 py-1.5 text-[0.7rem] text-parchment/[0.65] transition-colors hover:border-gold-500/[0.35] hover:text-parchment disabled:opacity-50"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {config.site.isDev && !config.isChatConfigured && (
        <p className="mx-4 mb-2 flex items-start gap-2 rounded-lg border border-gold-500/[0.25] bg-gold-500/[0.07] px-3 py-2 text-[0.7rem] leading-relaxed text-gold-400">
          <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Development notice: set VITE_CHAT_ENDPOINT to your AI proxy URL to enable answers.
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(input);
        }}
        className="shrink-0 border-t border-parchment/[0.1] bg-ink-950/[0.4] p-3"
      >
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="ask-ali-input">
            Ask a question about Ali
          </label>
          <input
            id="ask-ali-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Ask about Ali…"
            autoComplete="off"
            className="min-w-0 flex-1 rounded-xl border border-parchment/[0.12] bg-parchment/[0.04] px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment/[0.35] focus:border-gold-500/[0.4] focus:outline-none focus-visible:outline-none"
          />
          <button
            type="submit"
            disabled={pending || input.trim().length === 0}
            aria-label="Send question"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-sheen text-ink-950 transition-transform duration-300 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-45"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
