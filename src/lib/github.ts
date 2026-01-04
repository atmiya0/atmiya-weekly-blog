/**
 * GitHub API utilities for managing blog content
 * Uses GitHub as a "database" by reading/writing files directly to the repo
 */

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubFileContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

interface GitHubCommitResponse {
  content: GitHubFileContent;
  commit: {
    sha: string;
    message: string;
  };
}

interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  summary: string;
  path: string;
  sha: string;
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token || !repo) {
    throw new Error("Missing GITHUB_TOKEN or GITHUB_REPO environment variables");
  }

  const [owner, repoName] = repo.split("/");
  return { token, owner, repo: repoName };
}

function getHeaders() {
  const { token } = getGitHubConfig();
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

/**
 * List all blog posts from the content/weeks directory
 */
export async function listPosts(options: { noCache?: boolean } = {}): Promise<PostMetadata[]> {
  const { owner, repo } = getGitHubConfig();
  const posts: PostMetadata[] = [];

  // Get year directories
  const yearsResponse = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/content/weeks`,
    {
      headers: getHeaders(),
      ...(options.noCache ? { cache: "no-store" } : { next: { revalidate: 3600 } })
    }
  );

  if (!yearsResponse.ok) {
    console.error("Failed to fetch years:", await yearsResponse.text());
    return [];
  }

  const items: GitHubFileContent[] = await yearsResponse.json();

  const processFile = async (file: GitHubFileContent) => {
    if (
      file.type !== "file" ||
      file.name.startsWith("_") ||
      (!file.name.endsWith(".txt") && !file.name.endsWith(".mdx"))
    ) {
      return;
    }

    // Fetch file content to get metadata
    const contentResponse = await fetch(file.url, {
      headers: getHeaders(),
      ...(options.noCache ? { cache: "no-store" } : { next: { revalidate: 3600 } })
    });

    if (!contentResponse.ok) return;

    const fileData: GitHubFileContent = await contentResponse.json();
    const content = Buffer.from(fileData.content || "", "base64").toString("utf-8");

    // Parse format
    const lines = content.split("\n").map((l) => l.trim());
    const title = lines[0] || "Untitled";
    const dateLine = lines[1] || "";
    // Handle multiple dates (comma separated), use the first one for sorting
    const date = dateLine.split(",")[0].trim();
    const summary = lines[2] || "";

    // Extract slug from filename (handle complex names like DATE,DATE-slug)
    const fileName = file.name.replace(/\.(txt|mdx)$/, "");
    const slugMatch = fileName.match(/^(?:\d{4}-\d{2}-\d{2}|,|-)+-(.+)$/);
    const slug = slugMatch ? slugMatch[1] : fileName;

    posts.push({
      slug,
      title,
      date,
      summary,
      path: file.path,
      sha: fileData.sha,
    });
  };

  for (const item of items) {
    if (item.name.startsWith("_")) continue;

    if (item.type === "dir") {
      // Get files in directory
      const encodedItemPath = encodeURI(item.path);
      const filesResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedItemPath}`,
        {
          headers: getHeaders(),
          ...(options.noCache ? { cache: "no-store" } : { next: { revalidate: 3600 } })
        }
      );

      if (filesResponse.ok) {
        const files: GitHubFileContent[] = await filesResponse.json();
        for (const file of files) {
          await processFile(file);
        }
      }
    } else if (item.type === "file") {
      // Process root file
      await processFile(item);
    }
  }

  // Sort by date descending, handle invalid dates safely
  return posts.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    if (isNaN(timeA) && isNaN(timeB)) return 0;
    if (isNaN(timeA)) return 1;
    if (isNaN(timeB)) return -1;
    return timeB - timeA;
  });
}

/**
 * Get a single post by its slug
 */
export async function getPost(
  slug: string,
  options: { noCache?: boolean } = {}
): Promise<{
  content: string;
  metadata: PostMetadata;
} | null> {
  const posts = await listPosts(options);
  const post = posts.find((p) => p.slug === slug);

  if (!post) return null;

  const { owner, repo } = getGitHubConfig();
  const encodedPath = encodeURI(post.path);
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 }
  });

  if (!response.ok) return null;

  const fileData: GitHubFileContent = await response.json();
  const content = Buffer.from(fileData.content || "", "base64").toString("utf-8");

  return {
    content,
    metadata: { ...post, sha: fileData.sha },
  };
}

/**
 * Save/update a post
 */
export async function savePost(
  slug: string,
  content: string,
  existingSha?: string
): Promise<GitHubCommitResponse> {
  const { owner, repo } = getGitHubConfig();

  // If we have a sha, we're updating. Otherwise, we need to find or create the file.
  let path: string;
  const sha = existingSha;

  if (sha) {
    // Find existing file path
    const posts = await listPosts({ noCache: true });
    const existingPost = posts.find((p) => p.slug === slug);
    if (!existingPost) {
      throw new Error(`Post with slug "${slug}" not found`);
    }
    path = existingPost.path;
  } else {
    // Creating new file - extract date from content for path
    const lines = content.split("\n");
    const dateStr = lines[1]?.trim() || new Date().toISOString().split("T")[0];
    const year = dateStr.split("-")[0] || new Date().getFullYear().toString();
    path = `content/weeks/${year}/${dateStr}-${slug}.txt`;
  }

  const encodedContent = Buffer.from(content).toString("base64");

  const body: Record<string, string> = {
    message: sha ? `Update post: ${slug}` : `Create post: ${slug}`,
    content: encodedContent,
  };

  if (sha) {
    body.sha = sha;
  }

  const encodedPath = encodeURI(path);
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to save post: ${error}`);
  }

  return response.json();
}

/**
 * Delete a post
 */
export async function deletePost(slug: string, sha: string): Promise<{ success: boolean }> {
  const { owner, repo } = getGitHubConfig();

  const posts = await listPosts({ noCache: true });
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const encodedPath = encodeURI(post.path);
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${encodedPath}`, {
    method: "DELETE",
    headers: getHeaders(),
    body: JSON.stringify({
      message: `Delete post: ${slug}`,
      sha,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete post: ${error}`);
  }

  return { success: true };
}

/**
 * Get the template for new posts
 */
export async function getTemplate(): Promise<string> {
  const { owner, repo } = getGitHubConfig();

  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/content/weeks/_template.txt`,
    { headers: getHeaders(), next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    // Return a default template if none exists
    return `Untitled Post
${new Date().toISOString().split("T")[0]}
A brief summary of this post.

Your content goes here...`;
  }

  const fileData: GitHubFileContent = await response.json();
  return Buffer.from(fileData.content || "", "base64").toString("utf-8");
}
