import { PrismaClient, JobType, ExperienceLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function addVizaidJob() {
  try {
    // Check if company exists
    let company = await prisma.company.findFirst({
      where: {
        name: {
          contains: 'Vizaid',
          mode: 'insensitive'
        }
      }
    });

    // Create company if it doesn't exist
    if (!company) {
      console.log('Creating company: Vizaid Travel Consult');
      company = await prisma.company.create({
        data: {
          name: 'Vizaid Travel Consult',
          description: 'Travel consultancy company based in Kampala, Uganda',
          location: 'Kampala, Uganda',
          industry: 'Travel & Tourism',
          verified: true,
          verificationStatus: 'APPROVED'
        }
      });
      console.log(`✅ Company created with ID: ${company.id}`);
    } else {
      console.log(`✅ Company found: ${company.name} (ID: ${company.id})`);
    }

    // Check if job already exists
    const existingJob = await prisma.job.findFirst({
      where: {
        title: {
          contains: 'Sales and Marketing Executive',
          mode: 'insensitive'
        },
        companyId: company.id
      }
    });

    if (existingJob) {
      console.log('⚠️  Job already exists:');
      console.log(`   Title: ${existingJob.title}`);
      console.log(`   ID: ${existingJob.id}`);
      await prisma.$disconnect();
      return;
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        title: 'Sales and Marketing Executive',
        description: 'We are looking for a dynamic Sales and Marketing Executive to join our team at Vizaid Travel Consult. The ideal candidate will be responsible for developing and implementing sales and marketing strategies to promote our travel services.',
        companyId: company.id,
        location: 'Kampala, Uganda',
        country: 'Uganda',
        jobType: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        applicationUrl: `mailto:vizaidtravel@gmail.com?subject=Application for Sales and Marketing Executive Position`,
        requirements: [
          'Bachelor\'s degree in Marketing, Business Administration, or related field',
          'Proven experience in sales and marketing',
          'Excellent communication and interpersonal skills',
          'Strong organizational and time management skills',
          'Ability to work independently and as part of a team',
          'Knowledge of the travel industry is a plus'
        ],
        skills: [
          'Sales',
          'Marketing',
          'Communication',
          'Customer Relations',
          'Digital Marketing',
          'Social Media Marketing'
        ],
        techStack: [],
        remote: false,
        visaSponsorship: false,
        featured: false,
        premium: false
      },
      include: {
        company: true
      }
    });

    console.log('✅ Job created successfully:');
    console.log(`   Title: ${job.title}`);
    console.log(`   Company: ${job.company.name}`);
    console.log(`   Location: ${job.location}`);
    console.log(`   Application Email: vizaidtravel@gmail.com`);
    console.log(`   Job ID: ${job.id}`);

  } catch (error) {
    console.error('❌ Error adding job:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addVizaidJob();

