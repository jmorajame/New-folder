# Seven Knights BossGuild Tracker

A modern, refactored version of the Boss Guild Tracker for Seven Knights Idle game. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Member Tracking**: Track attempts and damage for each guild member
- **Boss Management**: Track Shadow bosses (Teo, Kyle, Yeonhee, Karma) and God of Destruction
- **Analytics Dashboard**: Visual charts and progress tracking
- **Dark Mode**: Beautiful dark/light theme support
- **Multi-language**: Thai and English support
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Data Persistence**: Auto-saves to localStorage

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Lampyriss/Seven-Knights-BossGuild-Tracker.git
cd Seven-Knights-BossGuild-Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Add boss images to the `public` folder:
   - `Teo.png`
   - `Kyle.png`
   - `Yeonhee.png`
   - `Karma.png`
   - `God.png`
   
   These images should be placed in the `public` directory. You can copy them from the original repository.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── Toolbar.tsx
│   ├── Dashboard.tsx
│   ├── MemberTable.tsx
│   ├── SearchBar.tsx
│   └── Toast.tsx
├── hooks/               # Custom React hooks
│   ├── useAppState.ts   # State management
│   ├── useTranslations.ts
│   └── useTheme.ts
├── utils/               # Utility functions
│   ├── index.ts
│   └── memberStats.ts
├── constants/           # Constants and configuration
│   ├── index.ts
│   └── translations.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── styles/              # Global styles
│   └── index.css
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Chart visualization
- **React ChartJS 2** - React wrapper for Chart.js

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages (requires gh-pages package)

## 🚀 Deployment to GitHub Pages

This project is configured for deployment to **GitHub Pages** (github.io).

### Quick Deploy

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[your-username]/Seven-Knights-BossGuild-Tracker.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository **Settings** → **Pages**
   - Select **Source**: `GitHub Actions`
   - Save

3. **Automatic Deployment:**
   - The GitHub Actions workflow will automatically deploy on every push to `main`
   - Your site will be live at: `https://[your-username].github.io/Seven-Knights-BossGuild-Tracker/`

### Important: Update Base Path

If your repository name is different, update the `base` path in `vite.config.ts`:

```typescript
base: '/your-repo-name/'
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🎨 Features in Development

- OCR image scanning
- Export to PDF/CSV/Image
- Command palette
- Member profiles
- Undo/Redo functionality
- Discord webhook integration

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

Original project by [Lampyriss](https://github.com/Lampyriss/Seven-Knights-BossGuild-Tracker)

Refactored with modern React best practices and TypeScript.

