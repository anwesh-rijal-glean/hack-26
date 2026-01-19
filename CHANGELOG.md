# 📝 Changelog

## [2.0.0] - 2026-01-18

### Major Refactoring
- ✅ **Real-time data updates** - Fixed React 18 useEffect bug, implemented 10-second polling
- ✅ **Removed links & notes** - Teams now use Slack (#gko-fy2027-se-hackathon) and Google Drive
- ✅ **Cleaned up codebase** - Removed 500+ lines of unused code, consolidated documentation

### Features
- ✅ Auto-refresh every 10 seconds on home page
- ✅ Optimistic UI updates with error handling and revert
- ✅ Enhanced team icons (50+ options including nerdy themes)
- ✅ Dynamic finalist selection in admin panel

### Database
- ✅ Migrated to Supabase PostgreSQL
- ✅ Removed `links` and `notes` columns
- ✅ Added `last_updated_by` tracking
- ✅ Added `due_date` and `points` to tasks

### Documentation
- ✅ Consolidated 25+ docs into 8 essential files
- ✅ Created archive folder for historical docs
- ✅ Updated README with complete setup guide

---

## [1.5.0] - 2026-01-17

### Features
- Added judge portal with scorecard system
- Dynamic rubric management (6 criteria, 100 points)
- Finalist team selection in admin
- Task locking functionality

### Improvements
- Updated color theme to Glean branding (Primary Blue #343CED)
- Better UI for team and admin panels
- Added audit log for all actions

---

## [1.0.0] - 2026-01-15

### Initial Release
- Real-time racetrack dashboard
- Team portal with task checklist
- Admin dashboard
- Client-side authentication
- Supabase PostgreSQL integration

---

## Migration History

### localStorage → Vercel Postgres → In-Memory → Vercel Blob → Supabase
The app went through multiple data persistence iterations before settling on Supabase PostgreSQL for production use.

See `docs/archive/` for detailed migration history.
