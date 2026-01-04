# How to Fix GitHub Token Permissions for DELETE Operations

## The Problem
You're seeing this error when trying to delete posts:
```
Failed to delete post: {"message":"Resource not accessible by personal access token","documentation_url":"https://docs.github.com/rest/repos/contents#delete-a-file","status":"403"}
```

This means your GitHub Personal Access Token (PAT) doesn't have the required permissions to delete files.

## Solution: Generate a New Token with Proper Permissions

### For Classic Personal Access Tokens:

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"

2. **Configure the Token**
   - **Note**: `Blog Admin Token` (or any name you prefer)
   - **Expiration**: Choose your preference (recommend 90 days or No expiration for personal projects)
   - **Scopes**: Check the **entire `repo`** section:
     - ✅ `repo` (this gives full control of private repositories)
       - ✅ `repo:status`
       - ✅ `repo_deployment`
       - ✅ `public_repo`
       - ✅ `repo:invite`
       - ✅ `security_events`

3. **Generate and Copy**
   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately (you won't see it again)

4. **Update Your Environment Variable**
   - Open `.env.local` in your project
   - Replace the old token:
     ```
     GITHUB_TOKEN=ghp_your_new_token_here
     GITHUB_REPO=atmiya0/atmiya-weekly-blog
     ```

5. **Restart Your Dev Server**
   ```bash
   # Stop the current dev server (Ctrl+C)
   npm run dev
   ```

### For Fine-Grained Personal Access Tokens (More Secure):

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens?type=beta
   - Click "Generate new token"

2. **Configure the Token**
   - **Token name**: `Blog Admin Token`
   - **Expiration**: Choose your preference
   - **Repository access**: Select "Only select repositories"
     - Choose: `atmiya0/atmiya-weekly-blog`

3. **Repository Permissions**
   - Find **"Contents"** and set to: **Read and write**
   - This gives permission to create, update, and **delete** files

4. **Generate and Copy**
   - Click "Generate token"
   - Copy the token immediately

5. **Update Your .env.local**
   ```
   GITHUB_TOKEN=github_pat_your_new_token_here
   GITHUB_REPO=atmiya0/atmiya-weekly-blog
   ```

6. **Restart Dev Server**
   ```bash
   npm run dev
   ```

## Verification

After updating the token, try deleting a post again from your admin panel. The error should be resolved.

## Security Notes

- Never commit `.env.local` to git (it's already in `.gitignore`)
- Store your token securely
- For production (Vercel), add `GITHUB_TOKEN` and `GITHUB_REPO` to your Environment Variables in the Vercel dashboard

## If You're Using an Organization Repository

If your repository is under a GitHub organization (not your personal account), you may need to:

1. Check with your organization admin if PATs are allowed
2. Some organizations restrict DELETE operations via PATs
3. You might need to use a GitHub App instead of a PAT

---

**Current Status**: Your CRUD operations are now correctly implemented with:
- ✅ URI encoding for special characters
- ✅ POST-only API methods (GET and POST)
- ✅ Method tunneling for UPDATE and DELETE
- ✅ On-demand cache revalidation
- ✅ Proper error handling

The only remaining issue is the token permission, which you can fix by following the steps above.
