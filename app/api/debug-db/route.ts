import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const user = 'postgres.ykjxkxyqrrvphlghzgxl';
    const pass = 'Murewa95159%23';
    const host = 'aws-1-eu-west-1.pooler.supabase.com'; // User provided host
    const port = '6543';
    const db = 'postgres';

    const FINAL_URL = `postgresql://${user}:${pass}@${host}:${port}/${db}?pgbouncer=true`;

    try {
        const prisma = new PrismaClient({ datasources: { db: { url: FINAL_URL } } });
        await prisma.$connect();
        const count = await prisma.user.count();
        await prisma.$disconnect();

        return NextResponse.json({
            success: true,
            message: "CONNECTED SUCCESSFULLY!",
            userCount: count,
            verifiedUrl: FINAL_URL
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: (error as Error).message,
            testUrl: FINAL_URL
        }, { status: 500 });
    }
}
