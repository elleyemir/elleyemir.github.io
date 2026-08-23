import { useRef, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Send,
} from 'lucide-react';
import profile from '../data/profile';
import config from '../config';
import { buildMailtoUrl, sendContactEmail, type ContactPayload } from '../lib/emailjs';
import { usePrefersReducedMotion } from '../hooks/useReducedMotion';

type FieldName = 'name' | 'email' | 'subject' | 'message';
type Errors = Partial<Record<FieldName, string>>;
type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY: ContactPayload = { name: '', email: '', subject: '', message: '' };

function validate(values: ContactPayload): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  if (!values.message.trim()) errors.message = 'Please write a message.';
  else if (values.message.trim().length < 10) errors.message = 'Please write at least 10 characters.';
  return errors;
}

const FIELD_CLASS =
  'w-full rounded-xl border bg-parchment/[0.035] px-4 py-3 text-sm text-parchment placeholder:text-parchment/[0.32] transition-colors focus:outline-none';

export default function Contact() {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const lastSentRef = useRef(0);
  const reduceMotion = usePrefersReducedMotion();

  const sending = status.kind === 'sending';

  const setField = (field: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return; // prevents duplicate submissions

    const trimmed: ContactPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    };

    const nextErrors = validate(trimmed);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus({ kind: 'error', message: 'Please fix the highlighted fields and try again.' });
      const firstField = (Object.keys(nextErrors) as FieldName[])[0];
      document.getElementById(`contact-${firstField}`)?.focus();
      return;
    }

    const elapsed = Date.now() - lastSentRef.current;
    if (lastSentRef.current && elapsed < config.site.contactCooldownMs) {
      setStatus({
        kind: 'error',
        message: `Please wait ${Math.ceil((config.site.contactCooldownMs - elapsed) / 1000)}s before sending another message.`,
      });
      return;
    }

    if (!config.emailjs.isConfigured) {
      window.location.href = buildMailtoUrl(trimmed, profile.email);
      setStatus({
        kind: 'success',
        message: 'Opening your email app with the message prefilled.',
      });
      window.setTimeout(() => setStatus({ kind: 'idle' }), 6000);
      return;
    }

    setStatus({ kind: 'sending' });
    const result = await sendContactEmail(trimmed);
    if (result.ok) {
      lastSentRef.current = Date.now();
      setValues(EMPTY);
      setStatus({ kind: 'success', message: 'Thanks — your message is on its way to Ali.' });
      window.setTimeout(() => setStatus({ kind: 'idle' }), 8000);
    } else {
      setStatus({ kind: 'error', message: result.error });
    }
  }

  const channels = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Github, label: 'GitHub', value: 'github.com/ali-amir-code', href: profile.github },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'linkedin.com/in/ali-amir-code',
      href: profile.linkedin,
    },
  ];

  return (
    <section id="contact" className="relative py-20 sm:py-28" aria-labelledby="contact-heading">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Contact</p>
          <h2 id="contact-heading" className="text-display-lg font-extrabold">
            Let&rsquo;s build something.
          </h2>
          <p className="mt-5 leading-relaxed text-parchment/[0.65]">
            Have a project, a role, or a question? Send a message and I&rsquo;ll get back to you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
          <motion.ul
            {...(reduceMotion
              ? {}
              : {
                  initial: { opacity: 0, y: 18 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.15 },
                  transition: { duration: 0.5 },
                })}
            className="space-y-3"
          >
            {channels.map(({ icon: Icon, label, value, href }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="group flex items-center gap-3.5 rounded-xl border border-parchment/[0.1] bg-parchment/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/[0.3] hover:bg-parchment/[0.05]"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-gold-500/[0.25] bg-gold-500/[0.08] text-gold-400">
                    <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment/[0.4]">
                      {label}
                    </span>
                    <span className="mt-1 block truncate text-sm text-parchment/[0.85] group-hover:text-gold-400">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </motion.ul>

          <form onSubmit={onSubmit} noValidate className="glass rounded-2xl p-5 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  { field: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                  { field: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                ] as const
              ).map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label
                    htmlFor={`contact-${field}`}
                    className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment/[0.5]"
                  >
                    {label} <span className="text-gold-500">*</span>
                  </label>
                  <input
                    id={`contact-${field}`}
                    name={field}
                    type={type}
                    value={values[field]}
                    onChange={(event) => setField(field, event.target.value)}
                    placeholder={placeholder}
                    aria-required="true"
                    aria-invalid={errors[field] ? 'true' : undefined}
                    aria-describedby={errors[field] ? `contact-${field}-error` : undefined}
                    className={`${FIELD_CLASS} ${
                      errors[field]
                        ? 'border-red-400/[0.5] focus:border-red-400/[0.7]'
                        : 'border-parchment/[0.12] focus:border-gold-500/[0.45]'
                    }`}
                  />
                  {errors[field] && (
                    <p
                      id={`contact-${field}-error`}
                      className="mt-1.5 text-[0.72rem] text-red-300"
                    >
                      {errors[field]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label
                htmlFor="contact-subject"
                className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment/[0.5]"
              >
                Subject <span className="text-gold-500">*</span>
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={values.subject}
                onChange={(event) => setField('subject', event.target.value)}
                placeholder="What is this about?"
                aria-required="true"
                aria-invalid={errors.subject ? 'true' : undefined}
                aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                className={`${FIELD_CLASS} ${
                  errors.subject
                    ? 'border-red-400/[0.5] focus:border-red-400/[0.7]'
                    : 'border-parchment/[0.12] focus:border-gold-500/[0.45]'
                }`}
              />
              {errors.subject && (
                <p id="contact-subject-error" className="mt-1.5 text-[0.72rem] text-red-300">
                  {errors.subject}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="contact-message"
                className="mb-1.5 block font-mono text-[0.62rem] uppercase tracking-[0.18em] text-parchment/[0.5]"
              >
                Message <span className="text-gold-500">*</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                value={values.message}
                onChange={(event) => setField('message', event.target.value)}
                placeholder="Tell me a little about what you need…"
                aria-required="true"
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                className={`${FIELD_CLASS} resize-y ${
                  errors.message
                    ? 'border-red-400/[0.5] focus:border-red-400/[0.7]'
                    : 'border-parchment/[0.12] focus:border-gold-500/[0.45]'
                }`}
              />
              {errors.message && (
                <p id="contact-message-error" className="mt-1.5 text-[0.72rem] text-red-300">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button type="submit" className="btn-primary" disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    {config.emailjs.isConfigured ? 'Send Message' : 'Open Email App'}
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>

              {!config.emailjs.isConfigured && (
                <p className="text-[0.72rem] leading-relaxed text-parchment/[0.45]">
                  Direct sending needs EmailJS configuration — this opens your email client instead.
                </p>
              )}
            </div>

            {/* Accessible status region */}
            <div role="status" aria-live="polite" className="mt-4 empty:mt-0">
              {status.kind === 'success' && (
                <p className="flex items-start gap-2 rounded-xl border border-emerald-400/[0.25] bg-emerald-400/[0.08] px-4 py-3 text-sm text-emerald-200">
                  <CheckCircle2 className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
                  {status.message}
                </p>
              )}
              {status.kind === 'error' && (
                <p className="flex items-start gap-2 rounded-xl border border-red-400/[0.25] bg-red-400/[0.08] px-4 py-3 text-sm text-red-200">
                  <AlertTriangle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
                  {status.message}
                </p>
              )}
            </div>

            {config.site.isDev && !config.emailjs.isConfigured && (
              <p className="mt-4 rounded-xl border border-gold-500/[0.25] bg-gold-500/[0.07] px-4 py-3 text-[0.72rem] leading-relaxed text-gold-400">
                Development notice: set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID and
                VITE_EMAILJS_TEMPLATE_ID in <code className="font-mono">.env</code> to enable direct
                form submission. The EmailJS public key is meant for the browser — it is not a secret,
                unlike the AI provider keys, which stay on the server.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
