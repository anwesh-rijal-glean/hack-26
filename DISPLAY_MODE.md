# 📺 Display Mode Guide

## Overview

The Hackathon Race Track home page is optimized for **fullscreen venue displays** at 1920x1080 resolution. It provides a public, real-time view of all teams competing without requiring any login.

## Perfect For

- 🖥️ **Venue Displays** - Project on screens at the hackathon venue
- 📺 **Live Streaming** - Stream the competition on YouTube/Twitch
- 👥 **Spectator Viewing** - Let anyone watch the race progress
- 🎪 **Event Atmosphere** - Create excitement by showing live rankings
- 📊 **Progress Monitoring** - Organizers can monitor overall progress

## Setup Instructions

### Quick Setup (Local Network)

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Access from any device:**
   ```
   http://localhost:3000
   ```
   Or from other computers on the network:
   ```
   http://[YOUR-IP]:3000
   ```

3. **Enable fullscreen:**
   - Press **F11** (Windows/Linux)
   - Press **Cmd + Ctrl + F** (Mac)
   - Or click the fullscreen icon if your browser has one

### For Venue Setup

**Option 1: Dedicated Display Computer**
1. Set up a computer near a projector/TV
2. Open Chrome/Firefox in fullscreen mode
3. Navigate to the app URL
4. Let it run - auto-refreshes every 5 seconds

**Option 2: Extended Display**
1. Connect laptop to projector/TV
2. Set as extended display (not mirror)
3. Open browser on the extended screen
4. Drag the race track window to the display
5. Press F11 for fullscreen

**Option 3: Network Display**
1. Deploy the app to a server (Vercel, etc.)
2. Access via URL from any device
3. No local setup needed!

## Screen Resolution

### Optimized For
- **1920x1080** (Full HD) - Primary target
- **1680x1050** - Works great
- **2560x1440** (2K) - Scales nicely
- **3840x2160** (4K) - Also supported

### Layout
- **Top Bar** (80px): Title + Login buttons + Stats
- **Stats Bar** (100px): 4 key metrics
- **Race Track** (Remaining): Full track + leaderboard
- **Footer** (40px): Display tips

## Features

### Auto-Refresh
- Updates every **5 seconds**
- No manual refresh needed
- Shows live progress as teams complete tasks
- Leaderboard re-ranks automatically

### Statistics Display
1. **Total Teams** (Blue) - Shows 20
2. **Teams Finished** (Green) - Count of teams at 10/10
3. **Average Progress** (Orange) - Percentage across all teams
4. **Total Milestones** (Purple) - Shows 10

### Race Track View
- **20 Lanes** - One per team with colored tracks
- **11 Positions** - Start + 10 checkpoints + Finish
- **Animated Horses** - Smooth transitions when progress updates
- **Rank Badges** - 🥇🥈🥉 for top 3, numbers for rest

### Leaderboard
- **All 20 Teams** - Scrollable if needed
- **Real-time Rankings** - Sorted by progress + timestamp
- **Progress Bars** - Visual representation of completion
- **Highlighted Top 3** - Gold, silver, bronze backgrounds

## Customization

### Adjust Refresh Rate

Edit `app/page.tsx`:
```typescript
// Change from 5000ms (5 seconds) to desired interval
const interval = setInterval(() => {
  initializeStore();
}, 5000); // Change this value
```

Recommendations:
- **3000ms (3s)** - More frequent for active competitions
- **5000ms (5s)** - Default, good balance
- **10000ms (10s)** - Less frequent, reduces load

### Change Colors

Edit the stats cards in `app/page.tsx`:
```typescript
border-l-4 border-blue-500  // Change border color
text-blue-600              // Change text color
```

### Adjust Font Sizes

For better visibility on large screens, edit `components/Racetrack.tsx`:
```typescript
text-3xl  // Increase to text-4xl or text-5xl
text-base // Increase to text-lg or text-xl
```

## Browser Recommendations

### Best Performance
1. **Google Chrome** - Excellent performance
2. **Microsoft Edge** - Chromium-based, very good
3. **Firefox** - Good, might need hardware acceleration

### Settings to Enable
- Hardware acceleration (Settings → Advanced)
- Disable sleep mode on the display computer
- Disable screensaver
- Set power settings to "Never sleep"

## Troubleshooting

### Display not updating?
- Check if the app is still running (`npm run dev`)
- Refresh the page manually (F5)
- Check browser console for errors

### Fullscreen not working?
- Try pressing F11 twice (exit then re-enter)
- Use browser menu: View → Fullscreen
- Check if browser allows fullscreen on your site

### Performance issues?
- Close other browser tabs
- Increase refresh interval to 10 seconds
- Check CPU usage (should be low)
- Enable hardware acceleration

### Wrong resolution?
- Check display settings (1920x1080 recommended)
- Browser zoom should be 100% (Ctrl+0)
- Disable browser UI (F11 removes everything)

## Advanced: Deploy for Production

### Deploy to Vercel
```bash
npm run build
vercel deploy
```
Access from anywhere: `https://your-app.vercel.app`

### Deploy to Netlify
```bash
npm run build
netlify deploy --prod
```

### Deploy to Your Server
```bash
npm run build
npm start
# Access at http://your-server-ip:3000
```

## Tips for Best Results

### Before the Event
- ✅ Test the display setup 1 day before
- ✅ Ensure stable internet connection
- ✅ Have backup laptop ready
- ✅ Test fullscreen mode works
- ✅ Verify auto-refresh is working

### During the Event
- 📺 Keep display computer plugged in
- 🔄 Monitor occasionally for updates
- 💾 Have backup if server goes down
- 📱 Keep phone hotspot ready for connectivity

### For Best Visuals
- 🎨 Use high-contrast colors
- 📏 Maintain 1920x1080 resolution
- 🔆 Ensure good screen brightness
- 👁️ Test visibility from audience distance
- 🎭 Consider ambient lighting in venue

## Example Setups

### Setup 1: Single Projector
```
[Laptop] → HDMI → [Projector] → [Screen/Wall]
F11 fullscreen on laptop
Auto-refresh enabled
```

### Setup 2: Multiple Displays
```
[Server] ← WiFi ← [Display 1] (Entrance)
              ← [Display 2] (Hacking Area)
              ← [Display 3] (Stage)
All show same live URL
```

### Setup 3: Streaming
```
[App Browser] → [OBS Studio] → [YouTube/Twitch]
Add browser source with app URL
Stream to audience online
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **F11** | Toggle fullscreen |
| **F5** | Manual refresh |
| **Ctrl + 0** | Reset zoom to 100% |
| **Ctrl + +** | Zoom in |
| **Ctrl + -** | Zoom out |
| **Esc** | Exit fullscreen |

## Support

If you encounter issues:
1. Check browser console (F12)
2. Verify app is running (`npm run dev`)
3. Test on different browser
4. Check network connectivity
5. Review logs for errors

---

**Pro Tip**: Arrive early to test the display setup! Test fullscreen mode, auto-refresh, and visibility from different angles in the venue. 🎯
