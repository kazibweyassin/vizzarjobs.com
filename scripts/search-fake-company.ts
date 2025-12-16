// Search for fake company
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function searchFakeCompany() {
  try {
    console.log('\n🔍 Searching for VIZAID TRAVEL CONSULT...\n');
    
    // Search for the company
    const companies = await prisma.company.findMany({
      where: {
        OR: [
          { name: { contains: 'VIZAID', mode: 'insensitive' } },
          { name: { contains: 'Vizaid', mode: 'insensitive' } },
          { name: { contains: 'vizaid', mode: 'insensitive' } },
        ]
      },
      include: {
        jobs: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          }
        },
        _count: {
          select: {
            jobs: true
          }
        }
      }
    });
    
    if (companies.length === 0) {
      console.log('❌ No companies found with "VIZAID" in the name');
      
      // Search in jobs table directly
      console.log('\n🔍 Searching in job descriptions...\n');
      const jobs = await prisma.job.findMany({
        where: {
          OR: [
            { description: { contains: 'VIZAID', mode: 'insensitive' } },
            { title: { contains: 'VIZAID', mode: 'insensitive' } },
          ]
        },
        include: {
          company: true
        },
        take: 10
      });
      
      if (jobs.length > 0) {
        console.log(`Found ${jobs.length} jobs mentioning VIZAID:\n`);
        jobs.forEach((job, idx) => {
          console.log(`${idx + 1}. ${job.title}`);
          console.log(`   Company ID: ${job.companyId}`);
          console.log(`   Company: ${job.company?.name || 'N/A'}`);
          console.log(`   Job ID: ${job.id}`);
          console.log(`   Created: ${job.createdAt}`);
          console.log('');
        });
      } else {
        console.log('❌ No jobs found mentioning VIZAID');
      }
    } else {
      console.log(`✅ Found ${companies.length} company/companies:\n`);
      
      companies.forEach((company, idx) => {
        console.log(`${idx + 1}. ${company.name}`);
        console.log(`   ID: ${company.id}`);
        console.log(`   Description: ${company.description?.substring(0, 100) || 'N/A'}`);
        console.log(`   Website: ${company.website || 'N/A'}`);
        console.log(`   Location: ${company.location || 'N/A'}`);
        console.log(`   Jobs count: ${company._count.jobs}`);
        console.log(`   Verified: ${company.verified ? '✅' : '❌'}`);
        console.log(`   Created: ${company.createdAt}`);
        
        if (company.jobs.length > 0) {
          console.log(`   Jobs:`);
          company.jobs.forEach(job => {
            console.log(`     - ${job.title} (${job.id})`);
          });
        }
        console.log('');
      });
      
      // Ask if they want to delete it
      console.log('═══════════════════════════════════════════════════════════');
      console.log('⚠️  This appears to be a fake company!');
      console.log('═══════════════════════════════════════════════════════════\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

searchFakeCompany();
