# 🔐 Login Credentials Reference

## Team Credentials

Each of the 20 teams has their own unique login credentials:

| Team # | Username | Password | Team Name |
|--------|----------|----------|-----------|
| 1 | `team1` | `hackathon2026-1` | Code Ninjas |
| 2 | `team2` | `hackathon2026-2` | Bug Busters |
| 3 | `team3` | `hackathon2026-3` | Syntax Samurai |
| 4 | `team4` | `hackathon2026-4` | Pixel Pioneers |
| 5 | `team5` | `hackathon2026-5` | Data Dragons |
| 6 | `team6` | `hackathon2026-6` | Cloud Crusaders |
| 7 | `team7` | `hackathon2026-7` | Binary Bandits |
| 8 | `team8` | `hackathon2026-8` | Algorithm Avengers |
| 9 | `team9` | `hackathon2026-9` | Dev Dynamos |
| 10 | `team10` | `hackathon2026-10` | Hack Heroes |
| 11 | `team11` | `hackathon2026-11` | Stack Smashers |
| 12 | `team12` | `hackathon2026-12` | Logic Legends |
| 13 | `team13` | `hackathon2026-13` | Byte Brawlers |
| 14 | `team14` | `hackathon2026-14` | Script Soldiers |
| 15 | `team15` | `hackathon2026-15` | Tech Titans |
| 16 | `team16` | `hackathon2026-16` | Cyber Cyclones |
| 17 | `team17` | `hackathon2026-17` | Digital Dreamers |
| 18 | `team18` | `hackathon2026-18` | Quantum Questers |
| 19 | `team19` | `hackathon2026-19` | Code Commanders |
| 20 | `team20` | `hackathon2026-20` | Web Wizards |

## Admin Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | *(no username)* | `hackathon2026` |

## Quick Copy-Paste Examples

```
# Team 1
Username: team1
Password: hackathon2026-1

# Team 5
Username: team5
Password: hackathon2026-5

# Team 10
Username: team10
Password: hackathon2026-10

# Admin
Password: hackathon2026
```

## Important Notes

- ✅ All usernames are lowercase
- ✅ The team number in username and password must match
- ✅ Passwords are case-sensitive
- ✅ Each team can only access their own dashboard
- ✅ Admin can access all teams
- ⚠️ This is a v1 implementation - replace with real auth for production

## Distributing Credentials

### Option 1: Print This Sheet
Print this document and distribute to each team at the start of the hackathon.

### Option 2: Email/Slack
Send each team their specific credentials:

```
Hi Code Ninjas (Team 1)!

Your hackathon dashboard credentials:
Username: team1
Password: hackathon2026-1

Access the dashboard at: http://localhost:3000/team
```

### Option 3: Display on Screen
Project the credentials table on a screen for teams to reference.

## Security Reminders

1. 🔒 Each team should logout when not using the dashboard
2. 🔒 Don't share your credentials with other teams
3. 🔒 Admin credentials should only be shared with organizers
4. 🔒 Change default passwords if deploying publicly

## Resetting Sessions

If a team is having login issues:

1. Open browser DevTools (F12)
2. Go to Application → Storage → Session Storage
3. Clear the `team-auth` entry
4. Refresh and login again

---

**Need to change credentials?** Edit `lib/seed.ts` (teams) or `lib/auth.ts` (admin).
