// scripts/list-all-users.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllUsers() {
  try {
    console.log('\n🔍 Fetching all users from database...\n');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verificationStatus: true,
        verified: true,
        premium: true,
        createdAt: true,
        updatedAt: true,
        profileComplete: true,
        bio: true,
        location: true,
        skills: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalUsers = users.length;

    // Display summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 DATABASE SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total users: ${totalUsers}\n`);

    if (users.length === 0) {
      console.log('✨ No users found in the database.\n');
    } else {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('👥 ALL USERS');
      console.log('═══════════════════════════════════════════════════════════\n');

      users.forEach((user, index) => {
        const createdDate = new Date(user.createdAt).toLocaleString();
        const updatedDate = new Date(user.updatedAt).toLocaleString();
        const verifiedIcon = user.verified ? '✅' : '⏳';
        const premiumIcon = user.premium ? '⭐' : '';
        const profileIcon = user.profileComplete ? '📝' : '📄';

        console.log(`${index + 1}. ${user.name || 'No Name'} ${premiumIcon}`);
        console.log(`   🆔 ID: ${user.id}`);
        console.log(`   📧 Email: ${user.email || 'N/A'}`);
        console.log(`   🎭 Role: ${user.role}`);
        console.log(`   ${verifiedIcon} Verification: ${user.verificationStatus} ${user.verified ? '(Verified)' : ''}`);
        console.log(`   ${profileIcon} Profile: ${user.profileComplete ? 'Complete' : 'Incomplete'}`);
        
        if (user.bio) {
          const bioPreview = user.bio.length > 60 ? user.bio.substring(0, 60) + '...' : user.bio;
          console.log(`   📄 Bio: ${bioPreview}`);
        }
        
        if (user.location) {
          console.log(`   📍 Location: ${user.location}`);
        }
        
        if (user.skills && user.skills.length > 0) {
          console.log(`   🛠️  Skills: ${user.skills.join(', ')}`);
        }
        
        console.log(`   📅 Created: ${createdDate}`);
        if (user.updatedAt.getTime() !== user.createdAt.getTime()) {
          console.log(`   🔄 Updated: ${updatedDate}`);
        }
        console.log('');
      });

      // Show breakdown by role
      const roleBreakdown = await prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true,
        },
      });

      console.log('═══════════════════════════════════════════════════════════');
      console.log('📈 BREAKDOWN BY ROLE');
      console.log('═══════════════════════════════════════════════════════════');
      roleBreakdown.forEach(({ role, _count }) => {
        console.log(`   ${role}: ${_count.id}`);
      });
      console.log('');

      // Show breakdown by verification status
      const verificationBreakdown = await prisma.user.groupBy({
        by: ['verificationStatus'],
        _count: {
          id: true,
        },
      });

      console.log('═══════════════════════════════════════════════════════════');
      console.log('🔐 BREAKDOWN BY VERIFICATION STATUS');
      console.log('═══════════════════════════════════════════════════════════');
      verificationBreakdown.forEach(({ verificationStatus, _count }) => {
        console.log(`   ${verificationStatus}: ${_count.id}`);
      });
      console.log('');

      // Show premium users count
      const premiumCount = users.filter(u => u.premium).length;
      const verifiedCount = users.filter(u => u.verified).length;
      const profileCompleteCount = users.filter(u => u.profileComplete).length;

      console.log('═══════════════════════════════════════════════════════════');
      console.log('📊 ADDITIONAL STATISTICS');
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`   ⭐ Premium users: ${premiumCount}`);
      console.log(`   ✅ Verified users: ${verifiedCount}`);
      console.log(`   📝 Complete profiles: ${profileCompleteCount}`);
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
listAllUsers().catch(console.error);

