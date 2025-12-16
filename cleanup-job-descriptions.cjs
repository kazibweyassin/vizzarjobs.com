const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Function to clean and format job descriptions
function cleanJobDescription(description) {
  if (!description) return '';
  
  let cleaned = description;
  
  // Fix malformed HTML tags and separators first
  cleaned = fixMalformedSeparators(cleaned);
  
  // Fix encoding issues
  cleaned = fixEncodingIssues(cleaned);
  
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
    'mention the word LIKABLE',
    'Share this job:',
    'Get a rok.co short link',
    'Apply for this job',
    'Next job',
    'Close'
  ];
  
  spamPhrases.forEach(phrase => {
    cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
  });
  
  // Convert to formatted HTML
  cleaned = convertToFormattedHTML(cleaned);
  
  return cleaned;
}

// Fix malformed HTML separators and artifacts
function fixMalformedSeparators(text) {
  let fixed = text;
  
  // Fix malformed HTML tag patterns like 'r />>' or 'l>>i>>'
  fixed = fixed
    // Remove broken HTML tag patterns and replace with proper line breaks
    .replace(/r\s*\/>>+/gi, '\n\n')
    .replace(/l>>+/gi, '')
    .replace(/i>>+/gi, '')
    .replace(/>>+/g, '')
    .replace(/r\s*\/>/gi, '\n')
    
    // Remove HTML style attributes appearing as text
    .replace(/style="[^"]*"/gi, '')
    .replace(/style='[^']*'/gi, '')
    .replace(/style=[^\s>]*/gi, '')
    
    // Fix broken list markers and separators
    .replace(/ly\s+with/gi, 'closely with')
    .replace(/([a-z])l>>/gi, '$1')
    .replace(/>>([a-z])/gi, '$1')
    
    // Remove font-size and other inline style text
    .replace(/style="font-size:[^"]*"/gi, '')
    .replace(/font-size:\s*\d+pt/gi, '')
    
    // Remove standalone > characters that aren't part of HTML tags
    .replace(/([a-z])>([A-Z])/g, '$1 $2')
    .replace(/([a-z])>([a-z])/g, '$1 $2')
    .replace(/>([A-Z][a-z])/g, ' $1')
    
    // Fix words concatenated without spaces (camelCase to spaced)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\.([A-Z])/g, '. $1')
    
    // Remove broken br/r tags
    .replace(/\br\s*\/>/gi, '<br>')
    .replace(/\br\s*>/gi, '<br>')
    
    // Clean up multiple consecutive separators
    .replace(/[>]{3,}/g, '')
    .replace(/[/]{3,}/g, '')
    .replace(/>{2}/g, '')
    
    // Remove HTML entities that appear as text
    .replace(/&[a-z]+;(?=[A-Z])/g, ' ')
    
    // Fix missing spaces after periods
    .replace(/([a-z])\.([A-Z])/g, '$1. $2')
    .replace(/(ing|ed|ly)([A-Z])/g, '$1 $2');
  
  return fixed;
}

// Fix character encoding issues
function fixEncodingIssues(text) {
  let fixed = text;
  
  // Fix common encoding issues with accented characters
  fixed = fixed
    // Fix Spanish/Portuguese accented characters
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã /g, 'à')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã¬/g, 'ì')
    .replace(/Ã²/g, 'ò')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã¢/g, 'â')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã®/g, 'î')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã»/g, 'û')
    
    // Fix curly quotes and apostrophes
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€˜/g, "'")
    
    // Fix dashes
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    
    // Fix ellipsis
    .replace(/â€¦/g, '...')
    
    // Fix bullet points
    .replace(/â€¢/g, '•')
    
    // Unicode fixes
    .replace(/\u00A0/g, ' ')
    .replace(/\u2013/g, '–')
    .replace(/\u2014/g, '—')
    .replace(/\u2018/g, "'")
    .replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"')
    .replace(/\u201D/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2022/g, '•');
  
  return fixed;
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
