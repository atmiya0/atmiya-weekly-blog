# Weekly Blog

A minimal, file-based weekly blog built with Next.js, TypeScript, and plain text. Designed for long-term consistency and personal documentation.

**Live at:** [blogs.atmiya.ca](https://blogs.atmiya.ca)

---

## Quick Start: Adding a New Weekly Post

**Time required:** Under 1 minute

### Option 1: Automated (Recommended)

```bash
npm run new-post "My Week Title" "A short summary"
```

This automatically creates a `.txt` file with the correct date in the right folder.

### Option 2: Manual

1. Create a new `.txt` file in `content/weeks/` (or a year subfolder)
2. Write:
   - **Line 1**: Your title
   - **Line 2**: A short summary (optional)
   - **Line 3+**: Your content
3. Save and push to GitHub

Example filename: `2026-01-05-my-week.txt` (or just `my-week.txt`)

### Deploy

```bash
git add . && git commit -m "Week N" && git push
```

Vercel handles the rest.

---

## Custom Font Setup

The blog is configured to use **BrunswickGrotesque** as the custom font. Until font files are added, it uses a system font fallback.

### Adding Your Font Files

1. Add your `.woff2` files to `src/fonts/`:
   ```
   src/fonts/
   ├── BrunswickGrotesque-Regular.woff2
   ├── BrunswickGrotesque-Medium.woff2
   ├── BrunswickGrotesque-SemiBold.woff2
   └── BrunswickGrotesque-Bold.woff2
   ```

2. Open `src/app/layout.tsx` and:
   - Uncomment the `localFont` import
   - Uncomment the `brunswickGrotesque` configuration
   - Update the `<body>` tag:
     ```tsx
     <body className={`${brunswickGrotesque.variable} antialiased min-h-screen flex flex-col`}>
     ```

3. Rebuild and deploy.

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
A brief summary (optional)

Your content goes here. Write naturally in plain English.

You can use Markdown if you want (headings, **bold**, *italic*, etc.)
But plain text works perfectly fine too!
```
### Field Reference (MDX only)

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | The title of the post |
| `week` | number | Week number (calculated automatically) |
| `startDate` | string | Monday of the week (YYYY-MM-DD) |
| `endDate` | string | Sunday of the week (YYYY-MM-DD) |
| `summary` | string | Brief summary for listings |
| `slug` | string | URL-friendly identifier |

For `.txt` files, all of this is handled automatically.

For backwards compatibility, MDX files with YAML frontmatter still work:

```yaml
---Plain text (`.txt`) and MDX (`.mdx`)
title: "Your title here"
week: 2
startDate: "2024-12-30"
endDate: "2025-01-05"
summary: "A brief summary of this week."
slug: "week-02"
---
```

| Field | Type | Description |
|-------|------|------------    # Blog posts
│       ├── 2025/
│       │   ├── 2025-12-22-post.txt   # Plain text posts
│       │   └── w52-legacy.mdx        # Legacy MDX posts
│       └── 2026/
│           └── 2026-01-05-post.txt
├── scripts/
│   └── new-post.mjs            # CLI tool to create posts
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with font config
│   │   ├── page.tsx            # Home page (indexed)
│   │   ├── globals.css         # Global styles
│   │   ├── sitemap.ts          # Only includes home page
│   │   ├── feed.xml/           # RSS feed
│   │   └── week/
│   │       └── [slug]/         # Blog post pages (noindex)
│   │           └── page.tsx
│   ├── components/
│   │   ├── blog-layout.tsx
│   │   ├── countdown.tsx
│   │   ├── keyboard-navigation.tsx
│   │   ├── mdx-content.tsx
│   │   └── week-navigation.tsx
│   ├── fonts/                  # Custom font files
│   │   └── README.md
│   ├── lib/
│   │   ├── dates.ts
│   │   └── weeks.ts            # Handles both .txt and .mdx
│   └── types/
│       └── week.ts
├── public/
│   └── robots.txt
├── README.md                   # This file
├── README_WRITING.md           # Writing guide
├── mdx-components.tsx          # MDX component overrides
│   │   ├── layout.tsx      # Root layout with font config
│   │   ├── page.tsx        # Home page (indexed)
│   │   ├── globals.css     # Global styles
│   │   ├── sitemap.ts      # Only includes home page
│   │   ├── feed.xml/       # RSS feed
│   │   └── week/
│   │       └── [slug]/     # Blog post pages (noindex)
│   │           └── page.tsx
│   ├── components/
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   ├── mdx-content.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── week-card.tsx
│   │   └── week-navigation.tsx
│   ├── fonts/              # Custom font files
│   │   └── README.md
│   ├── lib/
│   │   ├── dates.ts
│   │   └── weeks.ts
│   └── types/
│       └── week.ts
├── public/
│   └── robots.txt
├── mdx-components.tsx      # MDX component overrides (shared)
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

The blog uses static export (`output: 'export'`). Push to `main` branch and Vercel automatically builds and deploys.

---

## License

Private. All rights reserved.
