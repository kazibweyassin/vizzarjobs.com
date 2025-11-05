// scripts/check-new-users.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkNewUsers() {
  try {
    // Get command line arguments for date range
    const days = process.argv[2] ? parseInt(process.argv[2]) : 7; // Default to last 7 days
    const limit = process.argv[3] ? parseInt(process.argv[3]) : 50; // Default to 50 users

    // Calculate the date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    console.log(`\n🔍 Checking for new users created in the last ${days} day(s)...\n`);

    // Get total count of new users
    const totalNewUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: dateThreshold,
        },
      },
    });

    // Get new users with details
    const newUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: dateThreshold,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verificationStatus: true,
        verified: true,
        premium: true,
        createdAt: true,
        profileComplete: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Display summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total users in database: ${totalUsers}`);
    console.log(`New users (last ${days} days): ${totalNewUsers}`);
    console.log(`Displaying: ${newUsers.length} most recent\n`);

    if (newUsers.length === 0) {
      console.log('✨ No new users found in the specified time period.\n');
    } else {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('👥 NEW USERS');
      console.log('═══════════════════════════════════════════════════════════\n');

      newUsers.forEach((user, index) => {
        const createdDate = new Date(user.createdAt).toLocaleString();
        const verifiedIcon = user.verified ? '✅' : '⏳';
        const premiumIcon = user.premium ? '⭐' : '';
        const profileIcon = user.profileComplete ? '📝' : '📄';

        console.log(`${index + 1}. ${user.name || 'No Name'} ${premiumIcon}`);
        console.log(`   📧 Email: ${user.email || 'N/A'}`);
        console.log(`   🎭 Role: ${user.role}`);
        console.log(`   ${verifiedIcon} Status: ${user.verificationStatus} ${user.verified ? '(Verified)' : ''}`);
        console.log(`   ${profileIcon} Profile: ${user.profileComplete ? 'Complete' : 'Incomplete'}`);
        console.log(`   📅 Created: ${createdDate}`);
        console.log('');
      });
    }

    // Show breakdown by role
    const roleBreakdown = await prisma.user.groupBy({
      by: ['role'],
      where: {
        createdAt: {
          gte: dateThreshold,
        },
      },
      _count: {
        id: true,
      },
    });

    if (roleBreakdown.length > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('📈 BREAKDOWN BY ROLE');
      console.log('═══════════════════════════════════════════════════════════');
      roleBreakdown.forEach(({ role, _count }) => {
        console.log(`   ${role}: ${_count.id}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error checking new users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
checkNewUsers().catch(console.error);

