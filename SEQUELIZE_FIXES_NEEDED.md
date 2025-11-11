# Sequelize Fixes Needed - All Endpoints

## Problem
Any endpoint using `Reservation.findOne()`, `Reservation.findByPk()`, or `reservation.update()` without explicit attributes will try to access `modificationStatus` and other modification fields that don't exist.

## Endpoints That Need Fixing

### 1. PUT /:id/complete (IMMEDIATE - User reported error)
- Uses `Reservation.findOne()` without attributes
- Uses `reservation.update()` which tries to access all fields
- **Fix:** Add explicit attributes to findOne, use raw SQL for update

### 2. PUT /:id/approve
- Uses `Reservation.findOne()` without attributes
- Uses `reservation.update()` 
- **Fix:** Add explicit attributes to findOne, use raw SQL for update

### 3. PUT /:id/reject
- Uses `Reservation.findOne()` without attributes
- Uses `reservation.update()`
- **Fix:** Add explicit attributes to findOne, use raw SQL for update

### 4. PUT /:id (Update reservation)
- Uses `Reservation.findOne()` without attributes
- Uses `reservation.update()`
- Uses `Reservation.findByPk()` without attributes
- **Fix:** Add explicit attributes to all queries, use raw SQL for update

### 5. DELETE /:id (Cancel reservation)
- Uses `Reservation.findOne()` without attributes
- Uses `reservation.update()`
- **Fix:** Add explicit attributes to findOne, use raw SQL for update

### 6. POST /:id/assess-damages
- Likely uses findOne/update
- **Fix:** Check and fix if needed

## Solution Pattern

### For findOne/findByPk:
```typescript
const reservation = await Reservation.findOne({
  where: { ... },
  attributes: [
    'id', 'date', 'setupTimeStart', 'setupTimeEnd', 'partyTimeStart', 'partyTimeEnd',
    'guestCount', 'specialRequirements', 'status', 'totalFee', 'totalDeposit',
    'eventName', 'isPrivate', 'communityId', 'amenityId', 'userId'
    // Explicitly exclude modification fields
  ],
  include: [...]
});
```

### For update:
```typescript
// Use raw SQL instead of reservation.update()
await sequelize.query(`
  UPDATE reservations
  SET status = :status,
      "damageAssessed" = :damageAssessed,
      "damageAssessmentPending" = :damageAssessmentPending,
      "damageAssessmentStatus" = :damageAssessmentStatus,
      "updatedAt" = :now
  WHERE id = :reservationId
`, {
  replacements: {
    status: 'COMPLETED',
    damageAssessed: false,
    damageAssessmentPending: false,
    damageAssessmentStatus: null,
    now: new Date().toISOString(),
    reservationId: id
  },
  type: QueryTypes.UPDATE
});
```

## Implementation Priority
1. **IMMEDIATE:** PUT /:id/complete (user reported error)
2. **HIGH:** PUT /:id/approve, PUT /:id/reject (commonly used)
3. **MEDIUM:** PUT /:id, DELETE /:id (user-facing)
4. **LOW:** POST /:id/assess-damages (check if needed)

