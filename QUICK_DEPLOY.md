# Quick Deploy to GitHub Pages

## What is GitHub Pages?

**GitHub Pages** (github.io) is a free hosting service that lets you host static websites directly from your GitHub repository.

Your site URL will be: `https://[your-username].github.io/[repository-name]/`

## 3 Simple Steps

### 1️⃣ Push Code to GitHub

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repository
git remote add origin https://github.com/[your-username]/Seven-Knights-BossGuild-Tracker.git
git branch -M main
git push -u origin main
```

### 2️⃣ Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under **Source**, select: **GitHub Actions**
5. Click **Save**

### 3️⃣ Wait for Deployment

- GitHub Actions will automatically build and deploy your site
- Check the **Actions** tab to see the deployment progress
- Your site will be live in 1-2 minutes at:
  ```
  https://[your-username].github.io/Seven-Knights-BossGuild-Tracker/
  ```

## ⚠️ Important: Update Repository Name

If your repository has a **different name**, update `vite.config.ts`:

```typescript
// Change this line:
base: '/Seven-Knights-BossGuild-Tracker/'

// To your repository name:
base: '/your-repo-name/'
```

Then commit and push again:
```bash
git add vite.config.ts
git commit -m "Update base path"
git push
```

## ✅ That's It!

Your site is now live! Every time you push to `main`, it will automatically redeploy.

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)

