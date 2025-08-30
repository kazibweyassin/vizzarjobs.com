const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testJobCreation() {
  try {
    // First, let's check if there are any companies
    const companies = await prisma.company.findMany();
    console.log('Companies found:', companies.length);
    
    if (companies.length === 0) {
      console.log('No companies found. Creating a test company...');
      const testCompany = await prisma.company.create({
        data: {
          name: 'Test Company',
          description: 'A test company for job posting',
          industry: 'Technology',
          location: 'San Francisco, CA'
        }
      });
      console.log('Created test company:', testCompany);
      
      // Now create a test job
      const testJob = await prisma.job.create({
        data: {
          title: 'Test Software Engineer',
          description: 'A test job posting',
          companyId: testCompany.id,
          location: 'San Francisco, CA',
          country: 'United States',
          jobType: 'FULL_TIME',
          experienceLevel: 'MID',
          salaryMin: 80000,
          salaryMax: 120000,
          applicationUrl: 'https://example.com/apply',
          requirements: ['JavaScript', 'React', 'Node.js'],
          techStack: ['TypeScript', 'Next.js', 'PostgreSQL'],
          visaSponsorship: true
        },
        include: {
          company: true
        }
      });
      
      console.log('Successfully created test job:', testJob);
    } else {
      console.log('Using existing company:', companies[0].name);
      
      // Create a test job with existing company
      const testJob = await prisma.job.create({
        data: {
          title: 'Test Software Engineer',
          description: 'A test job posting',
          companyId: companies[0].id,
          location: 'San Francisco, CA',
          country: 'United States',
          jobType: 'FULL_TIME',
          experienceLevel: 'MID',
          salaryMin: 80000,
          salaryMax: 120000,
          applicationUrl: 'https://example.com/apply',
          requirements: ['JavaScript', 'React', 'Node.js'],
          techStack: ['TypeScript', 'Next.js', 'PostgreSQL'],
          visaSponsorship: true
        },
        include: {
          company: true
        }
      });
      
      console.log('Successfully created test job:', testJob);
    }
    
  } catch (error) {
    console.error('Error testing job creation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testJobCreation();

