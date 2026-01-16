# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Next.js App                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │  Landing   │  │   Team     │  │   Admin    │     │  │
│  │  │   Page     │  │   View     │  │   View     │     │  │
│  │  └─────┬──────┘  └──────┬─────┘  └──────┬─────┘     │  │
│  │        │                │                │            │  │
│  │        └────────────────┴────────────────┘            │  │
│  │                         │                             │  │
│  │                         ▼                             │  │
│  │              ┌─────────────────────┐                  │  │
│  │              │  React Components   │                  │  │
│  │              │  - Racetrack        │                  │  │
│  │              │  - TaskChecklist    │                  │  │
│  │              │  - AdminTable       │                  │  │
│  │              │  - etc.             │                  │  │
│  │              └──────────┬──────────┘                  │  │
│  │                         │                             │  │
│  │                         ▼                             │  │
│  │              ┌─────────────────────┐                  │  │
│  │              │   Zustand Store     │                  │  │
│  │              │  - teams[]          │                  │  │
│  │              │  - tasks[]          │                  │  │
│  │              │  - auditLog[]       │                  │  │
│  │              │  - actions()        │                  │  │
│  │              └──────────┬──────────┘                  │  │
│  │                         │                             │  │
│  │                         ▼                             │  │
│  │              ┌─────────────────────┐                  │  │
│  │              │   localStorage      │                  │  │
│  │              │   (Persistence)     │                  │  │
│  │              └─────────────────────┘                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Landing Page (/)
│   ├── Hero Section
│   ├── Team View Card (Link)
│   └── Admin View Card (Link)
│
├── Team View (/team)
│   ├── ToastProvider
│   │   └── TeamViewContent
│   │       ├── Header + Back Button
│   │       ├── TeamSelector
│   │       ├── Racetrack
│   │       │   ├── Track Lanes (20)
│   │       │   └── Leaderboard Sidebar
│   │       └── Team Progress Card
│   │           ├── Progress Bar
│   │           ├── TaskChecklist (10 tasks)
│   │           ├── Notes Textarea
│   │           └── LinksManager
│   │               ├── Existing Links List
│   │               └── Add Link Form
│   └── Toast Notifications
│
└── Admin View (/admin)
    ├── ToastProvider
    │   └── AdminViewContent
    │       ├── AdminPasswordGate (conditional)
    │       ├── Header + Logout Button
    │       ├── Racetrack
    │       ├── Stats Cards (3)
    │       ├── TaskLockControls
    │       ├── AdminTable
    │       └── TeamDetailDrawer (conditional)
    │           ├── Team Header
    │           ├── TaskChecklist (editable)
    │           ├── Notes Editor
    │           ├── LinksManager
    │           └── AuditLog
    └── Toast Notifications
```

## Data Flow Diagrams

### Team Action Flow

```
User Clicks Checkbox
        ↓
Component Handler
        ↓
store.toggleTask(teamId, taskIndex, actor)
        ↓
Zustand Store
├── Update team.progress[taskIndex]
├── Update team.updatedAt
├── Update team.lastUpdatedBy
├── Create AuditEvent
└── Trigger re-render
        ↓
localStorage Middleware
        ↓
Persist to localStorage
        ↓
UI Updates
├── Checkbox state changes
├── Progress bar animates
├── Racetrack horse moves
├── Leaderboard re-ranks
└── Toast notification shows
```

### Admin Undo Flow

```
Admin Clicks "Undo"
        ↓
store.undoLast(teamId, actor)
        ↓
Find last undoable action for team
        ↓
Switch on action type
├── TOGGLE_TASK → Revert checkbox
├── EDIT_NOTES → Restore old notes
├── ADD_LINK → Remove link
└── REMOVE_LINK → Re-add link
        ↓
Update team data
        ↓
Create UNDO audit event
        ↓
Persist to localStorage
        ↓
UI updates everywhere
```

## State Management

### Zustand Store Schema

```typescript
{
  // State
  teams: Team[20],      // 20 teams with progress
  tasks: Task[10],      // 10 milestones
  auditLog: AuditEvent[], // All changes
  
  // Actions
  toggleTask(teamId, taskIndex, actor)
  setNotes(teamId, notes, actor)
  addLink(teamId, link, actor)
  removeLink(teamId, linkId, actor)
  lockTask(taskId, locked, actor)
  resetTeam(teamId, actor)
  undoLast(teamId, actor)
  initializeStore()
}
```

### localStorage Structure

```json
{
  "hackathon-racetrack-storage": {
    "state": {
      "teams": [...],
      "tasks": [...],
      "auditLog": [...]
    },
    "version": 0
  }
}
```

### sessionStorage Structure

```json
{
  "admin-authed": "true"
}
```

## Authentication Flow

### Team Authentication

```
Team View (Login Required)
└── Enter username and password
    └── Client-side check: TEAM_USERS array lookup
        ├── Success → Store user in sessionStorage
        │            → Load team dashboard
        │            → Only show logged-in team's data
        └── Failure → Show error message

Team Login Example:
Username: team5
Password: hackathon2026-5
→ Authenticated as Code Dragons (team-5)
→ Can only edit team-5's data
```

### Admin Authentication

```
Admin View (Password Gate)
└── Enter password
    └── Client-side check: password === "hackathon2026"
        ├── Success → Store in sessionStorage
        │            → Render admin dashboard
        │            → Can edit all teams
        └── Failure → Show error message
```

### Session Management

```typescript
// Team session
{
  username: "team5",
  teamId: "team-5",
  type: "team"
}

// Admin session
{
  username: "admin",
  teamId: "admin",
  type: "admin"
}

// Stored in sessionStorage (cleared on browser close)
```

## Race Track Visualization

```
Lane 0: 🐎───────────────────────────────────────→ [3/10]
Lane 1: 🏇──────────────────────────────────────→ [2/10]
Lane 2: 🦄─────────────────────────────────────────────→ [7/10]
Lane 3: 🐴────────────────────────────────────────────────→ [8/10]
Lane 4: 🎠──→ [1/10]
...
```

### Position Calculation

```javascript
tasksCompleted = progress.filter(Boolean).length  // 0-10
positionPercent = (tasksCompleted / 10) * 100     // 0%-100%
transform = `translateX(${positionPercent}%)`     // CSS
```

## Ranking Algorithm

```javascript
teams.sort((a, b) => {
  const aCompleted = getTasksCompleted(a.progress)
  const bCompleted = getTasksCompleted(b.progress)
  
  // Primary sort: more tasks = better
  if (aCompleted !== bCompleted) {
    return bCompleted - aCompleted
  }
  
  // Tiebreaker: earlier timestamp = better
  return new Date(a.updatedAt) - new Date(b.updatedAt)
})
```

## Audit System

### Event Creation

```javascript
createAuditEvent(action, actor, teamId, payload) {
  return {
    id: generateId(),
    ts: new Date().toISOString(),
    actor: { type: "team" | "admin", id: "..." },
    action: "TOGGLE_TASK" | "EDIT_NOTES" | ...,
    teamId: "team-1",
    payload: { /* action-specific data */ }
  }
}
```

### Undoable Actions

- ✅ TOGGLE_TASK - Reverse boolean
- ✅ EDIT_NOTES - Restore previous notes
- ✅ ADD_LINK - Remove the link
- ✅ REMOVE_LINK - Re-add the link
- ❌ LOCK_TASK - Admin-only, not undoable
- ❌ RESET_TEAM - Destructive, not undoable
- ❌ UNDO - Meta action, not undoable

## Performance Characteristics

### Current Scale 1
- **Teams**: 20
- **Tasks per team**: 10
- **Total checkboxes**: 200
- **Audit events**: Unbounded (grows over time)

### Render Performance
- Initial render: ~50ms
- State update: ~10ms
- Horse animation: 800ms CSS transition
- Confetti: ~2s animation

### Storage Size
- Empty state: ~2KB
- With 100 audit events: ~50KB
- localStorage limit: ~5-10MB (plenty of room)

## Future Architecture (v2)

```
┌─────────────────────────────────────────────────────┐
│                     Browser                          │
│  ┌────────────────────────────────────────────────┐ │
│  │              Next.js Frontend                   │ │
│  │  (Same component structure)                     │ │
│  └──────────────────┬─────────────────────────────┘ │
└─────────────────────┼───────────────────────────────┘
                      │ HTTP/WebSocket
                      ▼
┌─────────────────────────────────────────────────────┐
│                 Backend Server                       │
│  ┌────────────────────────────────────────────────┐ │
│  │              Next.js API Routes                 │ │
│  │   /api/teams                                    │ │
│  │   /api/tasks                                    │ │
│  │   /api/auth                                     │ │
│  │   /api/audit                                    │ │
│  └──────────────────┬─────────────────────────────┘ │
│                     │                                │
│                     ▼                                │
│  ┌────────────────────────────────────────────────┐ │
│  │         PostgreSQL/MongoDB                      │ │
│  │   - teams table                                 │ │
│  │   - tasks table                                 │ │
│  │   - audit_log table                             │ │
│  │   - users table                                 │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Security Model (Current vs Future)

### Current (v1)
```
Team View
└── No authentication
    └── Trust-based (select your team)
        └── Anyone can edit any team

Admin View
└── Client-side password
    └── Hardcoded in source code
        └── Visible to anyone who views source
```

### Future (v2)
```
Team View
└── JWT authentication
    └── Team assigned to user
        └── Can only edit own team
            └── Backend validates ownership

Admin View
└── OAuth2/SAML
    └── Role-based access control
        └── Backend checks admin role
            └── Audit logs all admin actions
```

## API Design (Future)

```typescript
// GET /api/teams
Response: Team[]

// GET /api/teams/:id
Response: Team

// PATCH /api/teams/:id
Body: { progress?, notes?, links? }
Response: Team

// POST /api/teams/:id/tasks/:taskIndex/toggle
Response: { team: Team, auditEvent: AuditEvent }

// GET /api/audit
Query: { teamId?, limit?, offset? }
Response: AuditEvent[]

// POST /api/auth/login
Body: { username, password }
Response: { token, user }
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Vercel/Netlify                     │
│  ┌────────────────────────────────────────────────┐ │
│  │         Next.js App (Static + SSR)             │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────┐
│                   CDN (Global)                       │
│   - Static assets (JS, CSS, images)                 │
│   - Edge caching                                     │
└─────────────────────────────────────────────────────┘
```

## Technology Choices

### Why Next.js?
- ✅ React framework with App Router
- ✅ File-based routing
- ✅ TypeScript support
- ✅ Built-in optimization
- ✅ Easy deployment (Vercel)

### Why Zustand?
- ✅ Simpler than Redux
- ✅ Less boilerplate
- ✅ Built-in persistence
- ✅ TypeScript friendly
- ✅ Small bundle size (~1KB)

### Why Tailwind?
- ✅ Utility-first CSS
- ✅ Rapid prototyping
- ✅ Consistent design system
- ✅ No CSS file management
- ✅ Responsive by default

### Why localStorage?
- ✅ v1 simplicity (no backend needed)
- ✅ Instant persistence
- ✅ Zero latency
- ❌ Not suitable for production
- ❌ No real-time sync
- ❌ Limited to single browser

## Scalability Considerations

| Dimension | Current | Max Recommended | Solution for More |
|-----------|---------|-----------------|-------------------|
| Teams | 20 | 50 | Virtual scrolling |
| Tasks | 10 | 20 | Pagination |
| Audit Events | Unbounded | 1000 | Pagination + cleanup |
| Concurrent Users | 1 | 1 | Backend + WebSockets |
| Data Size | <100KB | 5MB | Backend database |

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ IE 11 (not supported)

## Mobile Responsive Breakpoints

```css
sm:  640px  /* Mobile landscape */
md:  768px  /* Tablet */
lg:  1024px /* Desktop */
xl:  1280px /* Large desktop */
```

---

Built with modern web technologies for maximum developer experience 🚀

