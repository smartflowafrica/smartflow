import prisma from '@/lib/prisma';
import { addMinutes, format, getDay, isAfter, isBefore, isEqual, parse, set, startOfDay, addDays } from 'date-fns';

export class AvailabilityChecker {
    private static NIGERIAN_HOLIDAYS = [
        '01-01', // New Year's Day
        '05-01', // Workers' Day
        '06-12', // Democracy Day
        '10-01', // Independence Day
        '12-25', // Christmas Day
        '12-26', // Boxing Day
    ];

    /**
     * Get available slots for a specific date and service
     */
    static async getAvailableSlots(params: {
        serviceId?: string; // Optional if just checking general availability
        clientId: string;
        branchId?: string;
        date: Date;
        duration?: number;
    }): Promise<Array<{ start: Date; end: Date; resource?: string }>> {
        const { serviceId, clientId, branchId, date, duration = 30 } = params;

        // 1. Check if it's a holiday
        if (this.isHoliday(date)) {
            return [];
        }

        // 2. Fetch Rules and Slots
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            include: {
                bookingRule: true,
                timeSlots: {
                    where: {
                        dayOfWeek: getDay(date),
                        branchId: branchId || null // Strict filtering: specific branch or global (if null passed, it fetches global)
                    }
                }
            }
        });

        if (!client || !client.timeSlots.length) return [];

        const rule = client.bookingRule;
        const buffer = rule?.bufferMinutes || 0;

        // 3. Fetch Existing Appointments
        const startOfDayDate = startOfDay(date);
        const endOfDayDate = addDays(startOfDayDate, 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                clientId,
                branchId: branchId || null,
                date: {
                    gte: startOfDayDate,
                    lt: endOfDayDate
                },
                status: { notIn: ['CANCELLED', 'NO_SHOW'] }
            }
        });

        // 4. Generate candidate slots from TimeSlots
        const availableSlots: Array<{ start: Date; end: Date; resource?: string }> = [];

        for (const slot of client.timeSlots) {
            // Parse HH:MM to Date objects for today
            const slotStart = this.parseTime(date, slot.startTime);
            const slotEnd = this.parseTime(date, slot.endTime);

            let currentPointer = slotStart;

            // Iterate through the time slot in chunks of (duration + buffer)
            // But usually slots are fixed blocks (e.g. 9:00, 9:30). 
            // Or is it flexible? "Fit anywhere"?
            // Let's assume discrete slots based on duration.

            while (addMinutes(currentPointer, duration).getTime() <= slotEnd.getTime()) {
                const potentialEnd = addMinutes(currentPointer, duration);

                // Check conflicts
                const hasConflict = appointments.some(apt => {
                    const aptStart = new Date(apt.date); // Prisma returns Date
                    const aptEnd = addMinutes(aptStart, apt.duration + buffer); // Include buffer in conflict check? 
                    // Usually buffer is after appointment.

                    const checkStart = currentPointer;
                    const checkEnd = addMinutes(potentialEnd, buffer); // We need buffer after us too prior to next

                    // Overlap logic
                    return (
                        (checkStart < aptEnd && checkEnd > aptStart)
                    );
                });

                if (!hasConflict) {
                    // Check advance booking rules?
                    // Assuming date passed in is already valid for advance booking window

                    availableSlots.push({
                        start: currentPointer,
                        end: potentialEnd,
                        resource: slot.resourceId || undefined
                    });
                }

                // Move pointer
                // Strategy: Next slot starts immediately after this potential one + buffer??
                // Or rigid grid? E.g. every 30 mins regardless of duration? 
                // Let's use flexible: start + duration + buffer
                // But for "getAvailableSlots" typically users want to see start times.
                // If duration is 60m, slots could be 9:00, 10:00 (if buffer 0).

                currentPointer = addMinutes(currentPointer, duration + buffer);
            }
        }

        return availableSlots;
    }

    /**
     * Check if a specific single slot is available
     */
    static async isSlotAvailable(params: {
        clientId: string;
        branchId?: string;
        serviceId?: string;
        startTime: Date;
        duration: number;
        resource?: string;
    }): Promise<{ available: boolean; conflict?: string }> {
        const { clientId, branchId, startTime, duration } = params;

        // Check Holiday
        if (this.isHoliday(startTime)) return { available: false, conflict: 'Holiday' };

        // Check Business Hours (TimeSlots)
        const dayOfWeek = getDay(startTime);
        const slots = await prisma.timeSlot.findMany({
            where: { clientId, branchId: branchId || null, dayOfWeek }
        });

        const timeStr = format(startTime, 'HH:mm');
        const fittingSlot = slots.find(s => s.startTime <= timeStr && s.endTime >= format(addMinutes(startTime, duration), 'HH:mm')); // Simple string compare works for HH:MM format

        // This simple string compare is risky if span crosses midnight, but for day-only biz it's fine.
        // Better to use Date comparison if full timestamps.

        // Let's re-verify with date objects
        const slotMatch = slots.find(s => {
            const sStart = this.parseTime(startTime, s.startTime);
            const sEnd = this.parseTime(startTime, s.endTime);
            const reqEnd = addMinutes(startTime, duration);
            return startTime >= sStart && reqEnd <= sEnd;
        });

        if (!slotMatch) return { available: false, conflict: 'Outside business hours' };

        // Check Appointments
        const rule = await prisma.bookingRule.findUnique({ where: { clientId } });
        const buffer = rule?.bufferMinutes || 0;

        const conflict = await prisma.appointment.findFirst({
            where: {
                clientId,
                branchId: branchId || null,
                date: {
                    gte: startOfDay(startTime),
                    lt: addDays(startOfDay(startTime), 1)
                },
                status: { notIn: ['CANCELLED', 'NO_SHOW'] },
                // Overlap check
                // (ExistingStart < NewEnd) AND (ExistingEnd > NewStart)
                // New range with buffer: [NewStart, NewEnd + Buffer]
            }
        });

        // We need to fetch and filter in memory or do complex raw query for overlap
        // Prisma filter for overlap is tricky. Fetching day's appointments is safer/easier.

        // Let's reuse fetch from getAvailableSlots strategy or just fetch day.
        // Doing the check above in getAvailableSlots was in-memory which is fine for <100 apts/day.

        const dayApts = await prisma.appointment.findMany({
            where: {
                clientId,
                branchId: branchId || null,
                date: {
                    gte: startOfDay(startTime),
                    lt: addDays(startOfDay(startTime), 1)
                },
                status: { notIn: ['CANCELLED', 'NO_SHOW'] }
            }
        });

        const hasConflict = dayApts.some(apt => {
            const aptStart = new Date(apt.date);
            const aptEnd = addMinutes(aptStart, apt.duration + buffer);

            const reqStart = startTime;
            const reqEnd = addMinutes(startTime, duration + buffer);

            return (reqStart < aptEnd && reqEnd > aptStart);
        });

        if (hasConflict) return { available: false, conflict: 'Slot taken' };

        return { available: true };
    }

    static async generateTimeSlots(params: {
        clientId: string;
        startDate: Date;
        endDate: Date;
        serviceId?: string;
    }): Promise<Array<{ date: Date; slots: Array<{ time: string; available: boolean }> }>> {
        const { clientId, startDate, endDate, serviceId } = params;
        const result = [];
        let current = new Date(startDate);

        // Limit loop for safety
        let loopCount = 0;
        while (current <= endDate && loopCount < 60) {
            const slots = await this.getAvailableSlots({
                clientId,
                serviceId,
                date: current,
                duration: 30 // Default or fetch service duration?
            });

            result.push({
                date: new Date(current),
                slots: slots.map(s => ({
                    time: format(s.start, 'HH:mm'),
                    available: true // getAvailableSlots returns ONLY available ones
                }))
            });

            current = addDays(current, 1);
            loopCount++;
        }

        return result;
    }

    // Helpers
    private static isHoliday(date: Date): boolean {
        const dateStr = format(date, 'MM-dd');
        return this.NIGERIAN_HOLIDAYS.includes(dateStr);
    }

    private static parseTime(baseDate: Date, timeStr: string): Date {
        // timeStr is HH:MM
        return parse(timeStr, 'HH:mm', baseDate);
    }
}
