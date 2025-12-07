# PowerShell script to push to GitHub
# Run this after installing Git and creating your GitHub repository

Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Green

# Initialize git (if not already done)
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Add all files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "Initial commit - React refactored version with GitHub Pages deployment"

# Check if remote exists
$remoteExists = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  No remote repository configured!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run these commands manually:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/[YOUR-USERNAME]/[YOUR-REPO-NAME].git" -ForegroundColor Cyan
    Write-Host "  git branch -M main" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or update this script with your repository URL and run it again." -ForegroundColor Yellow
    exit
}

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to your repository on GitHub" -ForegroundColor Cyan
    Write-Host "2. Settings → Pages" -ForegroundColor Cyan
    Write-Host "3. Select 'GitHub Actions' as source" -ForegroundColor Cyan
    Write-Host "4. Your site will be live at: https://[your-username].github.io/[repo-name]/" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Please check:" -ForegroundColor Red
    Write-Host "  - Git is installed" -ForegroundColor Yellow
    Write-Host "  - You're logged into GitHub" -ForegroundColor Yellow
    Write-Host "  - Repository exists and you have access" -ForegroundColor Yellow
    Write-Host "  - Remote URL is correct" -ForegroundColor Yellow
}

