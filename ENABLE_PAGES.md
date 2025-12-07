# How to Enable GitHub Pages - Step by Step

## The Error You're Seeing

```
Get Pages site failed. Please verify that the repository has Pages enabled 
and configured to build using GitHub Actions
```

This means **GitHub Pages is not enabled** in your repository settings.

## ✅ Solution: Enable GitHub Pages

### Step 1: Go to Repository Settings
1. Go to: https://github.com/jmorajame/New-folder
2. Click **Settings** (top menu, right side)

### Step 2: Navigate to Pages
1. In the left sidebar, scroll down and click **Pages**

### Step 3: Configure Pages
1. Under **Source**, you'll see options:
   - **Deploy from a branch** (old way)
   - **GitHub Actions** (new way) ← **Select this one!**

2. Select **GitHub Actions** as the source

3. Click **Save**

### Step 4: Set Workflow Permissions (Important!)
1. Still in Settings, click **Actions** → **General** (left sidebar)

2. Scroll down to **Workflow permissions**

3. Select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**

4. Click **Save**

### Step 5: Re-run the Workflow
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Click **Re-run all jobs** (top right)

OR

4. Make a small change and push again (this will trigger a new run)

## ✅ After Enabling Pages

Once Pages is enabled:
- The workflow will automatically deploy
- Your site will be live at: `https://jmorajame.github.io/New-folder/`
- Future pushes will auto-deploy

## 🔍 Verify It's Working

1. Go to **Settings** → **Pages**
2. You should see: **"Your site is live at https://jmorajame.github.io/New-folder/"**
3. The workflow should show a green checkmark ✅

## ⚠️ If You Still See Errors

If after enabling Pages you still see errors:
1. Wait 1-2 minutes (GitHub needs time to set up)
2. Re-run the workflow
3. Check that workflow permissions are set correctly

## Quick Checklist

- [ ] Settings → Pages → Source = **GitHub Actions**
- [ ] Settings → Actions → General → Workflow permissions = **Read and write**
- [ ] Re-run the workflow
- [ ] Wait for deployment (1-2 minutes)
- [ ] Check site URL works

That's it! Once Pages is enabled, everything should work automatically. 🎉

