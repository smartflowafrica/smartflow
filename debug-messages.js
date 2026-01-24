const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugAndReset() {
    console.log('--- Checking Recent Messages (Last 20) ---');
    const messages = await prisma.message.findMany({
        orderBy: { timestamp: 'desc' },
        take: 3,
        select: {
            id: true,
            messageText: true,
            handledBy: true,
            status: true,
            metadata: true
        }
    });

    console.log(JSON.stringify(messages, null, 2));

    console.log('\n--- Checking Conversations ---');
    const conversations = await prisma.conversation.findMany({
        orderBy: { lastMessageAt: 'desc' },
        take: 5
    });
    console.log(JSON.stringify(conversations, null, 2));

    console.log('\n--- Resetting Status ---');
    // Reset status
    try {
        const updateResult = await prisma.conversation.updateMany({
            where: { status: 'HUMAN_HANDLING' },
            data: { status: 'ACTIVE', metadata: { flowState: null } }
        });
        console.log(`✅ Reset ${updateResult.count} conversations from HUMAN_HANDLING to ACTIVE`);
    } catch (e) {
        console.error('Failed to reset:', e);
    }

    await prisma.$disconnect();
}

debugAndReset();
