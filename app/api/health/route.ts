import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Keep-Alive Endpoint
 * 
 * This endpoint is designed to be pinged periodically (e.g., daily) 
 * by an external cron service to prevent Supabase from pausing the project.
 * 
 * It performs a simple database query to keep the connection active.
 */
export async function GET() {
    try {
        // Simple query to keep Supabase active
        const count = await prisma.client.count();

        return NextResponse.json({
            status: 'alive',
            timestamp: new Date().toISOString(),
            clientCount: count,
            message: 'Supabase connection is active'
        });
    } catch (error) {
        console.error('Keep-alive check failed:', error);
        return NextResponse.json({
            status: 'error',
            timestamp: new Date().toISOString(),
            message: 'Database connection failed'
        }, { status: 500 });
    }
}
