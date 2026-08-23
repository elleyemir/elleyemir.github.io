/**
 * EmailJS integration.
 *
 * The EmailJS public key is designed for client-side use — it is NOT a secret,
 * and it is not comparable to the Gemini/Groq keys, which must stay server-side.
 * EmailJS is initialised at most once per page load (see `ensureEmailJsInit`).
 */

import emailjs from '@emailjs/browser';
import config from '../config';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/** Documented EmailJS template variables. */
export interface EmailJsTemplateParams extends Record<string, unknown> {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
  to_name: string;
  reply_to: string;
}

let initialised = false;

/** Initialise the EmailJS SDK exactly once. Returns false if not configured. */
export function ensureEmailJsInit(): boolean {
  if (!config.emailjs.isConfigured) return false;
  if (initialised) return true;
  emailjs.init({ publicKey: config.emailjs.publicKey });
  initialised = true;
  return true;
}

export function buildTemplateParams(payload: ContactPayload): EmailJsTemplateParams {
  return {
    from_name: payload.name,
    from_email: payload.email,
    subject: payload.subject,
    message: payload.message,
    to_name: 'Ali Amir',
    reply_to: payload.email,
  };
}

export type SendResult =
  | { ok: true }
  | { ok: false; reason: 'not-configured' | 'failed'; error: string };

export async function sendContactEmail(payload: ContactPayload): Promise<SendResult> {
  if (!ensureEmailJsInit()) {
    return {
      ok: false,
      reason: 'not-configured',
      error:
        'EmailJS is not configured. Set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID and VITE_EMAILJS_TEMPLATE_ID.',
    };
  }

  try {
    await emailjs.send(
      config.emailjs.serviceId,
      config.emailjs.templateId,
      buildTemplateParams(payload),
    );
    return { ok: true };
  } catch (error) {
    const text =
      typeof error === 'object' && error !== null && 'text' in error
        ? String((error as { text?: unknown }).text)
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    return {
      ok: false,
      reason: 'failed',
      error: `Message could not be sent (${text}). Please email directly instead.`,
    };
  }
}

/** Graceful fallback: a prefilled mailto: URL for when EmailJS is unconfigured. */
export function buildMailtoUrl(payload: ContactPayload, to: string): string {
  const subject = payload.subject || `Portfolio enquiry from ${payload.name || 'a visitor'}`;
  const body = [
    payload.message,
    '',
    '—',
    payload.name ? `From: ${payload.name}` : '',
    payload.email ? `Email: ${payload.email}` : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
