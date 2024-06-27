import { parkingSpace } from "../data/parkingSpaces";

/**
 * Adjusts the minutes of the date to 0 or 30
 */
export function adjustMinutes(date: Date): Date {
    const minutes = date.getMinutes();
    date.setMinutes(minutes >= 15 && minutes <= 59 ? 30 : 0);
    return date;
}

/**
 * Checks if the date is within the range of start and end
 */
export function isDateWithinRange(date: Date, start: Date, end: Date): boolean {
    if (start.getTime() > end.getTime()) return date >= end && date <= start;
    return date >= start && date <= end;
}

/**
 * Checks if the dates from start to end are within the restricted dates
 */
export function findRestrictedDateInRange(start: Date, end: Date, restrictedDates: Date[][]): boolean {
    if (!restrictedDates) return false;
    return restrictedDates.some(
        ([startDate, endDate]) => isDateWithinRange(startDate, start, end) || isDateWithinRange(endDate, start, end)
    );
}
/**
 * Adjusts the date to the availability of the parking space
 * @returns ``date`` or availability start/end date
 */
export function adjustDateToAvailability(date: Date, parkingspace: parkingSpace, isStartDate: boolean): Date {
    const availabilityStartDate = new Date(parkingspace.availability_start_date!);
    const availabilityEndDate = new Date(parkingspace.availability_end_date!);

    if (isStartDate && date < availabilityStartDate) return availabilityStartDate;
    if (!isStartDate && date > availabilityEndDate) return availabilityEndDate;
    return date;
}
