/**
 * Date/Time Formatting Utilities
 * 
 * Standardized date/time formatting functions for consistent display
 * across the entire HOA Amenities platform.
 * 
 * All functions handle timezone conversion from UTC (database) to local time (display).
 */

/**
 * Safely parse a YYYY-MM-DD date string without timezone issues.
 * NEVER use `new Date("YYYY-MM-DD")` directly as it causes timezone shifts.
 * 
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Date object representing the date in local timezone
 */
export const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Format a date string to full date format (e.g., "Monday, January 15, 2025").
 * 
 * @param dateString - Date string (YYYY-MM-DD) or ISO datetime string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  // Check if it's a date-only string (YYYY-MM-DD)
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = parseDateString(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Otherwise, treat as ISO datetime string
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a date string to short date format (e.g., "Jan 15, 2025").
 * 
 * @param dateString - Date string (YYYY-MM-DD) or ISO datetime string
 * @returns Formatted short date string
 */
export const formatDateShort = (dateString: string): string => {
  if (!dateString) return '';
  
  // Check if it's a date-only string (YYYY-MM-DD)
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = parseDateString(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  // Otherwise, treat as ISO datetime string
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a datetime string to time format (e.g., "08:00 AM").
 * 
 * @param dateTimeString - ISO datetime string
 * @returns Formatted time string (12-hour format with AM/PM)
 */
export const formatTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a time range (e.g., "08:00 AM - 05:00 PM").
 * 
 * @param start - ISO datetime string for start time
 * @param end - ISO datetime string for end time
 * @returns Formatted time range string
 */
export const formatTimeRange = (start: string, end: string): string => {
  if (!start || !end) return '';
  
  return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * Format a datetime string to date and time together (e.g., "Monday, January 15, 2025 at 08:00 AM").
 * 
 * @param dateTimeString - ISO datetime string
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `${dateStr} at ${timeStr}`;
};

/**
 * Format a datetime string to compact date/time format (e.g., "01/15/2025 08:00 AM").
 * 
 * @param dateTimeString - ISO datetime string
 * @returns Formatted compact date/time string
 */
export const formatDateTimeCompact = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  const dateStr = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const timeStr = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `${dateStr} ${timeStr}`;
};

/**
 * Format a date string for display in tables/lists (e.g., "01/15/2025").
 * 
 * @param dateString - Date string (YYYY-MM-DD) or ISO datetime string
 * @returns Formatted date string for tables
 */
export const formatDateForTable = (dateString: string): string => {
  if (!dateString) return '';
  
  // Check if it's a date-only string (YYYY-MM-DD)
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = parseDateString(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  
  // Otherwise, treat as ISO datetime string
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

