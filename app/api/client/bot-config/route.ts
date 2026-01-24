import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

        // Get user's client
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { client: true }
        });

        if (!user?.clientId) return new NextResponse('Client not found', { status: 404 });

        const config = await prisma.botConfig.findUnique({
            where: { clientId: user.clientId }
        });

        // Return default structure if undefined
        return NextResponse.json(config || {
            isEnabled: true,
            greetingMessage: '',
            fallbackMessage: '',
            workingHoursOnly: false,
            autoEscalate: true
        });

    } catch (error) {
        console.error('Error fetching bot config:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user?.clientId) return new NextResponse('Client not found', { status: 404 });

        const data = await req.json();

        const config = await prisma.botConfig.upsert({
            where: { clientId: user.clientId },
            update: {
                greetingMessage: data.greetingMessage,
                fallbackMessage: data.fallbackMessage,
                workingHoursOnly: data.workingHoursOnly,
                isEnabled: data.isEnabled
            },
            create: {
                clientId: user.clientId,
                greetingMessage: data.greetingMessage,
                fallbackMessage: data.fallbackMessage,
                workingHoursOnly: data.workingHoursOnly,
                isEnabled: data.isEnabled
            }
        });

        return NextResponse.json(config);

    } catch (error) {
        console.error('Error updating bot config:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
