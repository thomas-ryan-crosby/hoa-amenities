/**
 * Date and Time Formatting Utilities
 * 
 * STANDARD: All times throughout the application should be formatted consistently
 * - Times are stored in the database as UTC timestamps
 * - When displaying times, we format them in 12-hour format with AM/PM
 * - Timezone: We use the timezone specified in APP_TIMEZONE env var (default: America/New_York)
 * - Format: "06:00 PM" (consistent 2-digit hours and minutes with AM/PM)
 * 
 * This ensures:
 * 1. Consistency across emails, frontend, and API responses
 * 2. User-friendly 12-hour format
 * 3. Predictable timezone handling regardless of server location
 * 
 * IMPORTANT: Set APP_TIMEZONE environment variable to your community's timezone
 * Examples: "America/New_York", "America/Chicago", "America/Los_Angeles"
 */

const DEFAULT_TIMEZONE = process.env.APP_TIMEZONE || 'America/New_York';

/**
 * Format a date string or Date object to a readable date string
 * Format: "Thursday, November 20, 2025"
 * Uses the configured timezone to ensure date is correct for the community
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Use Intl.DateTimeFormat to format in the specified timezone
  return new Intl.DateTimeFormat('en-US', {
    timeZone: DEFAULT_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Format a time string or Date object to 12-hour format with AM/PM
 * Format: "06:00 PM" (consistent 2-digit hours and minutes)
 * 
 * IMPORTANT: This function converts UTC timestamps to the configured timezone
 * This ensures emails show the same time as the frontend (which uses browser timezone)
 * 
 * The timezone is controlled by the APP_TIMEZONE environment variable.
 * If not set, defaults to America/New_York.
 */
export function formatTime(time: string | Date): string {
  const timeObj = typeof time === 'string' ? new Date(time) : time;
  
  // Use Intl.DateTimeFormat to format in the specified timezone
  // This ensures consistent formatting regardless of server location
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone: DEFAULT_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(timeObj);
  
  return formatted;
}

/**
 * Format a date-time range for display
 * Format: "06:00 PM - 08:00 PM"
 */
export function formatTimeRange(startTime: string | Date, endTime: string | Date): string {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Format a date and time range for display
 * Format: "Thursday, November 20, 2025 at 06:00 PM - 08:00 PM"
 */
export function formatDateTimeRange(date: string | Date, startTime: string | Date, endTime: string | Date): string {
  return `${formatDate(date)} at ${formatTimeRange(startTime, endTime)}`;
}

