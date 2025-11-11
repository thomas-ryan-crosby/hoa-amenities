# Reservation Creation Fix Plan

## Problem
When creating a reservation, we get: `column "modificationStatus" does not exist` (Error Code: 42703)

## Root Cause Analysis

### The Issue
The `Reservation` model defines `modificationStatus` with `defaultValue: 'NONE'`:
```typescript
modificationStatus: {
  type: DataTypes.STRING(20),
  allowNull: true,
  defaultValue: 'NONE',  // ← THIS IS THE PROBLEM
  validate: {
    isIn: [['NONE', 'PENDING', 'ACCEPTED', 'REJECTED']]
  }
}
```

**Why this causes the error:**
1. Sequelize processes the model definition before executing INSERT
2. When it sees `defaultValue: 'NONE'`, it tries to set that default value
3. This requires accessing the `modificationStatus` column in the database
4. The column doesn't exist, so we get "column modificationStatus does not exist"
5. The `fields` option in `create()` only controls which fields go in the INSERT statement, but Sequelize still processes defaults during model initialization

### Why Previous Fixes Didn't Work
- ✅ Added `fields` option to `create()` - but Sequelize still processes defaults
- ✅ Added explicit `attributes` to `findByPk()` - but error happens before this
- ✅ Added explicit `attributes` to conflict check - but error happens during `create()`

The error occurs during `Reservation.create()`, before we even get to `findByPk()`.

## Proposed Solution

### Solution: Remove defaultValue from Model Definition

**Approach:** Remove `defaultValue: 'NONE'` from `modificationStatus` in the model.

**Why This Works:**
- Sequelize won't try to set a default value for a field that doesn't have one
- The field is `allowNull: true`, so it can be null/undefined
- We can handle defaults in application logic when the column exists

**Implementation:**
```typescript
// In backend/src/models/Reservation.ts
modificationStatus: {
  type: DataTypes.STRING(20),
  allowNull: true,
  // REMOVE: defaultValue: 'NONE',
  validate: {
    isIn: [['NONE', 'PENDING', 'ACCEPTED', 'REJECTED']]
  }
}
```

**When Column Exists:**
- The propose-modification endpoint explicitly sets `modificationStatus = 'PENDING'` using raw SQL
- The cancel-modification endpoint sets `modificationStatus = 'NONE'` using raw SQL
- So we don't need a default value in the model

**When Column Doesn't Exist:**
- The field won't be accessed, so no error
- Reservation creation works normally

## Alternative Solutions (Not Recommended)

### Option 2: Use Raw SQL for Create
- Replace `Reservation.create()` with raw SQL INSERT
- More verbose, loses type safety
- Not necessary if we remove defaultValue

### Option 3: Conditional Model Definition
- Dynamically define model based on column existence
- Too complex, hard to maintain

## Implementation Steps

1. **Remove defaultValue from model:**
   - Edit `backend/src/models/Reservation.ts`
   - Remove `defaultValue: 'NONE'` from `modificationStatus` (line 253)

2. **Verify no other code depends on the default:**
   - Check if any code assumes `modificationStatus` defaults to 'NONE'
   - The propose-modification endpoint explicitly sets it, so we're good

3. **Test:**
   - Create a new reservation → should work
   - Propose a modification → should still work (explicitly sets status)
   - Accept/reject modification → should still work

## Risk Assessment

- **Risk Level:** VERY LOW
- **Impact:** 
  - No breaking changes - modification endpoints explicitly set the status
  - If column exists and we need a default, we can add it back or handle in SQL
- **Rollback:** Easy - just add `defaultValue: 'NONE'` back

## Why This Is The Right Fix

1. **Root Cause:** The `defaultValue` is what triggers Sequelize to access the column
2. **Simple:** One-line change
3. **Safe:** Modification endpoints explicitly set the status anyway
4. **Correct:** If the column doesn't exist, we shouldn't have a default value in the model

## Testing Checklist

After implementation:
- [ ] Create a new reservation → should work without errors
- [ ] Verify reservation appears in "My Reservations" tab
- [ ] Verify reservation appears in "Janitorial" tab  
- [ ] Propose a modification → should work (explicitly sets modificationStatus)
- [ ] Accept a modification → should work
- [ ] Reject a modification → should work
- [ ] Cancel a modification → should work
