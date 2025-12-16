// scripts/diagnose-database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function diagnoseDatabaseIssues() {
  try {
    console.log('\n🔍 Running comprehensive database diagnostics...\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('1️⃣  DATABASE CONNECTION TEST');
    console.log('═══════════════════════════════════════════════════════════');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    console.log(`📍 Connected to: ${process.env.DATABASE_URL?.split('@')[1]?.split('?')[0] || 'Unknown'}\n`);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('2️⃣  USER TABLE CHECK');
    console.log('═══════════════════════════════════════════════════════════');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`Total users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('⚠️  WARNING: No users found in the database!');
      console.log('   This could mean:');
      console.log('   - You\'re connected to the wrong database');
      console.log('   - The User table is empty');
      console.log('   - Migrations haven\'t been run\n');
    } else {
      console.log(`✅ Found ${userCount} users\n`);
      
      // Get sample user
      const sampleUser = await prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      
      console.log('Sample user:');
      console.log(JSON.stringify(sampleUser, null, 2));
      console.log('');
    }
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('3️⃣  JOBS TABLE CHECK');
    console.log('═══════════════════════════════════════════════════════════');
    
    const jobCount = await prisma.job.count();
    console.log(`Total jobs in database: ${jobCount}`);
    
    if (jobCount > 0) {
      const sampleJob = await prisma.job.findFirst({
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
          createdAt: true,
        },
      });
      
      console.log('\nSample job:');
      console.log(`Title: ${sampleJob?.title}`);
      console.log(`Company: ${sampleJob?.company}`);
      console.log(`Description preview: ${sampleJob?.description?.substring(0, 100)}...`);
      console.log(`Created: ${sampleJob?.createdAt}`);
    }
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('4️⃣  ACCOUNTS TABLE CHECK');
    console.log('═══════════════════════════════════════════════════════════');
    
    const accountCount = await prisma.account.count();
    console.log(`Total accounts (auth providers): ${accountCount}\n`);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('5️⃣  SESSION TABLE CHECK');
    console.log('═══════════════════════════════════════════════════════════');
    
    const sessionCount = await prisma.session.count();
    console.log(`Total active sessions: ${sessionCount}\n`);
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('6️⃣  DATABASE TABLES LIST');
    console.log('═══════════════════════════════════════════════════════════');
    
    // Query to get all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    ` as Array<{ table_name: string }>;
    
    console.log('Tables in database:');
    tables.forEach((table) => {
      console.log(`   - ${table.table_name}`);
    });
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('7️⃣  RECENT ACTIVITY');
    console.log('═══════════════════════════════════════════════════════════');
    
    const recentUsers = await prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });
    
    console.log('Most recent users:');
    recentUsers.forEach((user, idx) => {
      console.log(`   ${idx + 1}. ${user.name} (${user.email}) - ${new Date(user.createdAt).toLocaleString()}`);
    });
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('8️⃣  DATABASE SCHEMA VERSION');
    console.log('═══════════════════════════════════════════════════════════');
    
    // Check migrations
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at 
      FROM _prisma_migrations 
      ORDER BY finished_at DESC 
      LIMIT 5;
    ` as Array<{ migration_name: string; finished_at: Date }>;
    
    console.log('Recent migrations:');
    migrations.forEach((migration, idx) => {
      console.log(`   ${idx + 1}. ${migration.migration_name}`);
      console.log(`      Applied: ${new Date(migration.finished_at).toLocaleString()}`);
    });
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ DIAGNOSTICS COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ ERROR during diagnostics:', error);
    console.log('\nPossible issues:');
    console.log('   - Database connection string is incorrect');
    console.log('   - Database migrations haven\'t been run');
    console.log('   - Network/firewall issues');
    console.log('   - Database credentials are invalid\n');
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseDatabaseIssues();
