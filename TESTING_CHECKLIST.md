# ✅ Testing Checklist - Real-time Updates

## Before You Start
- [ ] Stop dev server (`Ctrl+C`)
- [ ] Clear browser cache or open Incognito mode
- [ ] Restart dev server: `npm run dev`
- [ ] Open browser console (F12)

---

## Test 1: Initial Data Load
**Expected Result:** Data loads automatically without errors

- [ ] Navigate to `http://localhost:3000/`
- [ ] See loading spinner briefly
- [ ] See racetrack with all teams
- [ ] Console shows:
  ```
  🔄 fetchAllData() called at [time]
  ✅ Data fetched: { teams: 20, ... }
  ✅ Store updated successfully
  ```

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 2: Auto-Refresh (10 seconds)
**Expected Result:** Data refreshes automatically every 10 seconds

- [ ] Keep home page open
- [ ] Watch console for 15 seconds
- [ ] See this appear every 10 seconds:
  ```
  ⏱️ Auto-refresh triggered
  🔄 fetchAllData() called at [time]
  ✅ Data fetched: ...
  ```

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 3: Manual Update - Team Name
**Expected Result:** Name change shows up automatically within 10 seconds

**Steps:**
1. [ ] Note current name of Team 1 on racetrack
2. [ ] Open `/team` in new tab
3. [ ] Login as Team 1 (username: `team-1`, password: `team1pass`)
4. [ ] Change team name to "Test Team Updated"
5. [ ] Switch back to home page tab
6. [ ] **Wait up to 10 seconds**
7. [ ] See name update on racetrack (OR hard refresh to verify)

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 4: Manual Update - Task Toggle
**Expected Result:** Progress updates show automatically within 10 seconds

**Steps:**
1. [ ] Note Team 1's progress (e.g., "3/10 tasks")
2. [ ] On team page, toggle a task checkbox
3. [ ] See success toast
4. [ ] Switch back to home page tab  
5. [ ] **Wait up to 10 seconds**
6. [ ] See progress update (e.g., "4/10 tasks")
7. [ ] See team position change if needed

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 5: Focus Refresh
**Expected Result:** Data refreshes when switching tabs

**Steps:**
1. [ ] Home page open
2. [ ] Switch to another tab/app for >2 seconds
3. [ ] Switch back to home page tab
4. [ ] Console shows:
  ```
  🔄 Window focused - refreshing...
  🔄 fetchAllData() called at [time]
  ```

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 6: Multiple Teams
**Expected Result:** Multiple teams can update, all show correctly

**Steps:**
1. [ ] Update Team 1 progress
2. [ ] Update Team 2 progress  
3. [ ] Update Team 3 progress
4. [ ] All updates appear on racetrack within 10 seconds
5. [ ] Teams are sorted correctly by progress

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 7: Admin Updates
**Expected Result:** Admin changes reflect immediately

**Steps:**
1. [ ] Open `/admin` in new tab
2. [ ] Login with password: `hackathon2026`
3. [ ] Lock a task
4. [ ] Switch to home page
5. [ ] Update appears within 10 seconds

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 8: Database Verification
**Expected Result:** Changes are actually in the database

**Steps:**
1. [ ] Make a change (e.g., toggle task for Team 1)
2. [ ] Hard refresh home page (`Shift + F5`)
3. [ ] Change persists after refresh
4. [ ] OR: Check Supabase dashboard directly

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 9: Console Logs Clean
**Expected Result:** Logs are informative, not spammy

- [ ] No excessive logging (< 5 lines per refresh)
- [ ] No error messages in console
- [ ] Logs are clear and useful:
  ```
  🔄 fetchAllData() called at [time]
  ✅ Data fetched: { teams: 20, ... }
  ✅ Store updated successfully
  ```

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## Test 10: Production Build
**Expected Result:** Works in production build

**Steps:**
```bash
npm run build
npm start
```

- [ ] Build completes without errors
- [ ] Production server starts
- [ ] All above tests pass in production mode

**✅ PASS** | **❌ FAIL** (note error): _______________

---

## 🐛 If Tests Fail

### Issue: Data not loading initially
**Fix:**
1. Check `.env.local` has correct Supabase credentials
2. Check Supabase database has data
3. Check browser console for errors

### Issue: Auto-refresh not working
**Fix:**
1. Check console for `⏱️ Auto-refresh triggered` every 10 seconds
2. If missing, restart dev server
3. Try Incognito mode

### Issue: Updates not showing
**Fix:**
1. Verify change is in database (check Supabase)
2. Check console - is `fetchAllData()` being called?
3. Hard refresh (`Shift + F5`)
4. Clear browser cache completely

### Issue: useEffect not running
**Fix:**
1. Check browser console for React errors
2. Restart dev server: `pkill -f node && npm run dev`
3. Use Incognito mode (bypasses all caching)

---

## ✅ All Tests Pass?

**Congratulations! Your app is working correctly!** 🎉

Next steps:
1. Deploy to Vercel
2. Test in production environment  
3. Share with your team

---

## 📊 Test Results Summary

**Date:** _______________  
**Tester:** _______________

| Test # | Test Name | Result | Notes |
|--------|-----------|--------|-------|
| 1 | Initial Data Load | ⬜ | |
| 2 | Auto-Refresh | ⬜ | |
| 3 | Team Name Update | ⬜ | |
| 4 | Task Toggle | ⬜ | |
| 5 | Focus Refresh | ⬜ | |
| 6 | Multiple Teams | ⬜ | |
| 7 | Admin Updates | ⬜ | |
| 8 | Database Verification | ⬜ | |
| 9 | Console Logs | ⬜ | |
| 10 | Production Build | ⬜ | |

**Overall:** ⬜ PASS | ⬜ FAIL

**Notes:** 
_______________________________________________________
_______________________________________________________
_______________________________________________________
