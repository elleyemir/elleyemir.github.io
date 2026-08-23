# Portfolio chat Worker

This directory contains the server-side proxy for the **Ask About Ali** chat widget. It keeps Gemini and Groq API keys outside the static GitHub Pages site.

## Endpoints

| Method | Path | Behavior |
| --- | --- | --- |
| `POST` | `/api/chat` | Validates a portfolio chat request and returns `{ "success": true, "answer": "..." }`. |
| `OPTIONS` | `/api/chat` | Returns CORS preflight headers for an allowed origin. |
| `GET` | `/health` | Returns `{ "success": true }`. |

All other paths return a normalized JSON `404`. Error responses use `{ "success": false, "error": "..." }`; keys and provider response bodies are never returned or logged.

## Local development

```bash
cd worker
npm install
cp .dev.vars.example .dev.vars
# Edit .dev.vars and replace the placeholder for the provider you selected.
npm run dev
```

Run the Vite site separately from the repository root with `npm run dev`. The example local CORS origin is `http://localhost:5173`.

## Configure and deploy

1. Edit the non-secret values in `wrangler.toml`:
   - Set `AI_PROVIDER` to `gemini` or `groq`.
   - Set `ALLOWED_ORIGIN` to the exact deployed site origin, for example `https://elleyemir.github.io`. Multiple exact origins may be comma-separated for local testing and production.
2. Authenticate and set only the secret for the active provider:

```bash
cd worker
npx wrangler login
npx wrangler secret put GEMINI_API_KEY
# Or, when AI_PROVIDER = "groq":
npx wrangler secret put GROQ_API_KEY
npx wrangler deploy
```

3. Copy the deployed Worker URL and set the frontend's `VITE_CHAT_ENDPOINT` to `https://your-worker.example.workers.dev/api/chat`.

Do not commit `.dev.vars`, API keys, or a modified `wrangler.toml` containing secrets. `wrangler.toml` is intentionally limited to non-secret `vars`; provider keys must be added with `wrangler secret put`.

## CORS

`ALLOWED_ORIGIN` accepts one or more comma-separated exact origins, with no path or trailing slash:

```toml
ALLOWED_ORIGIN = "https://elleyemir.github.io,http://localhost:5173"
```

The Worker verifies the browser `Origin`, echoes only a matching origin in `Access-Control-Allow-Origin`, and sends `Vary: Origin`. `ALLOWED_ORIGIN = "*"` is supported only for brief local development and must never be used in production.

## Validation, limits, and providers

- Only JSON `{ messages, context? }` requests are accepted. A message may be `user` or `assistant`, must have non-empty string content, and is limited to 1,000 characters. Requests allow at most 20 messages and have a 32 KB body limit.
- The structured `context` object is bounded and used as the model's only portfolio knowledge source. The protected system prompt rejects prompt-injection attempts, unrelated questions, made-up facts, and claims about private or closed-source information.
- `AI_PROVIDER=gemini` uses Gemini `generateContent`; `AI_PROVIDER=groq` uses Groq's OpenAI-compatible chat completion endpoint. Both have a 20-second timeout and safe 429/5xx error mapping.
- The default rate limit is 20 requests per IP per minute in Worker-isolate memory. It is deliberately best-effort because isolates are not shared.

### Optional KV-backed rate limiting

For a best-effort limit that is shared across Worker isolates, create a KV namespace and add its generated ID to `wrangler.toml`:

```bash
cd worker
npx wrangler kv namespace create RATE_LIMIT_KV
```

```toml
[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "paste-the-namespace-id-here"
```

The binding is optional. KV operations are eventually consistent and are not a strict distributed rate-limit lock, but the Worker falls back to in-memory limiting if KV is temporarily unavailable.
