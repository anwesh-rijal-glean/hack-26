# 📁 Project Structure

## Overview

This document provides a complete overview of the Hackathon Race Track application structure.

## Directory Tree

```
hackathon/
│
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page with view selection
│   ├── layout.tsx                # Root layout with metadata
│   ├── globals.css               # Global styles and Tailwind
│   ├── team/
│   │   └── page.tsx              # Team view page
│   └── admin/
│       └── page.tsx              # Admin dashboard page
│
├── components/                   # React components
│   ├── ui/                       # Basic UI components (shadcn-style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── checkbox.tsx
│   │   ├── select.tsx
│   │   └── toast.tsx            # Toast notification system
│   │
│   ├── Racetrack.tsx            # Main race visualization
│   ├── TeamSelector.tsx         # Team dropdown selector
│   ├── TaskChecklist.tsx        # Task list with checkboxes
│   ├── LinksManager.tsx         # Evidence links manager
│   ├── AdminPasswordGate.tsx    # Admin authentication
│   ├── AdminTable.tsx           # Teams overview table
│   ├── TaskLockControls.tsx     # Task locking interface
│   ├── TeamDetailDrawer.tsx     # Team detail modal/drawer
│   └── AuditLog.tsx             # Audit trail display
│
├── lib/                          # Core logic and utilities
│   ├── store.ts                  # Zustand state management
│   ├── types.ts                  # TypeScript type definitions
│   ├── seed.ts                   # Initial data (20 teams, 10 tasks)
│   └── utils.ts                  # Helper functions
│
├── public/                       # Static assets (auto-created)
│
├── .next/                        # Next.js build output (auto-created)
│
├── node_modules/                 # Dependencies (auto-created)
│
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── next.config.mjs               # Next.js configuration
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .cursorignore                 # Cursor IDE ignore rules
│
├── README.md                     # Main documentation
├── SETUP.md                      # Quick setup guide
└── PROJECT_STRUCTURE.md          # This file
```

## Key Files Explained

### App Directory (`app/`)

#### `app/page.tsx`
- Landing page with two cards: Team View and Admin View
- Initializes the Zustand store on mount
- Beautiful gradient background with hover effects

#### `app/team/page.tsx`
- Team interface for tracking progress
- Features:
  - Team selector dropdown
  - Task checklist with lock indicators
  - Notes editor with save button
  - Links manager for evidence submission
  - Live racetrack visualization
  - Confetti animation on completion
  - Toast notifications

#### `app/admin/page.tsx`
- Admin dashboard for oversight and control
- Features:
  - Password gate (sessionStorage persistence)
  - All teams table with actions
  - Task lock/unlock controls
  - Team detail drawer with full edit access
  - Undo and reset capabilities
  - Live racetrack visualization
  - Stats cards (total teams, completed teams, etc.)

### Components (`components/`)

#### Core Components

**`Racetrack.tsx`**
- Visual representation of the race
- 20 horizontal lanes with progress indicators
- Animated horse positions using CSS transitions
- Leaderboard sidebar with top 10 teams
- Progress bars and rankings

**`TeamSelector.tsx`**
- Simple dropdown to select team
- Shows team emoji and name

**`TaskChecklist.tsx`**
- Displays all 10 tasks
- Checkboxes with completion state
- Lock indicators (🔒)
- Task descriptions and due dates
- Green highlighting for completed tasks

**`LinksManager.tsx`**
- Add/remove evidence links
- Form inputs for label and URL
- List of existing links with external link icons
- Delete buttons for each link

#### Admin Components

**`AdminPasswordGate.tsx`**
- Simple password form
- Shows dev note with password
- Stores auth state in sessionStorage
- TODO note for real authentication

**`AdminTable.tsx`**
- Sortable table of all teams
- Columns: Rank, Team, Progress, Last Updated, Updated By, Actions
- Actions: View, Undo, Reset
- Progress bars in table cells
- Confirmation dialog for reset

**`TaskLockControls.tsx`**
- List of all 10 tasks
- Lock/Unlock buttons
- Visual indicators for locked state

**`TeamDetailDrawer.tsx`**
- Modal overlay with team details
- Full task checklist (admin can edit locked tasks)
- Notes editor
- Links manager
- Audit log display
- Close button

**`AuditLog.tsx`**
- Chronological list of actions
- Color-coded action types
- Actor information (team vs admin)
- Timestamps with relative time
- Payload details for context

#### UI Components (`components/ui/`)

All styled with Tailwind CSS and follow shadcn/ui patterns:
- **button.tsx**: Multiple variants (default, destructive, outline, etc.)
- **input.tsx**: Text input with focus states
- **textarea.tsx**: Multi-line text input
- **checkbox.tsx**: Styled checkbox
- **select.tsx**: Styled dropdown
- **toast.tsx**: Toast notification system with provider

### Library (`lib/`)

#### `store.ts`
- Zustand store with localStorage persistence
- State: teams, tasks, auditLog
- Actions:
  - `toggleTask`: Check/uncheck task (respects locks)
  - `setNotes`: Update team notes
  - `addLink`: Add evidence link
  - `removeLink`: Remove evidence link
  - `lockTask`: Lock/unlock task globally
  - `resetTeam`: Clear all team data
  - `undoLast`: Revert last mutable action
  - `initializeStore`: Initialize with seed data
- All actions create audit events

#### `types.ts`
- TypeScript interfaces for:
  - `Task`: Milestone definition
  - `Team`: Team data and progress
  - `Link`: Evidence link
  - `Actor`: Action performer (team/admin)
  - `AuditEvent`: Change tracking
  - `AppState`: Global state shape

#### `seed.ts`
- `INITIAL_TASKS`: 10 pre-configured milestones
- `INITIAL_TEAMS`: 20 teams with names, emojis, colors
- Used to initialize empty state

#### `utils.ts`
- `cn()`: Tailwind class merger
- `generateId()`: Random ID generator
- `formatTimestamp()`: Relative time formatting
- `getTasksCompleted()`: Count completed tasks
- `getNextMilestone()`: Find next incomplete task

## Data Flow

### Team View Flow
1. User selects team from dropdown
2. State loads from Zustand (persisted in localStorage)
3. User interacts (check task, edit notes, add link)
4. Action dispatched to store
5. Store updates state and creates audit event
6. localStorage automatically persists
7. UI re-renders with new state
8. Toast notification confirms action

### Admin View Flow
1. User enters password
2. Auth state stored in sessionStorage
3. Admin dashboard loads all teams
4. Admin performs action (lock task, undo, reset, etc.)
5. Action dispatched with admin actor
6. State updated and audit event created
7. UI reflects changes across all affected components

### Audit Trail
Every mutable action creates an audit event with:
- Unique ID
- Timestamp
- Actor (team or admin)
- Action type
- Team affected
- Payload (old/new values)

## State Management Philosophy

### Why Zustand?
- Simple API (easier than Redux)
- Built-in persistence middleware
- TypeScript support
- Small bundle size
- No providers needed

### Persistence Strategy
- **v1**: localStorage (client-side only)
- **Future**: Replace with API calls to backend/database
- Store structure is DB-ready (can easily map to tables)

## Styling Approach

### Tailwind CSS
- Utility-first approach
- Custom theme in `tailwind.config.ts`
- CSS variables for colors (light/dark mode ready)
- Responsive breakpoints (sm, md, lg, xl)

### Component Patterns
- Card layouts with shadows and borders
- Gradient backgrounds
- Hover effects and transitions
- Color coding (green=success, red=danger, etc.)

## Performance Considerations

### Current Scale
- 20 teams × 10 tasks = 200 checkboxes
- Manageable with direct rendering
- Zustand efficiently tracks changes

### Future Optimizations
- For 100+ teams: virtualize lists
- For real-time updates: WebSocket connection
- For large audit logs: pagination

## Security Notes

### v1 Limitations
- Password hardcoded (client-side)
- No real authentication
- No authorization checks
- Data in localStorage (accessible via DevTools)

### Production Requirements
- Move auth to backend
- Use JWT or session tokens
- Validate all inputs on server
- Rate limiting on API routes
- Encrypt sensitive data

## Extensibility

### Easy to Add
- More teams (edit `seed.ts`)
- More tasks (edit `seed.ts`)
- Custom team fields (edit `types.ts` and components)
- New action types (add to store and types)

### Requires Refactoring
- Real-time collaboration (need WebSockets)
- Multi-event support (need event context)
- File uploads (need storage service)
- Complex permissions (need permission system)

## Development Workflow

### Local Development
```bash
npm run dev      # Start dev server with hot reload
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Making Changes
1. Edit components or lib files
2. Hot reload shows changes instantly
3. Check browser console for errors
4. Test both Team and Admin views
5. Verify localStorage persistence

### Adding Features
1. Update types if needed (`lib/types.ts`)
2. Add store actions (`lib/store.ts`)
3. Create/update components
4. Add to appropriate page
5. Test audit trail creation

## Testing Strategy (Recommended)

### Unit Tests
- Test store actions in isolation
- Test utility functions
- Test component rendering

### Integration Tests
- Test full Team View flow
- Test Admin actions
- Test audit trail accuracy

### E2E Tests
- Test complete user journeys
- Test cross-browser compatibility
- Test localStorage persistence

## Deployment Checklist

- [ ] Replace hardcoded password
- [ ] Set up environment variables
- [ ] Configure real authentication
- [ ] Set up backend API
- [ ] Choose database (PostgreSQL, MongoDB, etc.)
- [ ] Set up hosting (Vercel, Netlify, AWS, etc.)
- [ ] Configure domain
- [ ] Set up monitoring
- [ ] Add error tracking (Sentry, etc.)
- [ ] Performance optimization
- [ ] Security audit

## Support and Maintenance

### Common Issues
- **State not updating**: Check localStorage, clear if corrupted
- **Admin can't access**: Check sessionStorage, password is case-sensitive
- **Tasks not checking**: Task might be locked, admin can unlock
- **Confetti not showing**: Check browser console, canvas-confetti might be blocked

### Updating Dependencies
```bash
npm outdated     # Check for updates
npm update       # Update all
```

### Backup Data
Export localStorage content from DevTools Application tab if needed.

---

Built with Next.js 14, TypeScript, Tailwind CSS, and Zustand 🚀

