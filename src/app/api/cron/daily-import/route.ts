import { NextRequest, NextResponse } from 'next/server';
import { RemoteOKImporter } from '~/lib/job-import/remoteok';
import { RapidAPIImporter } from '~/lib/job-import/rapidapi';
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
    
    const results = {
      remoteOK: { imported: 0, total: 0, errors: [] },
      rapidAPI: { imported: 0, total: 0, errors: [] }
    };
    
    // Import from RemoteOK
    try {
      console.log('📡 Importing from RemoteOK...');
      const remoteOKImporter = new RemoteOKImporter();
      const remoteOKJobs = await remoteOKImporter.importJobs();
      
      for (const jobData of remoteOKJobs) {
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
            console.log(`⏭️ Skipping duplicate RemoteOK job: ${jobData.title} at ${jobData.company}`);
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
              requirements: jobData.requirements || [],
              skills: jobData.skills || [],
              techStack: jobData.techStack || [],
              premium: false,
              featured: false,
            }
          });

          results.remoteOK.imported++;
          console.log(`✅ Created RemoteOK job: ${job.title} at ${company.name}`);
        } catch (error) {
          results.remoteOK.errors.push({ 
            job: jobData.title, 
            company: jobData.company, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          console.error(`❌ Error creating RemoteOK job ${jobData.title}:`, error);
        }
      }
      
      results.remoteOK.total = remoteOKJobs.length;
      console.log(`📊 RemoteOK import completed: ${results.remoteOK.imported} jobs created`);
    } catch (error) {
      console.error('❌ RemoteOK import failed:', error);
      results.remoteOK.errors.push({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    
    // Import from RapidAPI (ArbeitNow)
    try {
      console.log('📡 Importing from RapidAPI (ArbeitNow)...');
      const rapidAPIImporter = new RapidAPIImporter();
      const rapidAPIJobs = await rapidAPIImporter.importJobs();
      
      for (const jobData of rapidAPIJobs) {
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
            console.log(`⏭️ Skipping duplicate RapidAPI job: ${jobData.title} at ${jobData.company}`);
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
              requirements: jobData.requirements || [],
              skills: jobData.skills || [],
              techStack: jobData.techStack || [],
              premium: false,
              featured: false,
            }
          });

          results.rapidAPI.imported++;
          console.log(`✅ Created RapidAPI job: ${job.title} at ${company.name}`);
        } catch (error) {
          results.rapidAPI.errors.push({ 
            job: jobData.title, 
            company: jobData.company, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
          console.error(`❌ Error creating RapidAPI job ${jobData.title}:`, error);
        }
      }
      
      results.rapidAPI.total = rapidAPIJobs.length;
      console.log(`📊 RapidAPI import completed: ${results.rapidAPI.imported} jobs created`);
    } catch (error) {
      console.error('❌ RapidAPI import failed:', error);
      results.rapidAPI.errors.push({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    
    const totalImported = results.remoteOK.imported + results.rapidAPI.imported;
    const totalJobs = results.remoteOK.total + results.rapidAPI.total;
    
    console.log(`🎉 Daily import completed: ${totalImported} jobs imported from ${totalJobs} total jobs`);
    
    return NextResponse.json({
      success: true,
      message: 'Daily import completed',
      results: {
        totalImported,
        totalJobs,
        remoteOK: results.remoteOK,
        rapidAPI: results.rapidAPI
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


