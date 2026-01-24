import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const faqSchema = z.object({
    question: z.string().min(3, 'Question must be at least 3 characters'),
    answer: z.string().min(1, 'Answer is required'),
    keywords: z.array(z.string()).optional().default([]),
    isActive: z.boolean().optional().default(true),
    priority: z.number().optional().default(0)
});

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { clientId: true }
        });

        if (!dbUser?.clientId) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const faqs = await prisma.fAQ.findMany({
            where: { clientId: dbUser.clientId },
            orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
        });

        return NextResponse.json({ data: faqs });

    } catch (error) {
        console.error('FAQ GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { clientId: true }
        });

        if (!dbUser?.clientId) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        const body = await request.json();
        const result = faqSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues }, { status: 400 });
        }

        const faq = await prisma.fAQ.create({
            data: {
                clientId: dbUser.clientId,
                ...result.data
            }
        });

        return NextResponse.json({ data: faq }, { status: 201 });

    } catch (error) {
        console.error('FAQ POST Error:', error);
        return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
    }
}
