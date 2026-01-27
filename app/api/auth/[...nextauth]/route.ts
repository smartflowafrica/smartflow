import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

import { authLimiter } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

const POST = async (req: Request, ctx: any) => {
    try {
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        await authLimiter.consume(ip);
    } catch {
        return NextResponse.json(
            { error: 'Too Many Login Attempts. Please try again later.' },
            { status: 429 }
        );
    }
    return handler(req, ctx);
};

export { handler as GET, POST };
