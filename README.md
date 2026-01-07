# Weekly Blog

A minimal, file-based weekly blog built with Next.js, TypeScript, and plain text. Designed for long-term consistency and personal documentation.

**Live at:** [blogs.atmiya.ca](https://blogs.atmiya.ca)

---

## Quick Start: Adding a New Weekly Post

**Time required:** Under 1 minute

### Option 1: Admin Panel (Recommended)

1. Go to `/admin` in your browser
2. Log in with your credentials
3. Click "New Post" in the dashboard
4. Fill in the title, dates, summary, and content
5. Click "Create Post" — it's automatically saved to GitHub!

The admin panel handles proper date formatting, file naming, and GitHub sync.

### Option 2: Manual

1. Create a new `.txt` file in `content/weeks/YYYY/` (use the correct year folder)
2. Name it `YYYY-MM-DD-your-slug.txt` where the date is the Monday of the week
3. Write:
   - **Line 1**: Your title
   - **Line 2**: Dates (startDate,endDate in YYYY-MM-DD format)
   - **Line 3**: A short summary
   - **Line 4**: (Leave empty)
   - **Line 5+**: Your content
4. Commit and push to GitHub

Example filename: `2026-01-05-first-week-of-2026.txt`

### Deploy

```bash
git add . && git commit -m "Week N" && git push
```

Vercel handles the rest.

---

## Custom Font Setup

The blog is configured to use **OpenRunde** as the custom font. The font file should be placed in `public/font/`.

### Font Files

```
public/font/
└── OpenRunde-Medium.woff2
```

The font is configured in `src/styles/typography.ts` and automatically applied via the `--font-openrunde` CSS variable.

---

## Philosophy

This blog exists as a **supporting property** for [atmiya.ca](https://atmiya.ca). The purpose is:

- **Long-term consistency**: One post per week, every week
- **Personal documentation**: A record of thoughts, progress, and learnings
- **Quiet credibility**: Substance over noise

Intentionally excluded: comments, likes, search, analytics, dashboards, and growth hacks.

---

## SEO Strategy

### Why Only the Home Page is Indexed

Individual blog posts are **intentionally de-indexed** to:

1. **Avoid cannibalization**: Posts don't compete with the main portfolio site in search
2. **Consolidate authority**: All SEO value flows to the home page
3. **Maintain focus**: The blog is for readers who find it, not for search discovery

### Implementation

| Page | Robots Directive | Canonical URL |
|------|-----------------|---------------|
| Home (`/`) | `index, follow` | Self |
| Blog posts (`/week/*`) | `noindex, follow` | Home page |

Additional measures:
- **robots.txt**: Disallows `/week/` paths
- **sitemap.xml**: Only includes the home page
- **RSS feed**: Exists for subscribers, not SEO
- **No structured data** (BlogPosting schema) on individual posts

---

## Content Format

Blog posts are written in **plain text** (`.txt` files) for maximum simplicity. MDX (`.mdx`) files are also supported for backwards compatibility.

### Plain Text Format (Recommended)

```
Your Blog Title
2026-01-05,2026-01-11
A brief summary (optional)

Your content goes here. Write naturally in plain English.

You can use Markdown if you want (headings, **bold**, *italic*, etc.)
But plain text works perfectly fine too!
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| Line 1 | string | The title of the post |
| Line 2 | string | Dates: startDate,endDate (YYYY-MM-DD format) |
| Line 3 | string | Brief summary for listings |
| Line 5+ | string | Main content (supports Markdown) |

For `.txt` files, week numbers and slugs are calculated automatically from the filename.

---

## Project Structure

```
├── content/
│   └── weeks/                    # Blog posts
│       ├── _template.txt         # Template with formatting guide
│       ├── 2025/
│       │   └── 2025-12-22-post.txt
│       └── 2026/
│           └── 2026-01-05-post.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with font config
│   │   ├── page.tsx              # Home page (indexed)
│   │   ├── globals.css           # Global styles
│   │   ├── sitemap.ts            # Only includes home page
│   │   ├── feed.xml/             # RSS feed
│   │   ├── admin/                # Admin panel for managing posts
│   │   │   ├── page.tsx          # Admin login
│   │   │   ├── dashboard/        # Dashboard with all posts
│   │   │   ├── new/              # Create new post
│   │   │   └── edit/[slug]/      # Edit existing posts
│   │   └── week/
│   │       └── [slug]/           # Blog post pages (noindex)
│   │           └── page.tsx
│   ├── components/
│   │   ├── blog-layout.tsx
│   │   ├── countdown.tsx
│   │   ├── contact-tray.tsx
│   │   ├── keyboard-navigation.tsx
│   │   ├── mdx-content.tsx
│   │   └── week-navigation.tsx
│   ├── fonts/                    # Custom font files
│   │   └── README.md
│   ├── lib/
│   │   ├── dates.ts
│   │   ├── github.ts             # GitHub API for CRUD
│   │   └── weeks.ts              # Handles both .txt and .mdx
│   └── types/
│       └── week.ts
├── public/
│   └── robots.txt
├── README.md                     # This file
├── mdx-components.tsx            # MDX component overrides
├── next.config.ts
├── vercel.json
└── package.json
```

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

---

## Deployment

The blog is deployed on Vercel. Push to the `main` branch and Vercel automatically builds and deploys.

---

## License

Private. All rights reserved.
