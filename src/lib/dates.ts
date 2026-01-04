import { format, parseISO, getISOWeek } from "date-fns";

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }
    return format(date, "MMM d, yyyy");
  } catch {
    return dateString; // Return original if parsing fails
  }
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const startFormatted = format(start, "d MMMM yyyy");
  const endFormatted = format(end, "d MMMM yyyy");

  return `${startFormatted} to ${endFormatted}`;
}

/**
 * Get the ISO week number for a given date string.
 * ISO weeks start on Monday and end on Sunday.
 */
export function getISOWeekNumber(dateString: string): number {
  const date = parseISO(dateString);
  return getISOWeek(date);
}
