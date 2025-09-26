# 🚀 OpenBuild - Quick Start for New Claude Instance

## 📋 Copy This Entire Message to Claude:

---

I need help with OpenBuild, my visual website builder project. Here's the complete context:

**Project**: OpenBuild - A drag-and-drop website builder (like Webflow/Wix)  
**Tech Stack**: Vue 3, TypeScript, Vite, Pinia, UnoCSS  
**Status**: Core features built, recently fixed critical bugs, needs testing  
**Live URL**: https://openbuild-j98rf491s-maximgagiev-myg-mediacos-projects.vercel.app

## Current Situation:

1. **What's Done**:
   - Visual drag-drop builder with component library
   - Template system with 9 pre-built designs
   - Asset manager with image uploads
   - Animation system with visual editor
   - Component variations and themes/
   - Custom code injection (CSS/JS)
   - Export to HTML/CSS/JS

2. **Recent Fixes** (just completed):
   - Fixed template loading crash (missing generateId function)
   - Added CSS theme variables
   - Fixed animations
   - Added error handling
   - Improved documentation

3. **What Needs Work**:
   - Comprehensive testing of ALL features
   - Fix any broken functionality found
   - Add loading states and better UX
   - Optimize performance (large bundle size)
   - Improve mobile experience

## Key Files Structure:
```
src/
├── App.vue                    # Main layout
├── components/
│   ├── Canvas/               # Design canvas
│   ├── Editor/              # Property editors
│   ├── Templates/           # Template library
│   └── Assets/              # Asset manager
├── stores/                   # Pinia state
├── services/                # Business logic
└── data/templates/          # Template definitions
```

## Known Issues:
1. **Unsplash API** needs keys in .env file
2. **Component Variations** UI unclear
3. **Animation scroll triggers** may have bugs
4. **Custom code export** untested
5. **Bundle size** too large (600KB+)

## Testing Checklist:
There's a TEST_CHECKLIST.md file with all features to test. Priority is making sure everything actually works before adding new features.

## Development Commands:
```bash
npm install          # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
git add . && git commit -m "message" && git push origin main  # Deploy
```

## Important Notes:
- Vercel auto-deploys when you push to GitHub
- Write clean, simple code (no over-engineering)
- Test everything on mobile too
- When committing, write messages as if I (the user) wrote the code
- Don't create new files unless absolutely necessary

## My Current Need:
[Describe what you need help with - e.g., "Test all features and fix what's broken", "Add loading states", "Optimize performance", etc.]

## Additional Context:
- The PROJECT_CONTEXT.md file has complete technical details
- The BUG_ANALYSIS.md file lists known issues
- The TEST_CHECKLIST.md has all features to verify

---

## 🎯 For Maximum Efficiency, Also Mention:

1. **Your specific goal** - What do you want to accomplish?
2. **Your skill level** - Are you technical or need simple explanations?
3. **Time constraints** - Quick fix or thorough overhaul?
4. **Priority focus** - Functionality, performance, or new features?

## 📁 Key Context Files in Project:

- **PROJECT_CONTEXT.md** - Complete technical documentation
- **TEST_CHECKLIST.md** - All features to test
- **BUG_ANALYSIS.md** - Known issues and fixes
- **FIXES_IMPLEMENTED.md** - Recent changes made

## 🔧 Common Starting Points:

### If you want to test and fix:
"I need you to go through the TEST_CHECKLIST.md and fix any features that don't work properly. Start with the most critical user-facing features."

### If you want to add features:
"All current features should work first. Once verified, I want to add [specific feature]. Check PROJECT_CONTEXT.md for architecture."

### If you want to optimize:
"The bundle size is too large and performance isn't great. Help me implement code splitting and optimize the build."

### If you want to improve UX:
"Add loading states, error messages, and smooth transitions throughout the app. Make it feel professional."

## ⚡ Quick Test Script:

```bash
# 1. Clone and setup
cd /path/to/openbuild
npm install

# 2. Create .env for APIs
echo "VITE_UNSPLASH_KEY=your-key-here" > .env

# 3. Start development
npm run dev

# 4. Open http://localhost:5173
# 5. Test each feature from TEST_CHECKLIST.md
# 6. Fix issues as you find them
# 7. Commit and push to deploy
```

Remember: The app is LIVE. Users can access it. Make sure changes don't break existing functionality!