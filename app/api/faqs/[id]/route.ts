import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const updateFaqSchema = z.object({
    question: z.string().min(3).optional(),
    answer: z.string().min(1).optional(),
    keywords: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
    priority: z.number().optional()
});

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const faq = await prisma.fAQ.findFirst({
            where: { id: params.id, clientId: dbUser.clientId }
        });

        if (!faq) {
            return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        }

        return NextResponse.json({ data: faq });

    } catch (error) {
        console.error('FAQ GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch FAQ' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
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
        const result = updateFaqSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues }, { status: 400 });
        }

        const existing = await prisma.fAQ.findFirst({
            where: { id: params.id, clientId: dbUser.clientId }
        });

        if (!existing) {
            return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        }

        const faq = await prisma.fAQ.update({
            where: { id: params.id },
            data: result.data
        });

        return NextResponse.json({ data: faq });

    } catch (error) {
        console.error('FAQ PUT Error:', error);
        return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const existing = await prisma.fAQ.findFirst({
            where: { id: params.id, clientId: dbUser.clientId }
        });

        if (!existing) {
            return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
        }

        await prisma.fAQ.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('FAQ DELETE Error:', error);
        return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
    }
}
