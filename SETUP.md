# 🚀 Quick Setup Guide

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

or if you prefer pnpm:

```bash
pnpm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### 3. Access the Application

- **Landing Page**: http://localhost:3000
- **Team View**: http://localhost:3000/team
- **Admin View**: http://localhost:3000/admin (password: `hackathon2026`)

## First Time Setup

### For Teams
1. Navigate to Team View
2. Login with your team credentials:
   - **Username**: `team1` to `team20` (e.g., `team5`)
   - **Password**: `hackathon2026-1` to `hackathon2026-20` (e.g., `hackathon2026-5`)
3. Start checking off tasks as you complete them!

**Example Team Logins:**
- Team 1: username `team1`, password `hackathon2026-1`
- Team 5: username `team5`, password `hackathon2026-5`
- Team 20: username `team20`, password `hackathon2026-20`

### For Admins
1. Navigate to Admin View
2. Enter password: `hackathon2026`
3. You'll see the full dashboard with all team controls

## Data Persistence

All data is stored in browser localStorage. To reset:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear localStorage
4. Refresh the page

## Pre-configured Data

### Teams (20)
- Code Ninjas 🐎
- Bug Busters 🏇
- Syntax Samurai 🦄
- Pixel Pioneers 🐴
- Data Dragons 🎠
- ... and 15 more!

### Tasks (10)
1. Team Registration
2. Project Proposal
3. Initial Prototype
4. Core Features
5. UI/UX Polish
6. Testing & Debugging
7. Documentation
8. Demo Video
9. Presentation Slides
10. Final Submission

## Customization

### Change Team Names
Edit `lib/seed.ts` - modify `TEAM_NAMES`, `HORSE_ICONS`, and `COLORS` arrays

### Modify Tasks
Edit `lib/seed.ts` - update `INITIAL_TASKS` array

### Change Admin Password
Edit `components/AdminPasswordGate.tsx` - change `ADMIN_PASSWORD` constant

## Build for Production

```bash
npm run build
npm start
```

## Troubleshooting

**Problem**: Can't login as team
- **Solution**: Make sure you're using the correct format: username `team1` (not Team1), password `hackathon2026-1`

**Problem**: Teams not loading
- **Solution**: Clear localStorage and refresh, then login again

**Problem**: Can't check off tasks
- **Solution**: Check if task is locked (admin can unlock)

**Problem**: Admin password not working
- **Solution**: Make sure you're using `hackathon2026` (all lowercase)

## Support

Check the main README.md for detailed documentation and architecture information.

---

Happy Hacking! 🎉

