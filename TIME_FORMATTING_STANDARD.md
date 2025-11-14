# Time Formatting Standard

## Overview
All times throughout the Neighbri application MUST be formatted consistently to ensure users see the same times in emails, the frontend, and API responses.

## Standard

### 1. Database Storage
- **Times are stored in the database as UTC timestamps** (ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`)
- Example: `2025-11-20T18:00:00.000Z` (6:00 PM UTC)

### 2. Display Format
- **Format**: 12-hour format with AM/PM
- **Pattern**: `"06:00 PM"` (2-digit hours, 2-digit minutes, space, AM/PM)
- **Timezone**: Uses `APP_TIMEZONE` environment variable (default: `America/New_York`)

### 3. Implementation

#### Backend
- **ALWAYS use `formatTime()` from `backend/src/utils/dateTimeUtils.ts`**
- **NEVER use `toLocaleTimeString()` directly** - it uses server timezone which causes inconsistencies
- The `formatTime()` function automatically converts UTC timestamps to the configured timezone

```typescript
import { formatTime } from '../utils/dateTimeUtils';

// Correct usage
const timeDisplay = formatTime(reservation.partyTimeStart); // "06:00 PM"

// WRONG - never do this
const timeDisplay = new Date(reservation.partyTimeStart).toLocaleTimeString(); // ❌
```

#### Frontend
- **ALWAYS use `formatTime()` from `frontend/src/utils/dateTimeUtils.ts`**
- The frontend uses browser timezone, which should match the community's timezone
- For consistency, consider updating frontend to also use a configured timezone in the future

```typescript
import { formatTime } from '../utils/dateTimeUtils';

// Correct usage
const timeDisplay = formatTime(reservation.partyTimeStart); // "06:00 PM"
```

### 4. Environment Configuration
- Set `APP_TIMEZONE` environment variable to your community's timezone
- Examples:
  - `America/New_York` (Eastern Time)
  - `America/Chicago` (Central Time)
  - `America/Los_Angeles` (Pacific Time)
  - `America/Denver` (Mountain Time)

### 5. Email Notifications
- All email templates MUST use `formatTime()` for time display
- Times in emails will match times displayed in the frontend
- Example: `partyTimeStart: formatTime(reservation.partyTimeStart)`

### 6. API Responses
- When returning times in API responses, format them using `formatTime()`
- This ensures consistency between frontend display and API data

## Common Mistakes to Avoid

1. ❌ **Using `toLocaleTimeString()` directly** - causes timezone inconsistencies
2. ❌ **Manually parsing time strings** - use the utility functions
3. ❌ **Assuming times are in local timezone** - they're stored as UTC
4. ❌ **Hardcoding timezone conversions** - use the standard utility functions

## Verification

To verify times are correct:
1. Create a reservation for a specific time (e.g., 6:00 PM)
2. Check the time displayed in the frontend
3. Check the time in the email notification
4. Both should match exactly

## Examples

### Correct Implementation
```typescript
// Backend - reservations.ts
const timeStart = formatTime(createdReservation.partyTimeStart);
const timeEnd = formatTime(createdReservation.partyTimeEnd);

await sendNotificationIfEnabled(
  userWithPrefs,
  'reservationCreated',
  () => buildReservationCreatedEmail({
    partyTimeStart: timeStart, // "06:00 PM"
    partyTimeEnd: timeEnd,     // "08:00 PM"
    // ...
  })
);
```

### Incorrect Implementation
```typescript
// ❌ WRONG - Don't do this
const timeStart = new Date(createdReservation.partyTimeStart).toLocaleTimeString();
// This uses server timezone, not APP_TIMEZONE
```

## Troubleshooting Timezone Issues

### If times are off by an hour:
1. **Check APP_TIMEZONE environment variable** - Set it in Railway/Railway environment variables
   - For The Sanctuary (Louisiana, zip 70471): `APP_TIMEZONE=America/Chicago`
   - Verify it's set: Check Railway dashboard → Environment Variables
2. **Verify times are stored as UTC** - Times should be stored as ISO strings with 'Z' suffix (UTC)
3. **Check DST (Daylight Saving Time)** - The timezone should handle DST automatically, but verify the timezone string is correct
4. **Compare frontend vs backend** - Frontend uses browser timezone, backend uses APP_TIMEZONE - they should match

### Common Issues:
- **Times off by 1 hour**: Usually DST or incorrect APP_TIMEZONE setting
- **Times off by multiple hours**: Wrong timezone entirely (e.g., using Eastern instead of Central)
- **Times completely wrong**: Times might be stored in local time instead of UTC

## Maintenance

- If timezone issues occur, check:
  1. `APP_TIMEZONE` environment variable is set correctly in Railway
  2. All time formatting uses `formatTime()` utility
  3. No direct use of `toLocaleTimeString()` or `toLocaleString()`
  4. Database times are stored as UTC timestamps (ISO strings with 'Z')
  5. Times from frontend are properly converted to UTC before storage

