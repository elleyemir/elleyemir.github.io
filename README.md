# Ali Amir Portfolio

A static React + Vite portfolio for Ali Amir, with a data-driven journey timeline, EmailJS contact form, and a separately deployed Cloudflare Worker for the scope-restricted **Ask About Ali** assistant.

## Project structure

```text
src/
  components/
    Navbar.tsx
    Hero.tsx
    About.tsx
    Timeline/
      Timeline.tsx
      TimelineItem.tsx
      AchievementModal.tsx
      MediaGallery.tsx
    Contact.tsx
    AskAli/
      AskAli.tsx
      ChatWindow.tsx
      Message.tsx
  config.ts
  data/
    profile.ts
    timeline.json
  lib/
    ai.ts
    emailjs.ts
  types/
    timeline.ts
  App.tsx
  main.tsx
public/
  images/
    profile.jpg
    timeline/
worker/
  src/index.ts
  wrangler.toml
  .dev.vars.example
  README.md
.github/workflows/deploy.yml
.env.example
```

## Requirements

- Node.js 20 or newer
- npm
- A GitHub repository with GitHub Pages enabled for deployment
- Optional: EmailJS for direct contact-form delivery
- Optional: a Gemini or Groq account plus Cloudflare account for the chat Worker

## Install and run locally

```bash
git clone https://github.com/your-github-username/your-repository-name.git
cd your-repository-name
npm install
cp .env.example .env
npm run dev
```

Open the local URL that Vite prints. The site remains usable without EmailJS or a deployed chat Worker; the contact form should use its graceful mail-client fallback when EmailJS is not configured.

## Frontend configuration

Copy `.env.example` to `.env` for local work:

```bash
cp .env.example .env
```

```dotenv
VITE_SITE_BASE=/
VITE_CHAT_ENDPOINT=https://your-worker.example.workers.dev/api/chat
VITE_EMAILJS_PUBLIC_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
```

`VITE_SITE_BASE` controls Vite's public base path. `VITE_CHAT_ENDPOINT` is the full deployed Worker endpoint, including `/api/chat`.

**Every Vite environment variable beginning with `VITE_` is included in the browser bundle.** Treat those values as public configuration; never place Gemini keys, Groq keys, database passwords, or any private secret in `.env` values prefixed with `VITE_`.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` typechecks the frontend and writes the static deployable files to `dist/`. Before using the GitHub Actions workflow, commit the root `package-lock.json` created by `npm install`, because the workflow intentionally uses `npm ci`.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` deploys `./dist` whenever `main` is pushed.

1. Push this repository to GitHub.
2. In **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
3. In **Settings → Secrets and variables → Actions → Variables**, add the following repository variables:

   | Variable | Value |
   | --- | --- |
   | `VITE_SITE_BASE` | See the base-path examples below. |
   | `VITE_CHAT_ENDPOINT` | The deployed Worker URL ending in `/api/chat`, if chat is enabled. |
   | `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key, if direct form submission is enabled. |
   | `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID. |
   | `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID. |

4. For this portfolio, the repository should be named `elleyemir.github.io` under the `elleyemir` account so GitHub Pages serves the site at `https://elleyemir.github.io`.
5. Commit and push to `main`:

```bash
git add .
git commit -m "Configure portfolio deployment"
git push origin main
```

The EmailJS and chat endpoint values are build-time public configuration. Repository variables are the clearest choice; using GitHub Secrets for a `VITE_` value does **not** make it private once Vite builds the site.

### Choose the correct base path

- **Project Pages** such as `https://your-github-username.github.io/your-repository-name/`: set `VITE_SITE_BASE=/your-repository-name/`.
- **User or organization root Pages** such as `https://your-github-username.github.io/`: set `VITE_SITE_BASE=/`.
- **Custom domain**: add a `public/CNAME` file containing only the domain name, configure the DNS record in GitHub Pages, and set `VITE_SITE_BASE=/`.

The app uses Vite's base URL for public assets. Do not replace it with hard-coded absolute `/images/...` paths, which would break on Project Pages subpaths. This is a single-page application; if direct client-side routes are added later, include a `404.html` fallback strategy for GitHub Pages because Pages does not rewrite unknown routes to `index.html` automatically.

## Update portfolio content

### Change profile information and social links

Edit `src/data/profile.ts`. Keep claims limited to information Ali has supplied. The React components consume this central profile data rather than requiring content changes throughout the UI.

To change the hero photograph, replace `public/images/profile.jpg` with the intended image. Keep the filename, or update the profile configuration and asset reference using Vite's base URL handling.

### Add, remove, or reorder journey achievements

Edit `src/data/timeline.json`; the timeline is rendered from this data only. Each entry has a minimal core of `id`, `year`, `title`, `category`, and `shortDescription`. Remove an object to remove an achievement, add an object to add one, or reorder the objects to change chronology.

Use this **commented JSONC example** as a complete reference for all supported optional fields. Remove the `//` comments before putting an entry in the valid JSON file. Do not add languages, technologies, users, results, company details, or other claims unless Ali has verified them.

```jsonc
{
  // Required core fields
  "id": "future-project",
  "year": 2026,
  "title": "Project or achievement title",
  "category": "Project",
  "shortDescription": "Brief timeline-card description.",

  // Optional detail and display fields
  "date": "2026-05",
  "description": "Longer modal description.",
  "icon": "code",
  "featured": true,

  // Optional external links
  "links": [
    { "label": "View Project", "url": "https://example.com" },
    { "label": "Source Code", "url": "https://github.com/example/repository" }
  ],

  // Optional images or other supported media
  "media": [
    {
      "type": "image",
      "src": "images/timeline/future-project.jpg",
      "alt": "A concise, accurate description of the image",
      "caption": "Optional image caption"
    }
  ],

  // Optional content appropriate for a project, award, certificate, or milestone
  "content": {
    "type": "project",
    "technologies": ["Only add technologies Ali has verified"],
    "highlights": ["Only add verified project or achievement details"]
  }
}
```

### Add timeline images

1. Put the image in `public/images/timeline/`, for example `public/images/timeline/future-project.jpg`.
2. Add its `media` object to the relevant `timeline.json` entry, using the relative `src` shown above.
3. Provide meaningful `alt` text and an optional caption.
4. Run `npm run build` and check the site at the deployed base path. The renderer should lazy-load media and continue working if an optional image is unavailable.

## Updating the site

After editing profile data, timeline data, images, or configuration, verify the production build before publishing:

```bash
npm run build
git add src/data public/images .env.example README.md
git commit -m "Update portfolio content"
git push origin main
```

The Pages workflow deploys the pushed `main` branch. Do not add `.env` or `worker/.dev.vars` to Git; use the repository variables and Cloudflare secrets described below instead.

## Configure the AI chat Worker

GitHub Pages is static hosting; it cannot safely store a Gemini or Groq API key. The browser must call the server-side Cloudflare Worker instead. The Worker validates the request, enforces CORS and rate limits, creates the protected portfolio-only system prompt, contacts the selected provider, and returns normalized JSON.

### Deploy the Worker

```bash
cd worker
npm install
npx tsc --noEmit
cp .dev.vars.example .dev.vars
# Edit worker/.dev.vars for local development only.
npx wrangler login
```

Set `AI_PROVIDER` and `ALLOWED_ORIGIN` in `worker/wrangler.toml`. `ALLOWED_ORIGIN` must be the exact site origin, not a URL path:

```toml
[vars]
AI_PROVIDER = "gemini"
ALLOWED_ORIGIN = "https://elleyemir.github.io,http://localhost:5173"
```

Then set a secret for **only the selected provider** and deploy:

```bash
cd worker
# With AI_PROVIDER = "gemini"
npx wrangler secret put GEMINI_API_KEY

# With AI_PROVIDER = "groq", use this instead
npx wrangler secret put GROQ_API_KEY

npx wrangler deploy
```

Copy the deployed URL into the root `.env` (local) and GitHub repository variable (production):

```dotenv
VITE_CHAT_ENDPOINT=https://your-worker.example.workers.dev/api/chat
```

See [`worker/README.md`](worker/README.md) for endpoint behavior, request limits, health checks, and optional KV-backed rate limiting.

### Configure Gemini

1. In `worker/wrangler.toml`, set `AI_PROVIDER = "gemini"`.
2. Obtain a Gemini API key from the provider's console.
3. Store it only in Cloudflare:

```bash
cd worker
npx wrangler secret put GEMINI_API_KEY
```

4. Deploy with `npx wrangler deploy`.

### Configure Groq

1. In `worker/wrangler.toml`, set `AI_PROVIDER = "groq"`.
2. Obtain a Groq API key from the provider's console.
3. Store it only in Cloudflare:

```bash
cd worker
npx wrangler secret put GROQ_API_KEY
```

4. Deploy with `npx wrangler deploy`.

### Configure allowed CORS origins

The Worker accepts comma-separated origins and echoes only a matching request `Origin` header. Do not include a trailing slash or a path:

```toml
ALLOWED_ORIGIN = "https://elleyemir.github.io,http://localhost:5173"
```

A wildcard (`*`) is available only for short-lived local development and is unsafe for production. In production, list each exact trusted origin. A CORS change requires `npx wrangler deploy`.

## Configure EmailJS

EmailJS enables the static contact form to submit mail without adding a backend. Its client key is intentionally public configuration for browser use; it is **not** a server-side secret. EmailJS's own service controls, template configuration, and abuse limits still matter.

### Create the EmailJS service and template

1. Create an EmailJS account and sign in.
2. Add an email service in EmailJS and copy its **Service ID**.
3. Create an email template and copy its **Template ID**.
4. Add the following template variables to the EmailJS template. For example, use `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`, `{{to_name}}`, and `{{reply_to}}` in the subject/body/reply-to configuration as appropriate.
5. The form sends this exact payload:

```ts
{
  from_name: form.name,
  from_email: form.email,
  subject: form.subject,
  message: form.message,
  to_name: "Ali Amir",
  reply_to: form.email,
}
```

6. In EmailJS account settings, copy the **Public Key**. Do not describe or treat it as a private secret; it is made for client-side use.

### Add EmailJS variables

For local development, set all three values in `.env`:

```dotenv
VITE_EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
VITE_EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_EMAILJS_TEMPLATE_ID
```

Restart `npm run dev` after changing a Vite environment file. For GitHub Pages, set the same `VITE_EMAILJS_*` names as repository variables listed in the deployment section and push to `main` to rebuild.

### Test the contact form

```bash
npm run dev
```

Enter a valid name, email, subject, and message. Confirm EmailJS receives all six template variables and that the email reply-to value is the visitor's email. Check loading, success, and error states, and verify the form resets after a successful submission. If the three values are not all configured, test that the form instead opens a prefilled `mailto:` link without crashing.

## Security model and limitations

- **GitHub Pages cannot hold secrets.** It serves static files only. Any key included in JavaScript, `localStorage`, JSON, `public/`, committed `.env` files, or a `VITE_*` build variable is public to visitors.
- **EmailJS public key:** expected in browser code and used with the EmailJS service/template identifiers. It is public client configuration, not a private credential.
- **Gemini/Groq keys:** private provider secrets. Store them only with `wrangler secret put` in Cloudflare and never in the React project, GitHub Pages variables prefixed with `VITE_`, or public files.
- The Worker accepts only constrained chat payloads, applies a best-effort per-IP rate limit, restricts browser origins, and tells the provider to use the supplied structured profile/timeline context as its only knowledge source. It does not expose keys, upstream error bodies, or private/closed-source details.
- Static-site controls and client-side cooldowns reduce accidental misuse but cannot replace server-side rate limiting or provider account controls.

## Troubleshooting

### Missing environment variables

- Copy `.env.example` to `.env`; Vite does not automatically use `.env.example`.
- Restart `npm run dev` after changing `.env`.
- For Pages, add the repository variables and trigger a fresh deployment. A blank `VITE_CHAT_ENDPOINT` disables direct chat calls; incomplete EmailJS configuration should fall back to `mailto:`.
- Never try to fix a missing chat key by adding `VITE_GEMINI_API_KEY` or `VITE_GROQ_API_KEY`.

### Images or assets return 404 on a GitHub Pages subpath

- Set `VITE_SITE_BASE=/repository-name/` for Project Pages and rebuild.
- Put public files under `public/` and reference them through Vite's base URL handling rather than hard-coding a root-relative `/images/...` URL.
- Verify the exact filename and case; Pages hosting is case-sensitive.

### The browser reports a CORS error for chat

- Ensure `VITE_CHAT_ENDPOINT` ends with `/api/chat` and points to the deployed Worker, not the Pages domain.
- Set `ALLOWED_ORIGIN` to the exact Pages origin (for example `https://your-github-username.github.io`), without a path or trailing slash. Add `http://localhost:5173` for local development if needed.
- Redeploy the Worker after editing `worker/wrangler.toml`:

```bash
cd worker
npx wrangler deploy
```

- Do not use `*` in production. The Worker sends `Vary: Origin` and only echoes allowed origins.

### Worker returns a configuration or provider error

- Confirm `AI_PROVIDER` is exactly `gemini` or `groq`.
- Confirm the matching provider secret was added with `wrangler secret put` and redeploy the Worker.
- Use `GET /health` to verify the Worker is reachable. Provider errors are intentionally normalized, so they do not disclose keys or upstream response bodies.
