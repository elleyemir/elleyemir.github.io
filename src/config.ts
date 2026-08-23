/**
 * ============================================================================
 *  CENTRAL CONFIGURATION
 * ============================================================================
 * Everything environment-driven lives here. Components consume this module and
 * never read `import.meta.env` directly.
 *
 * Frontend env vars (all public — Vite inlines any `VITE_*` variable into the
 * browser bundle, so NEVER put a private AI provider key here):
 *
 *   VITE_SITE_BASE           /  or  /your-repo/   (used by vite.config.ts)
 *   VITE_CHAT_ENDPOINT       https://your-worker.example.workers.dev/api/chat
 *   VITE_EMAILJS_PUBLIC_KEY  EmailJS public key (client-side by design)
 *   VITE_EMAILJS_SERVICE_ID  EmailJS service id
 *   VITE_EMAILJS_TEMPLATE_ID EmailJS template id
 *
 * Private keys (GEMINI_API_KEY / GROQ_API_KEY) belong ONLY to the server-side
 * proxy (see worker/), never to this bundle.
 */

const env = import.meta.env;

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Prefix a `public/` asset path so it survives a GitHub Pages subpath. */
export function asset(path: string): string {
  const base = env.BASE_URL || '/';
  return `${base.replace(/\/+$/, '')}/${String(path).replace(/^\/+/, '')}`;
}

const emailjsPublicKey = str(env.VITE_EMAILJS_PUBLIC_KEY);
const emailjsServiceId = str(env.VITE_EMAILJS_SERVICE_ID);
const emailjsTemplateId = str(env.VITE_EMAILJS_TEMPLATE_ID);

export interface EmailJsConfig {
  publicKey: string;
  serviceId: string;
  templateId: string;
  /** True only when all three values are present. */
  isConfigured: boolean;
}

const chatEndpoint = str(env.VITE_CHAT_ENDPOINT) || '/api/chat';

export interface SiteConfig {
  name: string;
  title: string;
  base: string;
  isDev: boolean;
  /** Client-side cooldown between contact submissions, in milliseconds. */
  contactCooldownMs: number;
}

export interface AppConfig {
  site: SiteConfig;
  emailjs: EmailJsConfig;
  /** Server-side AI proxy endpoint. Empty string disables the assistant. */
  chatEndpoint: string;
  isChatConfigured: boolean;
  /** Request timeout for the AI proxy, in milliseconds. */
  chatTimeoutMs: number;
}

export const config: AppConfig = {
  site: {
    name: 'Ali Amir',
    title: 'Software Developer • Builder • Chess Enthusiast',
    base: env.BASE_URL || '/',
    isDev: !!env.DEV,
    contactCooldownMs: 30_000,
  },
  emailjs: {
    publicKey: emailjsPublicKey,
    serviceId: emailjsServiceId,
    templateId: emailjsTemplateId,
    isConfigured: !!(emailjsPublicKey && emailjsServiceId && emailjsTemplateId),
  },
  chatEndpoint: chatEndpoint,
  isChatConfigured: chatEndpoint.length > 0,
  chatTimeoutMs: 25_000,
};

export default config;
