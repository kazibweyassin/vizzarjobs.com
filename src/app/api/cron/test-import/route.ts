import { NextRequest, NextResponse } from 'next/server';
import { RemoteOKImporter } from '~/lib/job-import/remoteok';
import { db } from '~/server/db';
import { JobType, ExperienceLevel } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test import triggered');
    
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
              description: `Company imported from RemoteOK`,
              website: jobData.applicationUrl,
              verificationStatus: 'PENDING',
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
            companyId: company.id,
            location: jobData.location,
            country: jobData.country,
            jobType: jobData.jobType as JobType,
            experienceLevel: jobData.experienceLevel as ExperienceLevel,
            salaryMin: jobData.salaryMin,
            salaryMax: jobData.salaryMax,
            applicationUrl: jobData.applicationUrl,
            requirements: jobData.requirements,
            skills: jobData.skills,
            techStack: jobData.techStack,
            remote: jobData.remote,
            visaSponsorship: jobData.visaSponsorship,
            featured: false,
            premium: false
          }
        });
        
        createdJobs.push(job);
        console.log(`✅ Created job: ${job.title} at ${company.name}`);
        
      } catch (error) {
        console.error(`❌ Error creating job ${jobData.title}:`, error);
        errors.push({
          job: jobData.title,
          company: jobData.company,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test import completed',
      result: {
        imported: createdJobs.length,
        total: jobs.length,
        errors
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Test import failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test import endpoint',
    usage: 'POST to trigger test import',
    timestamp: new Date().toISOString()
  });
}


