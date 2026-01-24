// Database verification script
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('=== DATABASE VERIFICATION ===\n');

    // 1. Check if we can connect to the database
    console.log('1. Testing database connection...');
    try {
        await prisma.$connect();
        console.log('   ✅ Database connection successful!\n');
    } catch (error) {
        console.log('   ❌ Database connection failed:', error.message);
        process.exit(1);
    }

    // 2. Check the User table schema by querying a user
    console.log('2. Checking User table schema...');
    try {
        // Try to query with the password field
        const userCount = await prisma.user.count();
        console.log(`   ✅ User table exists with ${userCount} user(s)\n`);
    } catch (error) {
        console.log('   ❌ User table issue:', error.message);
    }

    // 3. List all users with their password field status
    console.log('3. Listing users and password status...');
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                password: true,
                createdAt: true
            }
        });

        if (users.length === 0) {
            console.log('   ⚠️ No users found in database!\n');
        } else {
            users.forEach((user, i) => {
                const hasPassword = !!user.password;
                const passwordLength = user.password ? user.password.length : 0;
                const passwordPreview = user.password ? user.password.substring(0, 20) + '...' : 'NULL';
                console.log(`   User ${i + 1}:`);
                console.log(`     - Email: ${user.email}`);
                console.log(`     - Role: ${user.role}`);
                console.log(`     - Has Password: ${hasPassword ? '✅ Yes' : '❌ No'}`);
                console.log(`     - Password Length: ${passwordLength}`);
                console.log(`     - Password Preview: ${passwordPreview}`);
                console.log('');
            });
        }
    } catch (error) {
        if (error.message.includes('password') && error.message.includes('does not exist')) {
            console.log('   ❌ PASSWORD COLUMN DOES NOT EXIST IN DATABASE!\n');
            console.log('   Solution: Run "npx prisma db push" to sync schema\n');
        } else {
            console.log('   ❌ Error querying users:', error.message);
        }
    }

    // 4. Check Prisma schema for password field
    console.log('4. Summary:');
    console.log('   - If password column is missing, run: npx prisma db push');
    console.log('   - If users have no passwords, run: npx ts-node prisma/seed-users.ts');
    console.log('');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
