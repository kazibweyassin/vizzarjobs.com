const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to clean and format job descriptions
function cleanJobDescription(description) {
  if (!description) return '';
  
  let cleaned = description;
  
  // Remove spam prevention text first (before removing HTML)
  cleaned = cleaned.replace(/Please mention the word \*\*[^*]+\*\*.*?\(#[^)]+\)\./gi, '');
  cleaned = cleaned.replace(/This is a beta feature to avoid spam applicants\..*?human\./gi, '');
  cleaned = cleaned.replace(/Companies can search these words to find applicants.*?human\./gi, '');
  
  // Remove base64 encoded tags
  cleaned = cleaned.replace(/#[A-Za-z0-9+/=]+/g, '');
  
  // Remove common spam phrases
  const spamPhrases = [
    'This is a beta feature to avoid spam applicants',
    'Companies can search these words to find applicants',
    'to show you read the job post completely',
    'tag RMTU0LjY2LjIxOC4zNA==',
    'mention the word LIKABLE'
  ];
  
  spamPhrases.forEach(phrase => {
    cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
  });
  
  // Convert to formatted HTML
  cleaned = convertToFormattedHTML(cleaned);
  
  return cleaned;
}

function convertToFormattedHTML(text) {
  if (!text) return '';
  
  // Remove RemoteOK specific content
  let formatted = text
    .replace(/Safetywing.*?Ad\s*/gi, '')
    .replace(/Share this job:.*?rok\.co short link\s*/gi, '')
    .replace(/Benefits\s*💰.*?Location\s*Remote\s*/gi, '');
  
  // Convert line breaks to paragraphs
  formatted = formatted
    .replace(/\n\s*\n/g, '\n\n')
    .split('\n\n')
    .filter(para => para.trim().length > 0)
    .map(para => `<p>${para.trim()}</p>`)
    .join('\n');
  
  return formatted;
}

async function updateJobDescriptions() {
  try {
    console.log('🧹 Starting job description cleanup...');
    
    // Get all jobs
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        description: true
      }
    });
    
    console.log(`📊 Found ${jobs.length} jobs to process`);
    
    let updated = 0;
    
    for (const job of jobs) {
      if (job.description) {
        const cleanedDescription = cleanJobDescription(job.description);
        
        if (cleanedDescription !== job.description) {
          await prisma.job.update({
            where: { id: job.id },
            data: { description: cleanedDescription }
          });
          
          updated++;
          console.log(`✅ Updated: ${job.title}`);
        }
      }
    }
    
    console.log(`🎉 Cleanup completed! Updated ${updated} job descriptions`);
    
  } catch (error) {
    console.error('❌ Error updating job descriptions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateJobDescriptions();
