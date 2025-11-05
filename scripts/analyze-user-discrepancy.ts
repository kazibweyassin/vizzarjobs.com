// scripts/analyze-user-discrepancy.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function analyzeUserDiscrepancy() {
  try {
    console.log('\n🔍 Analyzing user data vs. analytics discrepancy...\n');

    // Get all users
    const totalUsers = await prisma.user.count();
    const usersLast30Days = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get all sessions
    const totalSessions = await prisma.session.count();
    const sessionsLast30Days = await prisma.session.count({
      where: {
        expires: {
          gte: new Date(),
        },
      },
    });

    // Get all accounts (OAuth providers)
    const totalAccounts = await prisma.account.count();
    const accountsLast30Days = await prisma.account.count({
      where: {
        user: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    // Get users by signup method
    const usersWithPassword = await prisma.user.count({
      where: {
        password: {
          not: null,
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const usersWithOAuth = await prisma.user.count({
      where: {
        accounts: {
          some: {},
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Get breakdown by provider
    const accountsByProvider = await prisma.account.groupBy({
      by: ['provider'],
      _count: {
        id: true,
      },
    });

    // Get users created in last 30 days with details
    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        password: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 DISCREPANCY ANALYSIS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`\n🔢 Google Analytics: 85 new users (last 30 days)`);
    console.log(`📝 Database Users: ${usersLast30Days} new users (last 30 days)`);
    console.log(`📊 Total Database Users: ${totalUsers}`);
    console.log(`\n⚠️  Difference: ${85 - usersLast30Days} users\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔍 WHY THE DISCREPANCY?');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\nGoogle Analytics counts:');
    console.log('  • Unique visitors to your website');
    console.log('  • People who view pages (even without signing up)');
    console.log('  • Bot traffic (if not filtered)');
    console.log('  • People who start but don\'t complete signup');
    console.log('\nDatabase Users only count:');
    console.log('  • People who COMPLETED registration/signup');
    console.log('  • Accounts that were successfully created\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📈 DATABASE STATISTICS (Last 30 Days)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   👥 Users created: ${usersLast30Days}`);
    console.log(`   🔐 Sessions: ${sessionsLast30Days}`);
    console.log(`   🔗 OAuth Accounts: ${accountsLast30Days}`);
    console.log(`   🔑 Password signups: ${usersWithPassword}`);
    console.log(`   🌐 OAuth signups: ${usersWithOAuth}\n`);

    if (accountsByProvider.length > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🌐 OAuth PROVIDERS BREAKDOWN');
      console.log('═══════════════════════════════════════════════════════════');
      accountsByProvider.forEach(({ provider, _count }) => {
        console.log(`   ${provider}: ${_count.id} accounts`);
      });
      console.log('');
    }

    if (recentUsers.length > 0) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log('👥 RECENT USERS (Last 30 Days)');
      console.log('═══════════════════════════════════════════════════════════\n');
      recentUsers.forEach((user, index) => {
        const signupMethod = user.password ? '🔑 Password' : user.accounts.length > 0 ? `🌐 ${user.accounts[0]?.provider || 'OAuth'}` : '❓ Unknown';
        const createdDate = new Date(user.createdAt).toLocaleString();
        console.log(`${index + 1}. ${user.name || 'No Name'}`);
        console.log(`   📧 ${user.email}`);
        console.log(`   🎭 Role: ${user.role}`);
        console.log(`   ${signupMethod}`);
        console.log(`   📅 ${createdDate}\n`);
      });
    }

    console.log('═══════════════════════════════════════════════════════════');
    console.log('💡 RECOMMENDATIONS');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n1. Check signup completion rate:');
    console.log(`   - ${85} visitors visited, but only ${usersLast30Days} completed signup`);
    console.log(`   - Conversion rate: ${((usersLast30Days / 85) * 100).toFixed(2)}%`);
    console.log('\n2. Possible reasons for low conversion:');
    console.log('   • Signup form might be too complex');
    console.log('   • Users might be browsing without intent to sign up');
    console.log('   • Technical issues preventing signup completion');
    console.log('   • Bot traffic counted in analytics');
    console.log('\n3. Action items:');
    console.log('   • Review signup flow for friction points');
    console.log('   • Check analytics for bot traffic filtering');
    console.log('   • Consider adding signup tracking events');
    console.log('   • Monitor where users drop off in signup process\n');

  } catch (error) {
    console.error('❌ Error analyzing discrepancy:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
analyzeUserDiscrepancy().catch(console.error);

