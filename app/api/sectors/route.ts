import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const sectors = await prisma.businessSector.findMany({
            include: {
                _count: { select: { clients: true } }
            },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(sectors);
    } catch (error) {
        console.error('Error fetching sectors:', error);
        return NextResponse.json({ error: 'Failed to fetch sectors' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, code, icon, color, config } = body;

        if (!name || !code || !icon || !color) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const sector = await prisma.businessSector.create({
            data: {
                name,
                code: code.toLowerCase().replace(/\s+/g, '_'),
                icon, color,
                config: config || {}
            }
        });

        return NextResponse.json(sector);
    } catch (error) {
        console.error('Error creating sector:', error);
        return NextResponse.json({ error: 'Failed to create sector' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, code, icon, color, config } = body;

        if (!id) {
            return NextResponse.json({ error: 'Sector ID required' }, { status: 400 });
        }

        const sector = await prisma.businessSector.update({
            where: { id },
            data: {
                name,
                code: code.toLowerCase().replace(/\s+/g, '_'),
                icon, color,
                config: config || {}
            }
        });

        return NextResponse.json(sector);
    } catch (error) {
        console.error('Error updating sector:', error);
        return NextResponse.json({ error: 'Failed to update sector' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Sector ID required' }, { status: 400 });
        }

        const sector = await prisma.businessSector.findUnique({
            where: { id },
            include: { _count: { select: { clients: true } } }
        });

        if (sector && sector._count.clients > 0) {
            return NextResponse.json(
                { error: `Cannot delete sector with ${sector._count.clients} active client(s)` },
                { status: 400 }
            );
        }

        await prisma.businessSector.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting sector:', error);
        return NextResponse.json({ error: 'Failed to delete sector' }, { status: 500 });
    }
}
