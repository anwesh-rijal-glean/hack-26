# 🏁 Glean SE Hackathon 2026 - Live Tracker

A real-time hackathon progress tracker built with Next.js, TypeScript, and Supabase. Track team progress, manage tasks, and judge final presentations all in one place.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

---

## ✨ Features

### 🏇 Real-Time Racetrack Dashboard
- Live progress visualization with custom team icons
- Auto-refreshes every 10 seconds
- Optimized for 1920x1080 display
- Perfect for venue displays (F11 for fullscreen)

### 👥 Team Portal
- Secure team login
- Task checklist (10 milestones)
- Custom team names and icons
- Progress tracking

### ⚖️ Judge Portal
- Scorecard system for finalists
- Dynamic rubric (6 criteria, 100 points total)
- Real-time score aggregation
- Edit and resubmit before final

### 👑 Admin Dashboard
- Task management (lock/unlock, edit)
- Team oversight
- Finalist selection
- Audit log
- Database reset

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works!)

### 1. Clone and Install
```bash
git clone <your-repo>
cd hackathon
npm install
```

### 2. Set Up Database
1. Create a [Supabase](https://supabase.com) project
2. Run `supabase/schema.sql` in SQL Editor
3. Run `supabase/init_all_tables.sql` to populate seed data
4. Get your API credentials

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for detailed instructions.

### 3. Configure Environment
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
hackathon/
├── app/                    # Next.js app router
│   ├── page.tsx           # Home page (racetrack)
│   ├── team/              # Team portal
│   ├── judge/             # Judge portal
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Core logic
│   ├── auth.ts           # Authentication
│   ├── db.ts             # Database layer
│   ├── store.ts          # Zustand state management
│   ├── types.ts          # TypeScript types
│   └── seed.ts           # Seed data & credentials
├── supabase/             # Database scripts
│   ├── schema.sql        # Database schema
│   └── init_all_tables.sql # Seed data
└── docs/                 # Documentation
```

---

## 🔐 Default Credentials

See **[CREDENTIALS.md](./CREDENTIALS.md)** for all login credentials.

**Quick Access:**
- **Admin:** Password `hackathon2026`
- **Teams:** Username `team1` to `team20`, Password `hackathon2026-1` to `hackathon2026-20`
- **Judges:** Username `judge1` to `judge5`, Password `hackathon2026-j1` to `hackathon2026-j5`

---

## 🎨 Color Theme

- **Primary Blue:** `#343CED`
- **Oatmeal:** `#F6F3EB`
- **Bright Green:** `#D8FD49` (used sparingly)
- **Black & White**

---

## 📝 Documentation

| File | Description |
|------|-------------|
| **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** | Complete database setup guide |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Deploy to Vercel guide |
| **[CREDENTIALS.md](./CREDENTIALS.md)** | All login credentials |
| **[FEATURES.md](./FEATURES.md)** | Detailed feature list |
| **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** | QA test checklist |
| **[docs/](./docs/)** | Additional documentation |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Supabase PostgreSQL
- **State Management:** Zustand
- **Styling:** Tailwind CSS
- **UI Components:** Custom + lucide-react icons
- **Deployment:** Vercel

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Set environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-prod-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-prod-key>
   ```
4. Deploy!

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

---

## 🧪 Testing

Run the full test checklist:
```bash
npm run build  # Check for build errors
npm start      # Test production build
```

See **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** for comprehensive tests.

---

## 📊 Database Schema

**Tables:**
- `teams` - Team information and progress
- `tasks` - Hackathon milestones
- `scorecards` - Judge scores
- `rubric` - Judging criteria
- `finalist_teams` - Selected finalists
- `audit_log` - Activity history

**Auto-managed:**
- Timestamps with `updated_at` triggers
- Referential integrity
- Default values

---

## 🔄 Data Flow

```
User Action → Optimistic UI Update → API Call → Database → Real-time Refresh
```

- **Client:** Zustand store (in-memory)
- **Server:** Next.js API routes
- **Database:** Supabase PostgreSQL
- **Refresh:** 10-second polling + focus/visibility triggers

---

## 🐛 Troubleshooting

### Database Connection Error
1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Restart dev server: `npm run dev`

### Data Not Updating
1. Hard refresh: `Shift + F5`
2. Check browser console for errors
3. Verify database has data in Supabase dashboard

### Build Errors
1. Run `npm run build` to see detailed errors
2. Check all TypeScript files for type errors
3. Verify all imports are correct

See **[docs/archive/](./docs/archive/)** for historical debugging guides.

---

## 📈 Performance

- **Auto-refresh:** 10 seconds
- **Build size:** ~1.5MB (optimized)
- **Database queries:** Optimized with indexes
- **Cache:** Aggressive no-cache headers

---

## 🤝 Contributing

1. Follow existing code style
2. Use TypeScript strict mode
3. Test all changes locally
4. Update documentation

---

## 📜 License

MIT License - See LICENSE file for details

---

## 👥 Team

Built for Glean SE Hackathon 2026

- **Slack:** `#gko-fy2027-se-hackathon`
- **Drive:** [Shared Folder](https://drive.google.com/drive/folders/1NUEZn-Psh5vtgJSdgXtPr6IIabaTlF6i)

---

## 🎉 Acknowledgments

- Glean team for the amazing hackathon
- Next.js team for the fantastic framework
- Supabase for the database platform

---

**Built with ❤️ for Glean SE Hackathon 2026**
