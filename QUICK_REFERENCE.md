# 🎯 Quick Reference Card

## 🚀 Get Started in 30 Seconds

```bash
npm install
npm run dev
# Open http://localhost:3000 for live race track
# Press F11 for fullscreen venue display
```

## 🔑 Important Info

| Item | Value |
|------|-------|
| **Team Usernames** | `team1` to `team20` |
| **Team Passwords** | `hackathon2026-1` to `hackathon2026-20` |
| **Admin Password** | `hackathon2026` |
| **Total Teams** | 20 |
| **Total Tasks** | 10 |
| **Data Storage** | Browser localStorage |
| **Port** | 3000 |

## 🎮 User Actions

### Live Dashboard (Home - No Login)
| Action | How To |
|--------|--------|
| View race | Open http://localhost:3000 |
| Fullscreen | Press F11 |
| Live updates | Refresh page to see latest changes |
| See stats | Top bar shows key metrics |
| View leaderboard | Right sidebar shows all 20 teams |

### Team View
| Action | How To |
|--------|--------|
| Login | Use `team1-20` and `hackathon2026-1-20` |
| Logout | Click "Logout" button in header |
| See ranking | Displayed prominently on your dashboard |
| Change team icon | Click current icon to open picker with 60+ options |
| Edit team name | Click pencil icon next to team name |
| Complete task | Check the checkbox |
| Add notes | Type and click "Save Notes" |
| Add link | Fill form and click "Add Link" |
| Remove link | Click trash icon |
| View race track | Click "Back to Live Dashboard" or visit home page |

### Admin View
| Action | How To |
|--------|--------|
| Login | Password: `hackathon2026` |
| Logout | Click "Logout" in header |
| Edit task | Click edit (✏️) icon on task in "Edit Tasks" panel |
| Update task details | Edit title, description, or due date, then save |
| Lock task | Click "Unlocked" button in "Task Lock Controls" |
| Unlock task | Click "Locked" button in "Task Lock Controls" |
| View team | Click "View" in team row |
| Undo action | Click "Undo" in team row |
| Reset team | Click "Reset" and confirm |
| Edit team | Click "View" then edit in drawer |

## 📊 Understanding the Race Track

```
[Start] ━━━━━━━━━━━━━━━━━━━━━ [Finish]
   0     1   2   3   4   5   6   7   8   9   10

Each checkpoint = 1 completed task
Horse position = number of tasks completed
```

## 🏆 Ranking System

1. **Primary**: Most tasks completed wins
2. **Tiebreaker**: First to reach that level wins

Example: Team A and Team B both have 5/10 tasks done, but Team A completed their 5th task at 2:00 PM and Team B at 2:30 PM → Team A ranks higher

## 🎨 Color Codes

| Color | Meaning |
|-------|---------|
| 🟢 Green | Completed task |
| 🟡 Yellow | Locked task (admin only) |
| 🔵 Blue | Active/in progress |
| 🔴 Red | Destructive action |
| 🟣 Purple | Admin features |

## 🔒 Task Locking

| State | Team Can Edit | Admin Can Edit |
|-------|---------------|----------------|
| Unlocked | ✅ Yes | ✅ Yes |
| Locked | ❌ No | ✅ Yes |

## 📝 Audit Log Actions

| Action | Description | Undoable |
|--------|-------------|----------|
| `TOGGLE_TASK` | Checked/unchecked a task | ✅ Yes |
| `EDIT_NOTES` | Changed team notes | ✅ Yes |
| `ADD_LINK` | Added evidence link | ✅ Yes |
| `REMOVE_LINK` | Removed evidence link | ✅ Yes |
| `LOCK_TASK` | Admin locked a task | ❌ No |
| `UNLOCK_TASK` | Admin unlocked a task | ❌ No |
| `RESET_TEAM` | Admin reset team completely | ❌ No |
| `UNDO` | Admin undid last action | ❌ No |

## 🐛 Quick Fixes

### Problem: Team can't check task
**Solution**: Task is locked → Admin must unlock it

### Problem: Data disappeared
**Solution**: localStorage was cleared → Normal, data resets to defaults

### Problem: Admin password not working
**Solution**: It's case-sensitive → Use lowercase `hackathon2026`

### Problem: Changes not saving
**Solution**: Check browser console for errors → Try refreshing page

### Problem: Confetti not showing
**Solution**: Already shown once → Uncheck a task then re-check to see again

## 📱 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between fields |
| `Enter` | Submit forms |
| `Esc` | Close modals (future feature) |

## 🎯 Best Practices

### For Teams
- ✅ Check tasks immediately after completion
- ✅ Add descriptive notes about your progress
- ✅ Include links to GitHub, demos, and docs
- ✅ Check the leaderboard frequently
- ❌ Don't wait until the end to update

### For Admins
- ✅ Lock tasks that shouldn't be editable yet
- ✅ Monitor the audit log for suspicious activity
- ✅ Use "Undo" instead of manual edits when possible
- ✅ Reset teams only as a last resort
- ❌ Don't lock all tasks at once
- ❌ Don't reset teams without confirmation

## 📊 Data Structure

### Team Progress Array
```typescript
progress: [true, true, false, false, false, false, false, false, false, false]
// ↑ Completed tasks: 2/10
// Position on track: 2
```

### Links Format
```typescript
{
  id: "abc123",
  label: "Demo Video",
  url: "https://youtube.com/..."
}
```

## 🔧 Customization Quick Links

| What | Where | Line |
|------|-------|------|
| Team names | `lib/seed.ts` | 52-73 |
| Team emojis | `lib/seed.ts` | 75-79 |
| Team colors | `lib/seed.ts` | 81-85 |
| Task list | `lib/seed.ts` | 4-50 |
| Admin password | `components/AdminPasswordGate.tsx` | 6 |

## 🌐 URLs

| View | URL | Login Required |
|------|-----|----------------|
| Live Dashboard | `http://localhost:3000/` | ❌ No (Public) |
| Team View | `http://localhost:3000/team` | ✅ Yes (Team) |
| Admin View | `http://localhost:3000/admin` | ✅ Yes (Admin) |

## 💾 Data Reset

### Clear Everything
1. Open DevTools (F12)
2. Go to Application tab
3. Storage → Local Storage → localhost:3000
4. Right-click → Clear
5. Refresh page

### Clear Admin Session
1. Open DevTools (F12)
2. Go to Application tab
3. Storage → Session Storage → localhost:3000
4. Delete `admin-authed`
5. Refresh page

## 🎉 Fun Features

- 🎊 **Confetti**: Triggers when a team completes all 10 tasks
- 🏇 **Smooth Animations**: Horses glide across the track
- 🔔 **Toast Notifications**: Confirm every action
- 🏆 **Live Leaderboard**: Updates in real-time
- 🎨 **Color-Coded Teams**: Each team has unique color

## 📞 Need Help?

1. Check the main README.md
2. Check PROJECT_STRUCTURE.md for architecture
3. Check browser console for errors
4. Clear localStorage and try again
5. Restart dev server

---

**Pro Tip**: Keep this reference open while using the app! 💡

