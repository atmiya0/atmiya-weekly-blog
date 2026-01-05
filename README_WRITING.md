# Writing Your Weekly Blog

I've simplified the process so you can focus on writing. You don't even need to touch the terminal.

## The Admin Panel Way (Recommended)

1. **Go to `/admin`** in your browser
2. **Log in** with your credentials
3. **Click "New Post"** in the dashboard
4. **Fill in the form**:
   - Title
   - Start Date (Monday of the week)
   - End Date (Sunday of the week)
   - Summary
   - Content (supports Markdown)
5. **Click "Create Post"** — done!

The admin panel handles all the file naming, GitHub syncing, and date validation automatically.

## The Manual Way

If you prefer creating files directly:

1. **Create a `.txt` file** in `content/weeks/YYYY/` (use the correct year folder)
   - Name it: `YYYY-MM-DD-your-slug.txt` where the date is the Monday of the week
2. **Write your blog**:
   - **Line 1**: Your Title
   - **Line 2**: Dates (startDate,endDate in YYYY-MM-DD format)
   - **Line 3**: A short summary
   - **Line 4**: (Leave empty)
   - **Line 5+**: Your content
3. **Commit and push** to GitHub

The system will automatically:
- Calculate the week number
- Create a URL based on your filename slug
- Display it on the home page timeline

## File Naming

- **Format**: `YYYY-MM-DD-your-slug.txt`
- **The date should be a Monday** — this is the start of your week
- **Place in the correct year folder**: `2025/` or `2026/`

Examples:
- ✅ `2025-12-22-colophon.txt` (Dec 22, 2025 is a Monday)
- ✅ `2026-01-05-first-week-of-2026.txt` (Jan 5, 2026 is a Monday)

## Tips for a Simpler Life

- **Use the Admin Panel**: It's the easiest way to create and edit posts
- **No Markdown Needed**: Just write plain English. Double newlines create new paragraphs.
- **But Markdown Works**: If you want `## Headings`, **bold**, or *italic*, go for it.
- **Voice to Text**: Dictate your week into your phone, then paste it into the admin panel.
