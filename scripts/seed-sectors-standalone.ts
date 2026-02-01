
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Inline Data from lib/config/business-types.ts to avoid import issues
const BUSINESS_TYPES = {
    AUTO_MECHANIC: {
        id: 'AUTO_MECHANIC',
        name: 'Auto Mechanic Shop',
        icon: '🔧',
        color: '#3B82F6',
        // Minimal config needed for DB
        config: {
            terminology: { job: 'Job', customer: 'Customer' },
            defaultServices: ['Oil Change', 'Brake Service']
        }
    },
    RESTAURANT: {
        id: 'RESTAURANT',
        name: 'Restaurant/Food Business',
        icon: '🍲',
        color: '#F59E0B',
        config: {
            terminology: { job: 'Order', customer: 'Customer' },
            defaultServices: ['Jollof Rice', 'Fried Rice']
        }
    },
    SALON: {
        id: 'SALON',
        name: 'Salon/Spa/Beauty',
        icon: '💇',
        color: '#EC4899',
        config: {
            terminology: { job: 'Appointment', customer: 'Client' },
            defaultServices: ['Hair Cut', 'Manicure']
        }
    },
    HOTEL: {
        id: 'HOTEL',
        name: 'Hotel/Hospitality',
        icon: '🏨',
        color: '#10B981',
        config: {
            terminology: { job: 'Reservation', customer: 'Guest' },
            defaultServices: ['Standard Room', 'Suite']
        }
    },
    RETAIL: {
        id: 'RETAIL',
        name: 'Retail Store',
        icon: '🛍️',
        color: '#8B5CF6',
        config: {
            terminology: { job: 'Order', customer: 'Customer' },
            defaultServices: ['Product A', 'Product B']
        }
    },
    HEALTHCARE: {
        id: 'HEALTHCARE',
        name: 'Healthcare/Clinic',
        icon: '🏥',
        color: '#EF4444',
        config: {
            terminology: { job: 'Appointment', customer: 'Patient' },
            defaultServices: ['Consultation', 'Checkup']
        }
    }
    // Add others if strictly needed, but these cover the main ones
};

async function main() {
    console.log('Seeding Business Sectors (Standalone)...');

    const sectors = Object.values(BUSINESS_TYPES);

    for (const sector of sectors) {
        const { id, name, icon, color, config } = sector;

        console.log(`Upserting Sector: ${name} (${id})`);

        // Use 'any' to bypass strict type check on 'config' matching JsonValue
        await prisma.businessSector.upsert({
            where: { id: id },
            update: {
                name: name,
                code: id,
                icon: icon,
                color: color || '#3B82F6',
                config: config
            },
            create: {
                id: id,
                name: name,
                code: id,
                icon: icon,
                color: color || '#3B82F6',
                config: config
            }
        });
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
