# rendiichtiar.com

Personal website and platform for content, guest interaction, and admin tools.

This project includes:

- A public site (home, about, blog, contact, playground).
- A guestbook with replies and likes.
- A full blog system with Markdown editing, tags, and scheduled publishing.
- An admin dashboard to manage posts and incoming contact messages.
- Dark/light theme and bilingual UI (ID / EN).

Built with Next.js, React, Tailwind CSS, Drizzle, and NextAuth.

---

## Features

### Public pages

- **Home (`/`)**  
  Intro, tech stack, and work CTA.

- **About (`/about`)**  
  Career and education timeline.

- **Blog (`/blog/[slug]`)**
  - Markdown content with cover image.
  - Read time and view counter.
  - Open Graph metadata per post.
  - Tag list.
  - Comment section.

- **Guestbook (`/guestbook`)**
  - Sign in with Google or GitHub.
  - Post a message.
  - Reply to messages (threaded).
  - Like messages.
  - Realtime updates via Server‑Sent Events (no page refresh).
  - Owner badge on the author's account.

- **Contact (`/contact`)**
  - Contact form with validation.
  - “Book a call” card (external scheduler).
  - Contact messages are persisted and visible in admin.

- **Playground (`/playground`)**
  - In‑browser JavaScript sandbox using Monaco Editor.
  - Console output panel.
  - Run / Clear / Fullscreen controls.
  - Unsafe browser APIs are blocked (`window`, `fetch`, `eval`, etc.).
  - Max code length guard and runtime error handling.

### Admin pages

- **Blog admin (`/admin/blog`)**
  - List all posts.
  - Shows status: `DRAFT`, `PUBLISHED`, `SCHEDULED`.
  - Shows publish date or last updated.
  - Shows tags.
  - Edit / View buttons.
  - "New Post" action.

- **Blog editor (`/admin/blog/new`, `/admin/blog/[id]/edit`)**
  - Title, cover URL with live preview, Markdown content.
  - Tags (comma‑separated).
  - Post status selector (Draft / Published / Scheduled).
  - Auto‑generate excerpt from Markdown.
  - Actions:
    - Save draft / update post
    - Publish post
    - Delete post
  - Toast feedback on success / error.

- **Contact admin (`/admin/contact`)**
  - View messages submitted from `/contact`.
  - Track status (unread / read / replied).
  - Send a reply (email) via a modal dialog.

Admin routes are protected. Only the configured admin email can access them.

### Global UI / DX

- Responsive Navbar with slide‑over mobile menu and desktop sidebar.
- Dark / light / system theme toggle (`next-themes`).
- Runtime language switcher (ID / EN) backed by `useI18n`.
- "Back to top" floating button.
- Accessible labels and roles on interactive and form elements.
- Toast notifications using `sonner`.
- Smooth page transitions using `framer-motion`.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **React:** React 19
- **Styling:** Tailwind CSS + custom UI components
- **Auth:** NextAuth (Google, GitHub providers)
- **DB / ORM:** Drizzle + PostgreSQL
- **State / Data Fetching:** React Server Components + Server Actions + SSE
- **Editor:** Monaco Editor (`@monaco-editor/react`)
- **Icons:** `lucide-react`, `react-icons`
- **Date formatting:** `date-fns`
- **Notifications:** `sonner`

---

## Project Structure (high level)

```text
app/
  page.tsx                 # Home
  about/
  blog/
    [slug]/page.tsx        # Public blog post
    blog.ts                # Blog server actions (CRUD, views, comments)
  contact/
  guestbook/
  playground/
  admin/
    blog/
      page.tsx             # Blog admin list
      new/page.tsx         # New post editor
      [id]/edit/page.tsx   # Edit existing post
    contact/
      page.tsx             # Contact inbox dashboard
  api/
    auth/[...nextauth]/    # NextAuth routes
    guestbook/             # Guestbook post/like/reply API + SSE stream
    contact/               # Contact form submit + reply

components/
  animations/
  auth/                    # LoginDialog, SignInButton, SignOutButton
  pages/                   # Page-level client components
  ui/                      # Button, Card, Input, Tooltip, etc.
  navbar/                  # Navbar / sidebar / mobile menu
  footer/
  BackToTop.tsx

lib/
  i18n.tsx                 # i18n provider + useI18n hook
  constants/forbidden-words.ts
  auth.ts                  # Auth helpers

messages/
  id.json                  # Bahasa Indonesia copy
  en.json                  # English copy

public/
  avatar.jpg
  og-image.png
  favicon.ico
```

Notes:

- All text / UI strings live in `messages/en.json` and `messages/id.json`.
- `useI18n()` is a client hook. Do not call it directly in a Server Component. If a server page needs localized text, pass it down via props from a Client Component or render static text.

---

## Requirements

- Node.js 18+ (or whatever your Next.js version requires)
- PostgreSQL database
- Google OAuth client (for NextAuth)
- GitHub OAuth app (for NextAuth)
- `.env.local` with required secrets

---

## Environment Variables

Create `.env.local` in the project root:

```env
# App URL
NEXTAUTH_URL=http://localhost:3000

# NextAuth secret
NEXTAUTH_SECRET=replace-with-a-long-random-string

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Admin access
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com

# App URL
NEXT_PUBLIC_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rendiichtiar

# (Optional) email settings for contact replies
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=no-reply@example.com
SMTP_PASS=your-smtp-password
SITE_EMAIL_FROM="Rendi <no-reply@example.com>"
SITE_EMAIL_TO="you@example.com"
```

`ADMIN_EMAIL` controls who can access `/admin/**`.

---

## Setup and Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Generate Drizzle:

   ```bash
   npx drizzle-kit generate
   ```

3. Run database migrations (or create schema locally):

   ```bash
   npx drizzle-kit migrate
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open the site:  
   `http://localhost:3000`

You now have:

- `/` public site
- `/blog` blog list (public)
- `/guestbook` interactive guestbook (login required to post)
- `/contact` contact form
- `/playground` JS playground
- `/admin/blog` admin blog dashboard (requires login as `ADMIN_EMAIL`)
- `/admin/contact` admin blog dashboard (requires login as `ADMIN_EMAIL`)

---

## Production Build

To create an optimized production build:

```bash
npm run build
npm run start
```

- `npm run build` runs the Next.js production build.
- `npm run start` serves the built app.

The production environment must have:

- a valid `.env`
- access to the production PostgreSQL database
- OAuth credentials with correct redirect URLs

---

## Authentication and Admin Access

Authentication is handled by NextAuth with Google and GitHub providers.

A valid session is required for:

- Posting in the guestbook
- Liking guestbook messages
- Replying to guestbook threads
- Viewing and using `/admin/**`

The app compares `session.user.email` to `ADMIN_EMAIL`.  
Non-admin users are redirected to `/forbidden` or get `401/403` on protected API routes.

---

## Internationalization (i18n)

The UI supports Indonesian and English.

`useI18n()` exposes:

- `language` (`"id"` or `"en"`)
- `setLanguage(nextLang)`
- `messages` (localized strings)

Example usage:

```tsx
const { messages } = useI18n()

<h1>{messages.pages.playground.title}</h1>
<p>{messages.pages.playground.subtitle}</p>
<Button>{messages.common.auth.login.google}</Button>
```

The `LanguageSwitcher` component toggles language at runtime.

---

## License

MIT License.
You may use, modify, and distribute with attribution.
