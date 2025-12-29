# Writing Your Weekly Blog

I've simplified the process so you can focus on writing in English. You don't even need to run commands anymore if you don't want to.

## The "Just Drop a File" Way (Easiest)

1.  **Create a `.txt` file** anywhere in the `content/weeks/` folder (or a year subfolder like `2026/`).
    - Name it whatever you want, e.g., `my-amazing-week.txt`.
2.  **Write your blog**:
    - **Line 1**: Your Title.
    - **Line 2**: The Date (YYYY-MM-DD).
    - **Line 3**: A short summary.
    - **Line 4**: (Leave empty).
    - **Line 5+**: Your content.
3.  **That's it!** The system will:
    - Use the date in the filename (e.g., `2025-12-28-post.txt`) to figure out which week it belongs to and its position within that week.
    - Automatically find the Monday and Sunday for that week.
    - Create a URL based on your filename.

## The "I want a specific date" Way

To ensure your posts are sorted correctly (most recent at the top):
- **Always start your filename with a date**: `YYYY-MM-DD-your-slug.txt`.
- Posts within the same week are sorted by this date.
- If you don't provide a date in the filename, the system uses the file's creation date.

## The "Automation" Way

If you like the terminal, you can still use:
```bash
npm run new-post "My Title" "My Summary"
```
This just creates the file for you with the correct date in the filename.

## Tips for a Simpler Life

- **No Markdown Needed**: Just write plain English. Double newlines create new paragraphs.
- **Auto-Summary**: If you skip the second line, the system will automatically grab the first few sentences of your post for the preview.
- **Voice to Text**: Dictate your week into your phone, paste it into a `.txt` file, and you're done.
