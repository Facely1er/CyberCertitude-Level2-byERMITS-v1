/**
 * Date Utility Functions
 * 
 * Safe date operations to prevent runtime errors with null, undefined, or invalid dates.
 * Based on recommendations from RUNTIME_ERRORS_INSPECTION_REPORT.md
 */

/**
 * Checks if a date value is valid
 * @param date - Date string, Date object, null, or undefined
 * @returns true if the date is valid, false otherwise
 */
export function isValidDate(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  try {
    const d = date instanceof Date ? date : new Date(date);
    return !isNaN(d.getTime());
  } catch {
    return false;
  }
}

/**
 * Safely gets the timestamp from a date value
 * @param date - Date string, Date object, null, or undefined
 * @returns Timestamp in milliseconds, or 0 if invalid
 */
export function safeGetTime(date: string | Date | null | undefined): number {
  if (!isValidDate(date)) return 0;
  const d = date instanceof Date ? date : new Date(date);
  return d.getTime();
}

/**
 * Calculates days between two dates safely
 * @param date1 - First date (string, Date, null, or undefined)
 * @param date2 - Second date (string, Date, null, or undefined), defaults to now
 * @returns Number of days between dates, or Infinity if either date is invalid
 */
export function daysBetween(
  date1: string | Date | null | undefined,
  date2: string | Date | null | undefined = new Date()
): number {
  const time1 = safeGetTime(date1);
  const time2 = safeGetTime(date2);
  
  if (time1 === 0 || time2 === 0) return Infinity;
  
  const diffMs = Math.abs(time2 - time1);
  return diffMs / (1000 * 60 * 60 * 24);
}

/**
 * Checks if a date is within the last N days
 * @param date - Date to check
 * @param days - Number of days (default: 7)
 * @returns true if date is within the last N days, false otherwise
 */
export function isWithinLastDays(
  date: string | Date | null | undefined,
  days: number = 7
): boolean {
  if (!isValidDate(date)) return false;
  
  const daysSince = daysBetween(date, new Date());
  return daysSince >= 0 && daysSince <= days;
}

/**
 * Safely sorts an array of objects by date property
 * @param array - Array of objects with a date property
 * @param dateKey - Key of the date property
 * @param ascending - Sort order (default: false = descending)
 * @returns Sorted array
 */
export function sortByDate<T extends Record<string, any>>(
  array: T[],
  dateKey: keyof T,
  ascending: boolean = false
): T[] {
  return [...array].sort((a, b) => {
    const aTime = safeGetTime(a[dateKey]);
    const bTime = safeGetTime(b[dateKey]);
    
    if (isNaN(aTime) || isNaN(bTime)) {
      // Put invalid dates at the end
      if (isNaN(aTime) && isNaN(bTime)) return 0;
      return isNaN(aTime) ? 1 : -1;
    }
    
    return ascending ? aTime - bTime : bTime - aTime;
  });
}

/**
 * Gets the latest item from an array sorted by date
 * @param array - Array of objects with a date property
 * @param dateKey - Key of the date property
 * @returns Latest item or undefined if array is empty
 */
export function getLatestByDate<T extends Record<string, any>>(
  array: T[],
  dateKey: keyof T
): T | undefined {
  if (!array || array.length === 0) return undefined;
  
  const sorted = sortByDate(array, dateKey, false);
  return sorted[0];
}
