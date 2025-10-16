import { NextRequest, NextResponse } from 'next/server';
import { RemoteOKImporter } from '~/lib/job-import/remoteok';
import { db } from '~/server/db';
import { JobType, ExperienceLevel } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // Check for authorization header (optional security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('🚀 Cron job triggered: Daily job import');
    
    // Run daily import using RemoteOKImporter
    const importer = new RemoteOKImporter();
    const jobs = await importer.importJobs();
    
    const createdJobs = [];
    const errors = [];

    for (const jobData of jobs) {
      try {
        // Find or create company
        let company = await db.company.findFirst({
          where: { name: jobData.company }
        });

        if (!company) {
          company = await db.company.create({
            data: {
              name: jobData.company,
              location: jobData.location || 'Remote',
              website: jobData.companyUrl || null,
              description: null,
              logo: null,
              verified: false
            }
          });
        }

        // Check for duplicate job
        const existingJob = await db.job.findFirst({
          where: {
            title: jobData.title,
            companyId: company.id,
            applicationUrl: jobData.applicationUrl
          }
        });

        if (existingJob) {
          console.log(`⏭️ Skipping duplicate job: ${jobData.title} at ${jobData.company}`);
          continue;
        }

        // Create job
        const job = await db.job.create({
          data: {
            title: jobData.title,
            description: jobData.description,
            location: jobData.location || 'Remote',
            country: jobData.country || null,
            jobType: jobData.jobType as JobType,
            experienceLevel: jobData.experienceLevel as ExperienceLevel,
            salaryMin: jobData.salaryMin || null,
            salaryMax: jobData.salaryMax || null,
            visaSponsorship: jobData.visaSponsorship || false,
            remote: jobData.remote || false,
            applicationUrl: jobData.applicationUrl,
            companyId: company.id,
            premium: false,
            featured: false,
            active: true
          }
        });

        createdJobs.push(job);
        console.log(`✅ Created job: ${job.title} at ${company.name}`);
      } catch (error) {
        errors.push({ 
          job: jobData.title, 
          company: jobData.company, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        console.error(`❌ Error creating job ${jobData.title}:`, error);
      }
    }
    
    console.log(`📊 Import completed: ${createdJobs.length} jobs created, ${errors.length} errors`);
    
    return NextResponse.json({
      success: true,
      message: 'Daily import completed',
      result: {
        imported: createdJobs.length,
        total: jobs.length,
        errors: errors
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Also support GET for easy testing
export async function GET() {
  return NextResponse.json({
    message: 'Daily import cron endpoint',
    usage: 'POST to trigger daily import',
    timestamp: new Date().toISOString()
  });
}


