
import prisma from '../lib/prisma';

async function main() {
    try {
        const msg = await prisma.message.findFirst({
            orderBy: { timestamp: 'desc' },
            include: { conversation: true }
        });
        console.log('LATEST_MESSAGE:', JSON.stringify(msg, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main();
