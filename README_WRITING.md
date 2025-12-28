# Writing Your Weekly Blog

I've simplified the process so you can focus on writing in English. You don't even need to run commands anymore if you don't want to.

## The "Just Drop a File" Way (Easiest)

1.  **Create a `.txt` file** anywhere in the `content/weeks/` folder (or a year subfolder like `2026/`).
    - Name it whatever you want, e.g., `my-amazing-week.txt`.
2.  **Write your blog**:
    - **Line 1**: Your Title.
    - **Line 2**: A short summary (optional).
    - **Line 3+**: Your content.
3.  **That's it!** The system will:
    - Use the file's creation date to figure out which week it belongs to.
    - Automatically find the Monday and Sunday for that week.
    - Create a URL based on your filename.

## The "I want a specific date" Way

If you want to write a post for a past week or a specific future week:
- Name your file starting with the date: `2025-12-29-my-post.txt`.
- The system will use that date instead of the file's creation date.

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
