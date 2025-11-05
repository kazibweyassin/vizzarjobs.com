import { PrismaClient } from '@prisma/client';
import { RemoteOKImporter } from '../src/lib/job-import/remoteok';

const prisma = new PrismaClient();
const importer = new RemoteOKImporter();

/**
 * Clean all existing RemoteOK jobs in the database
 * Uses the enhanced cleaning functions from RemoteOKImporter
 */
async function cleanRemoteOKJobs() {
  try {
    console.log('🔍 Fetching RemoteOK jobs from database...');
    
    // Find all jobs that might be from RemoteOK (we can identify by checking if they're remote)
    // Or we could add a source field, but for now we'll clean all remote jobs
    const remoteJobs = await prisma.job.findMany({
      where: {
        remote: true,
        // You can add more filters here if needed
        // e.g., applicationUrl: { contains: 'remoteok.com' }
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        country: true,
        salaryMin: true,
        salaryMax: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log(`📊 Found ${remoteJobs.length} remote jobs to check...\n`);

    let cleanedCount = 0;
    let unchangedCount = 0;
    let salaryUpdatedCount = 0;
    let locationUpdatedCount = 0;

    for (const job of remoteJobs) {
      if (!job.description) {
        unchangedCount++;
        continue;
      }

      let hasChanges = false;
      const updates: {
        description?: string;
        salaryMin?: number | null;
        salaryMax?: number | null;
        location?: string;
        country?: string | null;
      } = {};

      // Clean description
      const cleanedDescription = importer.cleanDescription(job.description);
      if (cleanedDescription !== job.description) {
        updates.description = cleanedDescription;
        hasChanges = true;
      }

      // Try to extract salary from description if not already set
      if (!job.salaryMin || !job.salaryMax) {
        const salaryInfo = importer.extractSalaryFromText(cleanedDescription);
        if (salaryInfo.salaryMin && salaryInfo.salaryMax) {
          updates.salaryMin = salaryInfo.salaryMin;
          updates.salaryMax = salaryInfo.salaryMax;
          hasChanges = true;
          salaryUpdatedCount++;
        }
      }

      // Try to improve location/country extraction
      const locationInfo = importer.extractLocationFromText(
        job.location || 'Remote',
        cleanedDescription
      );
      if (locationInfo.location !== job.location || locationInfo.country !== job.country) {
        updates.location = locationInfo.location;
        updates.country = locationInfo.country;
        hasChanges = true;
        if (locationInfo.location !== job.location || locationInfo.country !== job.country) {
          locationUpdatedCount++;
        }
      }

      if (hasChanges) {
        await prisma.job.update({
          where: { id: job.id },
          data: updates,
        });

        cleanedCount++;
        const changes = [];
        if (updates.description) changes.push('description');
        if (updates.salaryMin !== undefined) changes.push('salary');
        if (updates.location) changes.push('location');
        
        console.log(
          `✅ Cleaned: ${job.title.substring(0, 50)}... (${changes.join(', ')})`
        );
      } else {
        unchangedCount++;
      }
    }

    console.log('\n📈 Summary:');
    console.log(`   ✅ Cleaned: ${cleanedCount} jobs`);
    console.log(`   💰 Salary updated: ${salaryUpdatedCount} jobs`);
    console.log(`   📍 Location updated: ${locationUpdatedCount} jobs`);
    console.log(`   ⏭️  Unchanged: ${unchangedCount} jobs`);
    console.log(`   📊 Total: ${remoteJobs.length} jobs`);

    if (cleanedCount > 0) {
      console.log('\n✨ All RemoteOK jobs have been cleaned successfully!');
    } else {
      console.log('\n✨ No cleaning needed - all jobs are already clean!');
    }
  } catch (error) {
    console.error('❌ Error cleaning RemoteOK jobs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleaning script
cleanRemoteOKJobs()
  .then(() => {
    console.log('\n🎉 RemoteOK job cleaning completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ RemoteOK job cleaning failed:', error);
    process.exit(1);
  });

