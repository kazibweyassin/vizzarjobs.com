// scripts/check-jobs.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkJobs() {
  try {
    const totalJobs = await prisma.job.count();
    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { company: true },
    });

    console.log(`\n📊 Total Jobs in Database: ${totalJobs}\n`);
    
    if (recentJobs.length > 0) {
      console.log('Recent Jobs:');
      recentJobs.forEach((job, index) => {
        console.log(`\n${index + 1}. ${job.title}`);
        console.log(`   Company: ${job.company.name}`);
        console.log(`   Location: ${job.location || 'Not specified'}`);
        console.log(`   Created: ${new Date(job.createdAt).toLocaleString()}`);
      });
    } else {
      console.log('No jobs found in database.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkJobs();

