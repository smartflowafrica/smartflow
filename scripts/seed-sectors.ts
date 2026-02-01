
const { PrismaClient } = require('@prisma/client');
const { BUSINESS_TYPES } = require('../lib/config/business-types');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Business Sectors...');

    // Convert object values to array
    const sectors = Object.values(BUSINESS_TYPES);

    for (const sector of sectors) {
        // We need to map the config to the DB schema
        // Schema: id, name, code, icon, color, config
        // Config: id, name, icon, ... (rest is likely 'config' json)

        // Config object has:
        // terminology, statusStages, quickActions, dashboardSections, defaultServices, metrics, serviceCategories
        // All these should go into 'config' JSON column probably?

        const { id, name, icon, ...rest } = sector;
        // We assume 'color' is missing in root config? 
        // Wait, statusStages has color.
        // Let's pick a primary color or default.
        const color = '#3B82F6'; // Default Blue

        // code should comprise the ID or explicit code?
        // In config 'id' is 'AUTO_MECHANIC'. Schema has 'code'.
        // Let's use 'id' as 'code' too.

        console.log(`Upserting Sector: ${name} (${id})`);

        await prisma.businessSector.upsert({
            where: { id: id }, // Use the static ID
            update: {
                name: name,
                code: id,
                icon: icon,
                color: color,
                config: rest
            },
            create: {
                id: id,
                name: name,
                code: id,
                icon: icon,
                color: color,
                config: rest
            }
        });
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
