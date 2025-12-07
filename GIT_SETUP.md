# Git Setup & Push Instructions

## Step 1: Install Git

If Git is not installed on your system:

### Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer (use default options)
3. Restart your terminal/PowerShell

### Verify Installation:
```powershell
git --version
```

## Step 2: Create GitHub Repository

1. Go to https://github.com
2. Click the **+** icon → **New repository**
3. Name it: `Seven-Knights-BossGuild-Tracker` (or your preferred name)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README, .gitignore, or license
6. Click **Create repository**

## Step 3: Push Your Code

### Option A: Using the PowerShell Script

1. Open PowerShell in your project folder
2. Edit `push-to-github.ps1` and replace `[YOUR-USERNAME]` and `[YOUR-REPO-NAME]` with your actual values
3. Run:
   ```powershell
   .\push-to-github.ps1
   ```

### Option B: Manual Commands

Open PowerShell or Git Bash in your project folder and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - React refactored version"

# Add your GitHub repository as remote
# REPLACE [YOUR-USERNAME] and [YOUR-REPO-NAME] with your actual values
git remote add origin https://github.com/[YOUR-USERNAME]/[YOUR-REPO-NAME].git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/lampyriss/Seven-Knights-BossGuild-Tracker.git
```

## Step 4: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select: **GitHub Actions**
4. Click **Save**

## Step 5: Wait for Deployment

- GitHub Actions will automatically build and deploy
- Check the **Actions** tab to see progress
- Your site will be live in 1-2 minutes at:
  ```
  https://[your-username].github.io/[repo-name]/
  ```

## Troubleshooting

### "git is not recognized"
- Install Git (see Step 1)
- Restart your terminal

### "Authentication failed"
- Use GitHub Personal Access Token instead of password
- Or use GitHub Desktop app

### "Repository not found"
- Check repository name is correct
- Make sure repository exists on GitHub
- Verify you have access to the repository

### "Permission denied"
- Make sure you're logged into GitHub
- Check your SSH keys or use HTTPS with token

## Using GitHub Desktop (Alternative)

If you prefer a GUI:

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish repository"
6. Enable GitHub Pages in repository settings

