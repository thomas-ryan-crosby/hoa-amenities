# Date/Time Format Specification

This document defines the standard for displaying dates and times consistently across the entire HOA Amenities platform.

## Core Principles

1. **Store dates in UTC**: All dates and times are stored in the database as UTC ISO strings
2. **Display in local timezone**: All dates and times are displayed in the user's local timezone
3. **Consistent formatting**: Use standardized utility functions for all date/time formatting
4. **No timezone shifts**: Never use `new Date("YYYY-MM-DD")` directly - it causes timezone shifts

## Date Format Standards

### Date Display (Date Only)
- **Format**: `"Monday, January 15, 2025"`
- **Locale**: `en-US`
- **Options**: `{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }`
- **Use Case**: Displaying reservation dates, event dates

### Date Display (Short)
- **Format**: `"01/15/2025"` or `"Jan 15, 2025"`
- **Locale**: `en-US`
- **Options**: `{ year: 'numeric', month: 'short', day: 'numeric' }`
- **Use Case**: Compact date displays, lists

## Time Format Standards

### Time Display (12-hour format with AM/PM)
- **Format**: `"08:00 AM"` or `"03:00 PM"`
- **Locale**: `en-US`
- **Options**: `{ hour: '2-digit', minute: '2-digit' }`
- **Use Case**: Reservation times, cleaning times, event times
- **Range Display**: `"08:00 AM - 05:00 PM"` (start time - end time)

### Time Display (24-hour format)
- **Format**: `"08:00"` or `"15:00"`
- **Locale**: `en-US`
- **Options**: `{ hour: '2-digit', minute: '2-digit', hour12: false }`
- **Use Case**: Internal displays, administrative views

## Date/Time Combination Standards

### Date and Time Together
- **Format**: `"Monday, January 15, 2025 at 08:00 AM"`
- **Use Case**: Detailed event information, notifications

### DateTime Display (Compact)
- **Format**: `"01/15/2025 08:00 AM"`
- **Use Case**: Lists, tables, compact displays

## Implementation Rules

### 1. Date String Parsing
**NEVER use**: `new Date("2025-01-15")` - This causes timezone shifts
**ALWAYS use**: `parseDateString("2025-01-15")` - Safely parses YYYY-MM-DD without timezone issues

### 2. DateTime String Parsing
**Use**: `new Date(isoString)` - For ISO datetime strings from backend
**Example**: `new Date("2025-01-15T08:00:00.000Z")`

### 3. Time Formatting
**ALWAYS use**: `formatTime(isoString)` - Standardized 12-hour format
**Example**: `formatTime("2025-01-15T08:00:00.000Z")` → `"08:00 AM"`

### 4. Date Formatting
**ALWAYS use**: `formatDate(isoString)` or `formatDateOnly(dateString)` - Standardized date format
**Example**: `formatDate("2025-01-15T08:00:00.000Z")` → `"Monday, January 15, 2025"`

### 5. Date Range Formatting
**ALWAYS use**: `formatTimeRange(startIsoString, endIsoString)` - Standardized range format
**Example**: `formatTimeRange("2025-01-15T08:00:00.000Z", "2025-01-15T17:00:00.000Z")` → `"08:00 AM - 05:00 PM"`

## Reservation-Specific Standards

### Reservation Date Display
- **Label**: "Date"
- **Format**: Full date (e.g., "Monday, January 15, 2025")
- **Location**: Calendar events, reservation details, janitorial review

### Reservation Time Display
- **Label**: "Reservation Time"
- **Format**: `"08:00 AM - 05:00 PM"`
- **Data Source**: `partyTimeStart` and `partyTimeEnd` fields
- **Location**: Calendar events, reservation details, janitorial review, user reservations

### Cleaning Time Display
- **Label**: "Cleaning Time"
- **Format**: `"05:30 PM - 07:30 PM"`
- **Data Source**: `cleaningTimeStart` and `cleaningTimeEnd` fields
- **Location**: Calendar events, janitorial review

## Consistency Requirements

### Across All Views
1. **Calendar View**: Must use same date/time formatting as reservation details
2. **Janitorial Review**: Must use same date/time formatting as calendar
3. **Reservation Details**: Must use same date/time formatting as calendar
4. **User Reservations**: Must use same date/time formatting as calendar

### Reservation Name Display
- **Label**: "Reservation Name" or display as primary title
- **Field**: `eventName` (if provided) or fallback to amenity name
- **Location**: All reservation views (calendar, janitorial, user reservations)

## Utility Functions

All date/time formatting must use the shared utility functions located in:
- `frontend/src/utils/dateTimeUtils.ts`

### Available Functions:
- `parseDateString(dateStr: string): Date` - Safely parse YYYY-MM-DD without timezone issues
- `formatDate(dateString: string): string` - Format full date (Monday, January 15, 2025)
- `formatDateShort(dateString: string): string` - Format short date (Jan 15, 2025)
- `formatTime(dateTimeString: string): string` - Format time (08:00 AM)
- `formatTimeRange(start: string, end: string): string` - Format time range (08:00 AM - 05:00 PM)
- `formatDateTime(dateTimeString: string): string` - Format date and time together
- `formatDateTimeCompact(dateTimeString: string): string` - Format compact date/time

## Migration Checklist

When updating components:
- [ ] Replace all `new Date(dateString).toLocaleDateString()` with `formatDate()`
- [ ] Replace all `new Date(dateTimeString).toLocaleTimeString()` with `formatTime()`
- [ ] Replace all date range formatting with `formatTimeRange()`
- [ ] Ensure all date parsing uses `parseDateString()` for YYYY-MM-DD strings
- [ ] Verify consistency across Calendar, Janitorial, Reservations, and Admin views

## Testing Requirements

1. **Timezone Testing**: Test with users in different timezones
2. **Consistency Testing**: Verify same reservation shows same date/time in all views
3. **Daylight Saving Time**: Test around DST transitions
4. **Date Range Testing**: Test reservations spanning midnight or multiple days

