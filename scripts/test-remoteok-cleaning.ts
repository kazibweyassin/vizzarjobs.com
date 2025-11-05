import { RemoteOKImporter } from '../src/lib/job-import/remoteok';

/**
 * Test script to verify RemoteOK cleaning improvements
 * Fetches a few jobs and shows before/after cleaning
 */
async function testRemoteOKCleaning() {
  try {
    console.log('🧪 Testing RemoteOK job cleaning improvements...\n');
    
    const importer = new RemoteOKImporter();
    
    // Fetch jobs from RemoteOK
    console.log('📡 Fetching jobs from RemoteOK API...');
    const jobs = await importer.fetchJobs();
    
    if (jobs.length === 0) {
      console.log('❌ No jobs found from RemoteOK API');
      return;
    }
    
    console.log(`✅ Fetched ${jobs.length} jobs\n`);
    
    // Filter for jobs with visa sponsorship
    const visaJobs = importer.filterVisaSponsorshipJobs(jobs);
    console.log(`📊 Found ${visaJobs.length} jobs with visa sponsorship\n`);
    
    // Test with first 3 jobs
    const testJobs = visaJobs.slice(0, 3);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    for (let i = 0; i < testJobs.length; i++) {
      const job = testJobs[i];
      console.log(`\n📋 Job ${i + 1}: ${job.position} at ${job.company}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Parse the job (this applies all cleaning)
      const parsed = importer.parseJob(job);
      
      console.log('📍 LOCATION:');
      console.log(`   Original: "${job.location}"`);
      console.log(`   Parsed:   "${parsed.location}"`);
      console.log(`   Country:  "${parsed.country}"`);
      
      console.log('\n💰 SALARY:');
      console.log(`   API:      Min: ${job.salary_min ?? 'N/A'}, Max: ${job.salary_max ?? 'N/A'}`);
      console.log(`   Parsed:   Min: ${parsed.salaryMin ?? 'N/A'}, Max: ${parsed.salaryMax ?? 'N/A'}`);
      
      console.log('\n📝 DESCRIPTION (first 500 chars):');
      console.log('   Original:');
      console.log(`   ${job.description.substring(0, 500).replace(/\n/g, '\n   ')}...`);
      console.log('\n   Cleaned:');
      console.log(`   ${parsed.description.substring(0, 500).replace(/\n/g, '\n   ')}...`);
      
      console.log('\n🏷️  TAGS & SKILLS:');
      console.log(`   Tags:     ${job.tags.join(', ')}`);
      console.log(`   Tech:     ${parsed.techStack.join(', ') || 'None'}`);
      console.log(`   Skills:   ${parsed.skills.join(', ') || 'None'}`);
      
      console.log('\n📊 METADATA:');
      console.log(`   Type:     ${parsed.jobType}`);
      console.log(`   Level:    ${parsed.experienceLevel}`);
      console.log(`   Remote:   ${parsed.remote}`);
      console.log(`   Visa:     ${parsed.visaSponsorship}`);
      
      if (i < testJobs.length - 1) {
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
    }
    
    console.log('\n\n✨ Test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Total jobs fetched: ${jobs.length}`);
    console.log(`   Jobs with visa sponsorship: ${visaJobs.length}`);
    console.log(`   Jobs tested: ${testJobs.length}`);
    
  } catch (error) {
    console.error('❌ Error testing RemoteOK cleaning:', error);
    throw error;
  }
}

// Run the test
testRemoteOKCleaning()
  .then(() => {
    console.log('\n🎉 Test script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test script failed:', error);
    process.exit(1);
  });

