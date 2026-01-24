const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL || process.env.DATABASE_URL
        }
    }
})

async function main() {
    console.log('Start seeding sectors...')

    const sectors = [
        {
            name: 'Auto Repair & Mechanics',
            code: 'auto_repair',
            icon: '🚗',
            color: '#ef4444',
            config: {
                features: ['vehicle_tracking', 'service_reminders', 'parts_inventory'],
                terminology: {
                    customer: 'Vehicle Owner',
                    job: 'Repair Job',
                    service: 'Service'
                }
            }
        },
        {
            name: 'Retail & Supermarket',
            code: 'retail',
            icon: '🛒',
            color: '#f59e0b',
            config: {
                features: ['pos_integration', 'inventory_management', 'loyalty_program'],
                terminology: {
                    customer: 'Shopper',
                    job: 'Order',
                    service: 'Product'
                }
            }
        },
        {
            name: 'Healthcare & Clinics',
            code: 'healthcare',
            icon: '🏥',
            color: '#0ea5e9',
            config: {
                features: ['patient_records', 'appointment_scheduling', 'prescription_tracking'],
                terminology: {
                    customer: 'Patient',
                    job: 'Consultation',
                    service: 'Treatment'
                }
            }
        },
        {
            name: 'Beauty & Salon',
            code: 'salon',
            icon: '✂️',
            color: '#d946ef',
            config: {
                features: ['stylist_booking', 'style_history', 'product_sales'],
                terminology: {
                    customer: 'Client',
                    job: 'Appointment',
                    service: 'Style'
                }
            }
        },
        {
            name: 'Real Estate',
            code: 'real_estate',
            icon: '🏠',
            color: '#10b981',
            config: {
                features: ['property_listings', 'viewing_scheduler', 'tenant_management'],
                terminology: {
                    customer: 'Tenant/Buyer',
                    job: 'Viewing/Lease',
                    service: 'Property'
                }
            }
        }
    ]

    for (const sector of sectors) {
        const s = await prisma.businessSector.upsert({
            where: { code: sector.code },
            update: sector,
            create: sector,
        })
        console.log(`Upserted sector: ${s.name}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
