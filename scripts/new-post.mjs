import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseISO, addDays, format } from 'date-fns';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../content/weeks');

function getNextMonday() {
    const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });
    let latestDate = new Date(2024, 11, 23); // Default start

    const processDir = (dirPath) => {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            if (file.startsWith('_')) continue;

            // Try to get date from filename (for .txt) or frontmatter (for .mdx)
            if (file.endsWith('.txt')) {
                const match = file.match(/^(\d{4}-\d{2}-\d{2})/);
                if (match) {
                    const d = parseISO(match[1]);
                    if (d > latestDate) latestDate = d;
                }
            } else if (file.endsWith('.mdx')) {
                const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
                const match = content.match(/startDate:\s*["'](\d{4}-\d{2}-\d{2})["']/);
                if (match) {
                    const d = parseISO(match[1]);
                    if (d > latestDate) latestDate = d;
                }
            }
        }
    };

    for (const entry of entries) {
        if (entry.isDirectory() && /^\d{4}$/.test(entry.name)) {
            processDir(path.join(CONTENT_DIR, entry.name));
        }
    }

    return addDays(latestDate, 7);
}

async function createPost() {
    const title = process.argv[2] || "New Weekly Post";
    const summary = process.argv[3] || "Summary of this week's activities.";

    const startDate = getNextMonday();
    const startDateStr = format(startDate, 'yyyy-MM-dd');
    const year = format(startDate, 'yyyy');

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const fileName = `${startDateStr}-${slug}.txt`;
    const yearDir = path.join(CONTENT_DIR, year);

    if (!fs.existsSync(yearDir)) {
        fs.mkdirSync(yearDir, { recursive: true });
    }

    const filePath = path.join(yearDir, fileName);

    if (fs.existsSync(filePath)) {
        console.error(`Error: File ${filePath} already exists.`);
        process.exit(1);
    }

    const content = `${title}
${summary}

Write your content here in plain English.
No markdown required, but you can use it if you want!
`;

    fs.writeFileSync(filePath, content);
    console.log(`\n✅ Created new post: ${filePath}`);
    console.log(`\nNext steps:`);
    console.log(`1. Open the file and write your blog.`);
    console.log(`2. Run 'npm run dev' to see it live.`);
}

createPost().catch(console.error);
