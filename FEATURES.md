# 🎨 Team Customization Features

## Icon Picker

Teams can personalize their identity by choosing from a wide selection of emojis!

### How to Change Your Icon

1. Login to your team dashboard
2. Look for your current icon at the top (large emoji next to your team name)
3. **Click on your icon** to open the icon picker
4. Browse through 60+ available icons organized in categories
5. Click any icon to select it instantly
6. The picker closes automatically and your new icon is saved

### Available Icon Categories

#### 🐎 Horses & Racing (5 icons)
Perfect for the racing theme!
- 🐎 Horse
- 🏇 Horse Racing
- 🦄 Unicorn
- 🐴 Horse Face
- 🎠 Carousel Horse

#### 🦁 Animals (15 icons)
Choose your spirit animal!
- 🦁 Lion
- 🐯 Tiger
- 🐻 Bear
- 🐼 Panda
- 🐨 Koala
- 🦊 Fox
- 🐺 Wolf
- 🦝 Raccoon
- 🐱 Cat
- 🐶 Dog
- 🐹 Hamster
- 🐰 Rabbit
- 🦔 Hedgehog
- 🐸 Frog
- 🐵 Monkey

#### 🦅 Birds (5 icons)
For teams that soar!
- 🦅 Eagle
- 🦉 Owl
- 🦆 Duck
- 🐧 Penguin
- 🦜 Parrot

#### 🐉 Mythical & Fun (10 icons)
Stand out with something unique!
- 🐉 Dragon
- 🦖 T-Rex
- 🦕 Dinosaur
- 👾 Alien Monster
- 🤖 Robot
- 👽 Alien
- 🎃 Pumpkin
- 💀 Skull
- 🦇 Bat
- 🕷️ Spider

#### 🚀 Objects & Tech (10 icons)
For tech-focused teams!
- 🚀 Rocket
- ⚡ Lightning
- 🔥 Fire
- 💎 Diamond
- ⭐ Star
- 🎯 Target
- 🎮 Game Controller
- 💻 Laptop
- 🎪 Circus Tent
- 🎨 Artist Palette

#### 🍕 Food (10 icons)
Because why not?
- 🍕 Pizza
- 🍔 Burger
- 🌮 Taco
- 🍩 Donut
- 🧁 Cupcake
- 🍿 Popcorn
- 🥑 Avocado
- 🌶️ Hot Pepper
- 🥨 Pretzel
- 🥯 Bagel

### Features

✅ **Instant Preview** - See your icon change in real-time
✅ **One-Click Selection** - No confirmation needed, just click!
✅ **Visual Grid** - Easy-to-browse 8-column grid layout
✅ **Highlight Current** - Your current icon is highlighted in blue
✅ **Updates Everywhere** - New icon appears on racetrack, leaderboard, and admin table
✅ **Audit Logged** - All icon changes are tracked

### UI Details

**Picker Panel:**
- Beautiful dropdown with shadow and border
- Scrollable grid (max 4 rows visible)
- Hover effects on each icon
- Close button and backdrop
- Responsive design

**Current Icon Display:**
- Large 4xl size (easy to click)
- Hover scale effect (110%)
- Cursor changes to pointer
- Disabled state support

## Name Editor

Teams can also customize their name!

### How to Change Your Name

1. Look for the pencil icon (✏️) next to your team name
2. Click the pencil to enter edit mode
3. Type your new team name
4. Press **Enter** or click the **checkmark** (✅) to save
5. Press **Escape** or click the **X** to cancel

### Features

✅ **Inline Editing** - Edit right where the name is displayed
✅ **Keyboard Shortcuts** - Enter to save, Escape to cancel
✅ **Validation** - Prevents empty names
✅ **Real-time Updates** - Name changes everywhere instantly
✅ **Audit Logged** - All name changes are tracked

## Customization Benefits

### For Teams
- 🎨 **Express Personality** - Choose icons that represent your team
- 🏆 **Stand Out** - Be memorable on the leaderboard
- 🤝 **Team Identity** - Build cohesion with your chosen icon and name
- 🎯 **Easy to Spot** - Find your team quickly on the racetrack

### For Organizers
- 📊 **Audit Trail** - Track all customization changes
- 🔒 **Isolated Access** - Teams can only edit their own identity
- 💾 **Persistent** - All changes saved to localStorage
- 🎭 **Variety** - 60+ icons reduce duplicate choices

## Technical Details

### Storage
All customizations are stored in the Zustand store and persisted to localStorage:

```typescript
{
  name: "The Code Ninjas",    // Custom name
  horseIcon: "🚀",            // Selected icon
  updatedAt: "2026-01-13...", // Last update timestamp
  lastUpdatedBy: "team5"      // Who made the change
}
```

### Audit Log
Every change creates an audit event:

```typescript
{
  action: "EDIT_NOTES",
  field: "name" | "icon",
  from: "old value",
  to: "new value",
  actor: { type: "team", id: "team-5" }
}
```

### Restrictions
- ✅ Teams can only customize their own identity
- ✅ Admin can see all changes in audit log
- ✅ Empty names are rejected
- ✅ Empty icons are rejected

## Tips for Teams

1. **Choose Early** - Pick your icon and name when you first login
2. **Be Creative** - Stand out with a unique combination
3. **Stay Themed** - Match your icon to your project theme
4. **Avoid Duplicates** - Check the leaderboard to see what others chose
5. **Have Fun** - This is your hackathon identity!

## Common Combinations

Some popular team customization examples:

- 🚀 **The Launchers** - Space/tech theme
- 🐉 **Dragon Coders** - Mythical power
- 🤖 **The Robots** - AI/ML projects
- 🔥 **Fire Squad** - High energy
- 💎 **Diamond Devs** - Premium quality
- ⚡ **Lightning Fast** - Speed focused
- 🦅 **Code Eagles** - Vision and precision
- 🎯 **Target Team** - Goal oriented
- 🐼 **Panda Express** - Fun and fast
- 🦄 **Unicorn Hackers** - Rare and magical

---

**Remember**: Your customizations are saved automatically and update everywhere in the app instantly! 🎉
