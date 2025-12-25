# Weekly Blog

A minimal, file-based weekly blog built with Next.js, TypeScript, and MDX. Designed for long-term consistency and personal documentation.

**Live at:** [blogs.atmiya.ca](https://blogs.atmiya.ca)

---

## Quick Start: Adding a New Weekly Post

**Time required:** Under 1 minute

```bash
# 1. Duplicate the previous week
cp content/weeks/week-01.mdx content/weeks/week-02.mdx

# 2. Edit the frontmatter and content
# 3. Deploy
git add . && git commit -m "Week 2" && git push
```

That's it. Vercel handles the rest.

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

## Frontmatter Reference

Every MDX file in `content/weeks/` requires these fields:

```yaml
---
title: "Your title here"
week: 2
startDate: "2024-12-30"
endDate: "2025-01-05"
summary: "A brief summary of this week."
slug: "week-02"
---
```

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | The title of the post |
| `week` | number | Week number (1, 2, 3...) |
| `startDate` | string | Start of the week (YYYY-MM-DD) |
| `endDate` | string | End of the week (YYYY-MM-DD) |
| `summary` | string | Brief summary for listings |
| `slug` | string | URL-friendly identifier (e.g., "week-01") |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Content**: File-based MDX
- **Deployment**: Vercel (static export)
- **Code Quality**: ESLint + Prettier

---

## Project Structure

```
atmiya-weekly-blog/
├── content/
│   └── weeks/              # MDX blog posts
│       ├── week-01.mdx
│       └── week-02.mdx
├── src/
│   ├── app/
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
