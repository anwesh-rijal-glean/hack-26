# Clear Browser Cache

If you're seeing old data that won't update even after hard refresh, try these steps:

## Option 1: Clear Browser Cache (Recommended)

### Chrome/Edge:
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Click "Clear data"
4. Reload the page with `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Firefox:
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cache"
3. Click "Clear Now"
4. Reload with `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

### Safari:
1. Go to Safari → Preferences → Advanced
2. Enable "Show Develop menu in menu bar"
3. Click Develop → Empty Caches
4. Reload with `Cmd + Shift + R`

## Option 2: Use Incognito/Private Mode

Open the app in an incognito/private window - this bypasses all caching.

## Option 3: Clear Application Data (Nuclear Option)

1. Open DevTools (F12)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click "Clear site data" or "Clear All"
4. Reload the page

## For Development

Add this to your browser console to check what's cached:

```javascript
// Check localStorage (should be empty for data)
console.log('localStorage:', Object.keys(localStorage));

// Check sessionStorage (should only have auth)
console.log('sessionStorage:', Object.keys(sessionStorage));

// Check IndexedDB (should be empty)
indexedDB.databases().then(dbs => console.log('IndexedDB:', dbs));
```
