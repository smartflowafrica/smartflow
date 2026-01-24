import { NextResponse } from 'next/server';
import { AvailabilityChecker } from '@/lib/services/booking/AvailabilityChecker';
import { parseISO } from 'date-fns';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get('date');
        const clientId = searchParams.get('clientId');
        const branchId = searchParams.get('branchId') || undefined;
        const serviceId = searchParams.get('serviceId') || undefined;
        const durationStr = searchParams.get('duration');

        if (!dateStr || !clientId) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

        const date = parseISO(dateStr);
        const duration = durationStr ? parseInt(durationStr) : 30;

        const slots = await AvailabilityChecker.getAvailableSlots({
            clientId,
            branchId,
            serviceId,
            date,
            duration
        });

        // Format for frontend
        const formattedSlots = slots.map(s => ({
            startTime: s.start.toISOString(),
            endTime: s.end.toISOString(),
            formattedTime: s.start.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
            resource: s.resource
        }));

        return NextResponse.json({
            date: date.toISOString(),
            availableSlots: formattedSlots,
            meta: {
                totalDetails: formattedSlots.length,
                isHoliday: false // Checker handles exclusion, but we could expose it if needed
            }
        });

    } catch (error: any) {
        console.error('Availability Check Error:', error);
        return NextResponse.json({
            error: 'Availability check failed',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
