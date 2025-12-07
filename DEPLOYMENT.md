# GitHub Pages Deployment Guide

## What is GitHub Pages?

**GitHub Pages** (github.io) is a free static site hosting service provided by GitHub. It allows you to host websites directly from your GitHub repository. Your site will be available at:

```
https://[your-username].github.io/[repository-name]/
```

For example: `https://lampyriss.github.io/Seven-Knights-BossGuild-Tracker/`

## Deployment Methods

### Method 1: Automatic Deployment with GitHub Actions (Recommended) ✅

This method automatically deploys your site whenever you push to the `main` branch.

#### Step 1: Push your code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - React refactored version"

# Add your GitHub repository as remote
git remote add origin https://github.com/[your-username]/Seven-Knights-BossGuild-Tracker.git

# Push to main branch
git branch -M main
git push -u origin main
```

#### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. Save the settings

#### Step 3: Trigger Deployment

The GitHub Actions workflow will automatically run when you:
- Push to the `main` branch
- Or manually trigger it from the **Actions** tab

Your site will be live at: `https://[your-username].github.io/Seven-Knights-BossGuild-Tracker/`

---

### Method 2: Manual Deployment with gh-pages

This method uses the `gh-pages` package to deploy manually.

#### Step 1: Install gh-pages

```bash
npm install --save-dev gh-pages
```

#### Step 2: Update package.json

The `deploy` script is already added. Make sure your `package.json` has:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

#### Step 3: Deploy

```bash
npm run deploy
```

This will:
1. Build your app
2. Create a `gh-pages` branch
3. Push the `dist` folder to that branch
4. GitHub Pages will serve from the `gh-pages` branch

#### Step 4: Configure GitHub Pages

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Save

---

## Important Configuration

### Base Path

The `vite.config.ts` is configured with:

```typescript
base: '/Seven-Knights-BossGuild-Tracker/'
```

**If your repository name is different**, update this path in `vite.config.ts`:

```typescript
base: '/your-repo-name/'
```

**For custom domain or root path**, use:

```typescript
base: '/'  // For custom domain or username.github.io
```

### Updating the Base Path

If you need to change the repository name or use a different base path:

1. Update `vite.config.ts`:
   ```typescript
   base: '/your-new-repo-name/'
   ```

2. Rebuild and redeploy:
   ```bash
   npm run build
   npm run deploy  # or push to trigger GitHub Actions
   ```

---

## Troubleshooting

### 404 Errors on Refresh

If you get 404 errors when refreshing pages, you need to add a `404.html` file that redirects to `index.html`. However, with React Router (if you add it later), you'll need proper server configuration.

For now, since this is a single-page app, this shouldn't be an issue.

### Assets Not Loading

Make sure:
- All images are in the `public/` folder
- The base path in `vite.config.ts` matches your repository name
- You've rebuilt after changing the base path

### Build Fails

Check:
- All dependencies are installed: `npm install`
- TypeScript errors are fixed: `npm run lint`
- Build locally first: `npm run build`

---

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to the `public/` folder with your domain:
   ```
   yourdomain.com
   ```

2. Update `vite.config.ts` base to `/`:
   ```typescript
   base: '/'
   ```

3. Configure DNS settings with your domain provider

---

## Quick Reference

| Action | Command |
|--------|---------|
| Build locally | `npm run build` |
| Preview build | `npm run preview` |
| Deploy (gh-pages) | `npm run deploy` |
| Deploy (GitHub Actions) | `git push origin main` |

---

## Deployment Status

Check deployment status:
- **GitHub Actions**: Go to **Actions** tab in your repository
- **GitHub Pages**: Go to **Settings** → **Pages** to see the deployment status

Your site URL will be shown in the Pages settings once deployed.

