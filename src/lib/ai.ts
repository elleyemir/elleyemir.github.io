/**
 * Frontend chat client.
 *
 * The browser NEVER talks to Gemini/Groq directly and no provider SDK is
 * bundled here. It POSTs to `config.chatEndpoint` (a Cloudflare Worker or any
 * serverless function) which holds the private API key and returns
 * `{ success: true, answer: "..." }`.
 */

import config from '../config';
import { buildAiContext, type AiContext } from '../data/profile';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  messages: ChatMessage[];
  context: AiContext;
}

export interface ChatSuccess {
  ok: true;
  answer: string;
}

export interface ChatFailure {
  ok: false;
  /** Human-readable, safe to render in the UI. */
  error: string;
  reason: 'aborted' | 'timeout' | 'network' | 'rate-limit' | 'server' | 'bad-response' | 'not-configured';
}

export type ChatResult = ChatSuccess | ChatFailure;

export const MAX_MESSAGE_LENGTH = 800;
export const MAX_HISTORY = 12;

const FALLBACKS: Record<ChatFailure['reason'], string> = {
  aborted: 'Request cancelled.',
  timeout: 'That took too long to answer. Please try again.',
  network: 'I could not reach the assistant service. Please check your connection and try again.',
  'rate-limit': 'Too many questions in a short time. Please wait a moment and try again.',
  server: 'The assistant is unavailable right now. Please try again shortly.',
  'bad-response': 'I received an unexpected response from the assistant service.',
  'not-configured':
    'The assistant is not configured yet. Set VITE_CHAT_ENDPOINT to your deployed AI proxy.',
};

function fail(reason: ChatFailure['reason'], error?: string): ChatFailure {
  return { ok: false, reason, error: error || FALLBACKS[reason] };
}

/** Trim history and enforce message length limits before sending. */
export function prepareMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_LENGTH) }));
}

export interface AskAliOptions {
  /** Caller-supplied signal (e.g. to cancel when the widget closes). */
  signal?: AbortSignal;
  /** Override the request timeout. */
  timeoutMs?: number;
  /** Override the context (defaults to the site's derived context object). */
  context?: AiContext;
}

/**
 * Ask the assistant a question. Never throws — always resolves to a ChatResult.
 */
export async function askAli(
  messages: ChatMessage[],
  options: AskAliOptions = {},
): Promise<ChatResult> {
  if (!config.isChatConfigured) return fail('not-configured');

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? config.chatTimeoutMs;
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  const externalAbort = () => controller.abort('external');
  options.signal?.addEventListener('abort', externalAbort, { once: true });

  const body: ChatRequestBody = {
    messages: prepareMessages(messages),
    context: options.context ?? buildAiContext(),
  };

  try {
    const response = await fetch(config.chatEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (response.status === 429) return fail('rate-limit');
    if (!response.ok) {
      let message = '';
      try {
        const data: unknown = await response.json();
        if (data && typeof data === 'object' && 'error' in data) {
          const value = (data as { error?: unknown }).error;
          if (typeof value === 'string') message = value;
        }
      } catch {
        /* ignore non-JSON error bodies */
      }
      return fail('server', message || FALLBACKS.server);
    }

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      return fail('bad-response');
    }

    if (!data || typeof data !== 'object') return fail('bad-response');
    const payload = data as { success?: boolean; answer?: unknown; error?: unknown };
    if (payload.success === false) {
      return fail('server', typeof payload.error === 'string' ? payload.error : undefined);
    }
    if (typeof payload.answer !== 'string' || payload.answer.trim().length === 0) {
      return fail('bad-response');
    }
    return { ok: true, answer: payload.answer.trim() };
  } catch (error) {
    if (options.signal?.aborted) return fail('aborted');
    if (error instanceof DOMException && error.name === 'AbortError') {
      return fail(timedOut ? 'timeout' : 'aborted');
    }
    return fail('network');
  } finally {
    window.clearTimeout(timer);
    options.signal?.removeEventListener('abort', externalAbort);
  }
}
