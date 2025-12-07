@echo off
echo 🚀 Pushing to GitHub...
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Initialize git if needed
if not exist .git (
    echo Initializing git repository...
    git init
)

REM Add all files
echo Adding files...
git add .

REM Commit
echo Committing changes...
git commit -m "Initial commit - React refactored version with GitHub Pages deployment"

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  No remote repository configured!
    echo.
    echo Please run these commands manually:
    echo   git remote add origin https://github.com/[YOUR-USERNAME]/[YOUR-REPO-NAME].git
    echo   git branch -M main
    echo   git push -u origin main
    echo.
    echo Or edit this file and add your repository URL.
    echo.
    pause
    exit /b 1
)

REM Set main branch
echo Setting main branch...
git branch -M main

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed. Please check:
    echo   - You're logged into GitHub
    echo   - Repository exists and you have access
    echo   - Remote URL is correct
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo Next steps:
    echo 1. Go to your repository on GitHub
    echo 2. Settings → Pages
    echo 3. Select 'GitHub Actions' as source
    echo 4. Your site will be live at: https://[your-username].github.io/[repo-name]/
    echo.
    pause
)

