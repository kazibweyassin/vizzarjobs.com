import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fix unsupported characters in text (same logic as RemoteOK importer)
 */
function fixUnsupportedCharacters(text: string): string {
  if (!text) return '';
  
  let fixed = text;
  
  // First, try to decode if it's double-encoded UTF-8
  try {
    // Common double-encoding patterns
    fixed = fixed.replace(/â€™/g, "'");
    fixed = fixed.replace(/â€œ/g, '"');
    fixed = fixed.replace(/â€/g, '"');
    fixed = fixed.replace(/â€˜/g, "'");
    fixed = fixed.replace(/â€"/g, '"');
    fixed = fixed.replace(/â€"/g, '"');
    fixed = fixed.replace(/â€"/g, '—');
    fixed = fixed.replace(/â€"/g, '–');
    fixed = fixed.replace(/â€"/g, '-');
    fixed = fixed.replace(/â€¦/g, '...');
    fixed = fixed.replace(/â€¢/g, '•');
    fixed = fixed.replace(/â€"/g, '°');
    fixed = fixed.replace(/â€"/g, '®');
    fixed = fixed.replace(/â€"/g, '©');
    fixed = fixed.replace(/â€"/g, '™');
  } catch (e) {
    // Continue with other fixes
  }
  
  // Fix common encoding issues - more comprehensive patterns
  fixed = fixed
    // Fix curly quotes and apostrophes (multiple encoding patterns)
    .replace(/â€™/g, "'")
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€˜/g, "'")
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '"')
    .replace(/â€"/g, '"')
    
    // Fix em dashes and en dashes
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    .replace(/â€"/g, '-')
    .replace(/â€"/g, '—')
    .replace(/â€"/g, '–')
    
    // Fix ellipsis
    .replace(/â€¦/g, '...')
    .replace(/â€¦/g, '...')
    
    // Fix other common encoding issues
    .replace(/â€¢/g, '•')
    .replace(/â€"/g, '°')
    .replace(/â€"/g, '®')
    .replace(/â€"/g, '©')
    .replace(/â€"/g, '™')
    .replace(/â€"/g, '°')
    .replace(/â€"/g, '®')
    .replace(/â€"/g, '©')
    .replace(/â€"/g, '™')
    
    // Fix currency symbols
    .replace(/â‚¬/g, '€')
    .replace(/Â£/g, '£')
    .replace(/Â¥/g, '¥')
    .replace(/Â¢/g, '¢')
    .replace(/Â¤/g, '¤')
    
    // Fix spaces and whitespace issues
    .replace(/Â /g, ' ')
    .replace(/â€¨/g, '\n')
    .replace(/â€©/g, '\n')
    .replace(/â€¬/g, '')
    .replace(/â€­/g, '')
    .replace(/â€®/g, '')
    .replace(/â€¯/g, '')
    
    // Unicode character fixes
    .replace(/\u00A0/g, ' ') // Non-breaking space
    .replace(/\u2013/g, '–') // En dash
    .replace(/\u2014/g, '—') // Em dash
    .replace(/\u2018/g, "'") // Left single quote
    .replace(/\u2019/g, "'") // Right single quote
    .replace(/\u201A/g, ',') // Single low-9 quotation mark
    .replace(/\u201B/g, "'") // Single high-reversed-9 quotation mark
    .replace(/\u201C/g, '"') // Left double quote
    .replace(/\u201D/g, '"') // Right double quote
    .replace(/\u201E/g, '"') // Double low-9 quotation mark
    .replace(/\u201F/g, '"') // Double high-reversed-9 quotation mark
    .replace(/\u2026/g, '...') // Ellipsis
    .replace(/\u2022/g, '•') // Bullet
    .replace(/\u2027/g, '·') // Hyphenation point
    .replace(/\u00B0/g, '°') // Degree
    .replace(/\u00AE/g, '®') // Registered
    .replace(/\u00A9/g, '©') // Copyright
    .replace(/\u2122/g, '™') // Trademark
    .replace(/\u20AC/g, '€') // Euro
    .replace(/\u00A3/g, '£') // Pound
    .replace(/\u00A5/g, '¥') // Yen
    .replace(/\u00A2/g, '¢') // Cent
    .replace(/\u00A4/g, '¤') // Currency
    
    // Fix literal escape sequences showing as text
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    
    // Remove zero-width characters that can cause issues
    .replace(/\u200B/g, '') // Zero-width space
    .replace(/\u200C/g, '') // Zero-width non-joiner
    .replace(/\u200D/g, '') // Zero-width joiner
    .replace(/\uFEFF/g, '') // Zero-width no-break space
    
    // Clean up any remaining problematic sequences
    .replace(/â€/g, '') // Remove any remaining malformed sequences
    .replace(/â€/g, '')
    .replace(/â€/g, '')
    .replace(/â€/g, '')
    .replace(/â€/g, '')
    .replace(/â€/g, '');
  
  // Final pass: try to decode as UTF-8 if it looks like it might be double-encoded
  try {
    // If we still see encoding artifacts, try to fix them
    fixed = fixed.replace(/â€/g, ''); // Remove any remaining encoding artifacts
  } catch (e) {
    // Continue with fixed text
  }
  
  return fixed;
}

async function cleanAllJobs() {
  try {
    console.log("🔍 Fetching all jobs from database...");
    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        description: true,
      },
    });

    console.log(`📊 Found ${jobs.length} jobs to check...`);

    let cleanedCount = 0;
    let unchangedCount = 0;

    for (const job of jobs) {
      if (!job.description) {
        unchangedCount++;
        continue;
      }

      const cleanedDescription = fixUnsupportedCharacters(job.description);
      
      // Check if description actually changed
      if (cleanedDescription !== job.description) {
        await prisma.job.update({
          where: { id: job.id },
          data: { description: cleanedDescription },
        });
        
        cleanedCount++;
        console.log(`✅ Cleaned: ${job.title.substring(0, 50)}...`);
      } else {
        unchangedCount++;
      }
    }

    console.log("\n📈 Summary:");
    console.log(`   ✅ Cleaned: ${cleanedCount} jobs`);
    console.log(`   ⏭️  Unchanged: ${unchangedCount} jobs`);
    console.log(`   📊 Total: ${jobs.length} jobs`);
    
    if (cleanedCount > 0) {
      console.log("\n✨ All jobs have been cleaned successfully!");
    } else {
      console.log("\n✨ No encoding issues found - all jobs are clean!");
    }
  } catch (error) {
    console.error("❌ Error cleaning jobs:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleaning script
cleanAllJobs()
  .then(() => {
    console.log("\n🎉 Job cleaning completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Job cleaning failed:", error);
    process.exit(1);
  });

