/**
 * Date validation and manipulation utilities
 * Provides safe date operations with null/undefined handling
 */

/**
 * Checks if a date string, Date object, or null/undefined is a valid date
 * @param date - The date value to validate
 * @returns true if the date is valid, false otherwise
 */
export function isValidDate(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  
  const d = date instanceof Date ? date : new Date(date);
  return !isNaN(d.getTime()) && d instanceof Date;
}

/**
 * Safely gets the timestamp (milliseconds since epoch) from a date
 * Returns 0 for invalid dates instead of throwing
 * @param date - The date value to convert
 * @returns Timestamp in milliseconds, or 0 if invalid
 */
export function safeGetTime(date: string | Date | null | undefined): number {
  if (!isValidDate(date)) return 0;
  
  const d = date instanceof Date ? date : new Date(date);
  return d.getTime();
}

/**
 * Calculates the number of days between two dates
 * Returns a safe value even if dates are invalid
 * @param date1 - First date (or current date if not provided)
 * @param date2 - Second date
 * @returns Number of days difference, or 0 if invalid
 */
export function daysBetween(date1: string | Date | null | undefined, date2?: string | Date | null | undefined): number {
  const d1 = date2 ? safeGetTime(date1) : Date.now();
  const d2 = date2 ? safeGetTime(date2) : safeGetTime(date1);
  
  if (d1 === 0 || d2 === 0) return 0;
  
  const diff = Math.abs(d1 - d2);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a date is within a certain number of days from now
 * @param date - The date to check
 * @param days - Number of days threshold
 * @returns true if within threshold, false otherwise
 */
export function isWithinDays(date: string | Date | null | undefined, days: number): boolean {
  if (!date || days < 0) return false;
  
  const daysDiff = daysBetween(date);
  return daysDiff >= 0 && daysDiff <= days;
}

/**
 * Safely creates a Date object from a value
 * Returns null for invalid dates instead of Invalid Date object
 * @param date - The date value to convert
 * @returns Date object or null if invalid
 */
export function safeCreateDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;
  
  return d;
}

/**
 * Compares two dates for sorting purposes
 * Handles invalid dates gracefully
 * @param a - First date
 * @param b - Second date
 * @returns Comparison result: negative if a < b, positive if a > b, 0 if equal
 */
export function compareDates(
  a: string | Date | null | undefined,
  b: string | Date | null | undefined
): number {
  const aTime = safeGetTime(a);
  const bTime = safeGetTime(b);
  
  // Handle cases where both are invalid
  if (aTime === 0 && bTime === 0) return 0;
  
  // Invalid dates sort to the end
  if (aTime === 0) return 1;
  if (bTime === 0) return -1;
  
  return bTime - aTime; // Descending order by default
}

/**
 * Formats a date to a readable string with fallback
 * @param date - The date to format
 * @param options - Intl.DateTimeFormatOptions
 * @param fallback - Fallback string if date is invalid
 * @returns Formatted date string or fallback
 */
export function safeFormatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback: string = 'Invalid Date'
): string {
  const d = safeCreateDate(date);
  if (!d) return fallback;
  
  try {
    return d.toLocaleDateString(undefined, options);
  } catch {
    return fallback;
  }
}

