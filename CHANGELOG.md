# 📝 Changelog

## Latest Updates

### Admin Task Editing - January 2026

#### 🎯 Admin View - Task Management
- **NEW**: Edit task titles directly from admin panel
- **NEW**: Update task descriptions
- **NEW**: Change task due dates (datetime picker)
- **NEW**: Inline editor for each task with save/cancel
- **NEW**: Task changes logged in audit trail
- **NEW**: Changes apply to all teams automatically
- **IMPROVED**: 2-column layout (Lock Controls | Task Editor)

### UI Improvements - January 2026

#### 🏠 Home Page - Live Dashboard
- **NEW**: Full-screen race track view on home page (no login required)
- **NEW**: Auto-refresh every 5 seconds for live updates
- **NEW**: Live statistics dashboard (Total Teams, Finished, Average Progress)
- **NEW**: Optimized for 1920x1080 venue displays
- **NEW**: Public view for spectators and displays

#### 👥 Team View - Focused Interface  
- **IMPROVED**: Removed full race track from team page (reduces duplication)
- **IMPROVED**: Removed leaderboard from team page (cleaner interface)
- **NEW**: Prominent ranking display showing current position
- **NEW**: Clean 2-column layout with team info and stats
- **NEW**: Quick link to Live Dashboard to view all teams
- **IMPROVED**: More focused on individual team's progress
- **IMPROVED**: Larger progress indicators and rank display

#### 🎨 Team Customization
- **NEW**: Icon picker with 60+ emoji options
- **NEW**: Inline team name editor
- **NEW**: 6 icon categories (Horses, Animals, Birds, Mythical, Tech, Food)
- **NEW**: Visual icon selection grid
- **NEW**: Changes reflected across all views instantly

#### 🔐 Authentication  
- **NEW**: Team login system (20 unique credentials)
- **NEW**: Username format: `team1` to `team20`
- **NEW**: Password format: `hackathon2026-1` to `hackathon2026-20`
- **NEW**: Admin login remains `hackathon2026`
- **NEW**: Session persistence with logout capability

## Feature Summary

### Public Features (No Login)
- ✅ Live race track with all 20 teams
- ✅ Real-time rankings and progress
- ✅ Auto-refresh every 5 seconds
- ✅ Full statistics dashboard
- ✅ Optimized for venue displays

### Team Features (Login Required)
- ✅ Custom team icons (60+ options)
- ✅ Editable team names
- ✅ Task completion tracking
- ✅ Notes management
- ✅ Evidence links manager
- ✅ Current ranking display
- ✅ Progress visualization
- ✅ Logout capability

### Admin Features (Password Protected)
- ✅ Monitor all 20 teams
- ✅ View full race track
- ✅ **Edit task details** (name, description, due date)
- ✅ Lock/unlock tasks globally
- ✅ Undo team actions
- ✅ Reset teams completely
- ✅ View complete audit trail
- ✅ Edit any team's data

## Technical Improvements

### Performance
- Auto-refresh mechanism (5-second intervals)
- Optimized rendering for 20 teams
- Smooth CSS transitions for horse movements
- Efficient state management with Zustand

### UI/UX
- Responsive design (mobile to 1920x1080)
- Fullscreen mode support (F11)
- Clean separation of concerns (public vs team vs admin)
- Reduced duplication across views
- Focus on relevant information per role

### Architecture
- Centralized authentication module (`lib/auth.ts`)
- 60+ icon library in TeamIconPicker
- Separate display mode documentation
- Team credentials reference sheet
- Feature documentation (`FEATURES.md`)

## Migration Notes

### v1.0 → v1.1 (Current)
- **Breaking**: Home page now shows live dashboard instead of landing cards
- **Breaking**: Team view no longer shows full race track
- **Change**: "Back to Home" now says "Back to Live Dashboard"
- **New**: Team authentication required for editing
- **New**: Icon and name customization features
- **Enhancement**: Better mobile responsiveness
- **Enhancement**: Venue display optimization

## Known Limitations (v1)

- ⚠️ Client-side authentication (not production-ready)
- ⚠️ localStorage persistence (single browser only)
- ⚠️ No real-time sync between browsers
- ⚠️ No database backend (TODO for v2)
- ⚠️ No file uploads (links only)

## Roadmap (v2)

### Planned Features
- [ ] Real backend with database (PostgreSQL/MongoDB)
- [ ] Real authentication (JWT/OAuth)
- [ ] Real-time sync via WebSockets
- [ ] File upload support for evidence
- [ ] Email notifications
- [ ] Export data to CSV/JSON
- [ ] Multi-event support
- [ ] Custom milestone configuration
- [ ] Team chat/messaging
- [ ] Mobile app

### Under Consideration
- [ ] Dark mode
- [ ] Accessibility improvements (ARIA labels, keyboard nav)
- [ ] Internationalization (i18n)
- [ ] Performance analytics
- [ ] Integration with GitHub/GitLab
- [ ] Slack/Discord webhooks
- [ ] Video chat integration
- [ ] QR code check-ins

## Contributors

Built with ❤️ for hackathon organizers and participants.

---

**Current Version**: v1.1 (Display Mode Update)
**Last Updated**: January 2026
