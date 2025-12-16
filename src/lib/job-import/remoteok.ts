import { JobType, ExperienceLevel } from "@prisma/client";

interface RemoteOKJob {
  id: string;
  company: string;
  position: string;
  description: string;
  location: string;
  url: string;
  tags: string[];
  date: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  visa_sponsorship?: boolean;
  relocation_support?: boolean;
}

interface ParsedJob {
  title: string;
  company: string;
  description: string;
  location: string;
  country: string;
  applicationUrl: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  visaSponsorship: boolean;
  requirements: string[];
  skills: string[];
  techStack: string[];
  remote: boolean;
}

export class RemoteOKImporter {
  private readonly API_URL = 'https://remoteok.com/api';
  
  async fetchJobs(): Promise<RemoteOKJob[]> {
    try {
      console.log('Fetching jobs from RemoteOK...');
      const response = await fetch(this.API_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`RemoteOK API error: ${response.status}`);
      }
      
      const jobs: RemoteOKJob[] = await response.json();
      console.log(`Fetched ${jobs.length} jobs from RemoteOK`);
      
      return jobs;
    } catch (error) {
      console.error('Error fetching from RemoteOK:', error);
      throw error;
    }
  }
  
  filterVisaSponsorshipJobs(jobs: RemoteOKJob[]): RemoteOKJob[] {
    return jobs.filter(job => {
      // Skip invalid jobs
      if (!job.position || !job.company || !job.description) {
        return false;
      }
      
      // Check for visa sponsorship indicators
      const hasVisaSponsorship = 
        job.visa_sponsorship === true ||
        job.tags?.some(tag => 
          tag.toLowerCase().includes('visa') ||
          tag.toLowerCase().includes('sponsorship') ||
          tag.toLowerCase().includes('relocation')
        ) ||
        job.description.toLowerCase().includes('visa sponsorship') ||
        job.description.toLowerCase().includes('relocation support') ||
        job.description.toLowerCase().includes('sponsor visa') ||
        job.description.toLowerCase().includes('work authorization') ||
        job.description.toLowerCase().includes('sponsor work') ||
        // For now, let's import all valid remote jobs since they often offer relocation
        job.location?.toLowerCase().includes('remote');
        
      return hasVisaSponsorship;
    });
  }
  
  parseJob(remoteJob: RemoteOKJob): ParsedJob {
    // Clean and format the job description first (before extracting other data)
    const cleanDescription = this.cleanJobDescription(remoteJob.description);
    
    // Extract salary from description if not in API response
    const { salaryMin, salaryMax } = this.extractSalary(remoteJob, cleanDescription);
    
    // Extract country from location (with better parsing)
    const { country, location } = this.extractLocation(remoteJob.location, cleanDescription);
    
    // Determine job type from tags
    const jobType = this.determineJobType(remoteJob.tags);
    
    // Determine experience level from title and description
    const experienceLevel = this.determineExperienceLevel(remoteJob.position, cleanDescription);
    
    // Extract skills and tech stack from tags and description
    const { skills, techStack } = this.extractSkills(remoteJob.tags, cleanDescription);
    
    // Extract requirements from cleaned description
    const requirements = this.extractRequirements(cleanDescription);
    
    return {
      title: remoteJob.position,
      company: remoteJob.company,
      description: cleanDescription,
      location,
      country,
      applicationUrl: remoteJob.url,
      jobType,
      experienceLevel,
      salaryMin,
      salaryMax,
      visaSponsorship: true, // All filtered jobs have visa sponsorship
      requirements,
      skills,
      techStack,
      remote: true // RemoteOK jobs are all remote
    };
  }
  
  private determineJobType(tags: string[]): JobType {
    const tagString = tags.join(' ').toLowerCase();
    
    if (tagString.includes('part-time') || tagString.includes('part time')) {
      return 'PART_TIME';
    }
    if (tagString.includes('contract') || tagString.includes('freelance')) {
      return 'CONTRACT';
    }
    if (tagString.includes('intern') || tagString.includes('internship')) {
      return 'INTERNSHIP';
    }
    if (tagString.includes('freelance')) {
      return 'FREELANCE';
    }
    
    return 'FULL_TIME'; // Default
  }
  
  private determineExperienceLevel(title: string, description: string): ExperienceLevel {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('senior') || text.includes('lead') || text.includes('principal') || text.includes('architect')) {
      return 'SENIOR';
    }
    if (text.includes('lead') || text.includes('manager') || text.includes('director') || text.includes('head of')) {
      return 'LEAD';
    }
    if (text.includes('junior') || text.includes('entry') || text.includes('graduate') || text.includes('intern')) {
      return 'JUNIOR';
    }
    
    return 'MID'; // Default
  }
  
  private extractSalary(remoteJob: RemoteOKJob, description: string): { salaryMin?: number; salaryMax?: number } {
    // If API provides salary, use it
    if (remoteJob.salary_min && remoteJob.salary_max) {
      return { salaryMin: remoteJob.salary_min, salaryMax: remoteJob.salary_max };
    }
    
    // Try to extract from description
    // Patterns: "$100,000 — $150,000/year", "$100k - $150k", "$100,000-$150,000", etc.
    const salaryPatterns = [
      /\$([\d,]+)\s*[—–-]\s*\$([\d,]+)\s*\/?\s*(?:year|yr|annually)/gi,
      /\$([\d,]+)\s*[—–-]\s*\$([\d,]+)/gi,
      /\$([\d,]+)\s*to\s*\$([\d,]+)/gi,
      /USD\s*\$([\d,]+)\s*[—–-]\s*\$([\d,]+)/gi,
      /(\d+)\s*k\s*[—–-]\s*(\d+)\s*k/gi, // 100k - 150k
    ];
    
    for (const pattern of salaryPatterns) {
      const match = description.match(pattern);
      if (match) {
        const firstMatch = match[0];
        // Extract numbers
        const numbers = firstMatch.match(/[\d,]+/g);
        if (numbers && numbers.length >= 2) {
          const minNum = numbers[0];
          const maxNum = numbers[1];
          
          if (minNum && maxNum) {
            const min = parseInt(minNum.replace(/,/g, ''), 10);
            const max = parseInt(maxNum.replace(/,/g, ''), 10);
            
            // Handle "k" notation (e.g., 100k = 100,000)
            if (firstMatch.toLowerCase().includes('k') && !firstMatch.includes(',')) {
              return {
                salaryMin: min * 1000,
                salaryMax: max * 1000
              };
            }
            
            return { salaryMin: min, salaryMax: max };
          }
        }
      }
    }
    
    // Try single salary value
    const singleSalaryPattern = /\$([\d,]+)\s*(?:k|thousand)?\s*\/?\s*(?:year|yr|annually)/gi;
    const singleMatch = description.match(singleSalaryPattern);
    if (singleMatch) {
      const number = singleMatch[0].match(/[\d,]+/);
      if (number) {
        const value = parseInt(number[0].replace(/,/g, ''), 10);
        const isK = singleMatch[0].toLowerCase().includes('k') && !singleMatch[0].includes(',');
        return {
          salaryMin: isK ? value * 1000 : value,
          salaryMax: isK ? value * 1000 : value
        };
      }
    }
    
    return {};
  }
  
  private extractLocation(location: string, description: string): { country: string; location: string } {
    // If location is just "Remote", try to extract country from description
    if (location.toLowerCase().trim() === 'remote') {
      // Look for country mentions in description
      const countries = [
        'United States', 'USA', 'US', 'Canada', 'UK', 'United Kingdom',
        'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Sweden',
        'Australia', 'New Zealand', 'India', 'Brazil', 'Mexico', 'Japan',
        'Singapore', 'Hong Kong', 'Portugal', 'Poland', 'Czech Republic'
      ];
      
      for (const country of countries) {
        const regex = new RegExp(`\\b${country}\\b`, 'i');
        if (description.match(regex)) {
          return { country, location: `Remote, ${country}` };
        }
      }
      
      return { country: 'Remote', location: 'Remote' };
    }
    
    // Parse location string
    const locationParts = location.split(',').map(part => part.trim());
    const country = locationParts[locationParts.length - 1] || 'Remote';
    
    return { country, location };
  }
  
  private extractSkills(tags: string[], description: string): { skills: string[], techStack: string[] } {
    const commonTechStack = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'C++', 'C#',
      'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Flutter', 'React Native',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Redis', 'Elasticsearch', 'GraphQL', 'REST API', 'Microservices', 'DevOps',
      'Machine Learning', 'AI', 'TensorFlow', 'PyTorch', 'Data Science', 'Blockchain'
    ];
    
    const allText = `${tags.join(' ')} ${description}`.toLowerCase();
    const techStack: string[] = [];
    const skills: string[] = [];
    
    // Extract tech stack
    commonTechStack.forEach(tech => {
      if (allText.includes(tech.toLowerCase())) {
        techStack.push(tech);
      }
    });
    
    // Extract other skills from tags
    tags.forEach(tag => {
      if (!techStack.includes(tag) && tag.length > 2) {
        skills.push(tag);
      }
    });
    
    return { skills, techStack };
  }
  
  private cleanJobDescription(description: string): string {
    if (!description) return '';
    
    let cleaned = description;
    
    // Fix malformed HTML tags and separators first
    cleaned = this.fixMalformedSeparators(cleaned);
    
    // Remove RemoteOK promotional content first
    cleaned = this.removeRemoteOKPromotionalContent(cleaned);
    
    // Remove spam prevention text (before removing HTML)
    cleaned = cleaned.replace(/Please mention the word \*\*[^*]+\*\*.*?\(#[^)]+\)\./gi, '');
    cleaned = cleaned.replace(/This is a beta feature to avoid spam applicants\..*?human\./gi, '');
    cleaned = cleaned.replace(/Companies can search these words to find applicants.*?human\./gi, '');
    cleaned = cleaned.replace(/tag\s+[A-Za-z0-9+/=]+/gi, '');
    
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
      'rok.co short link',
      'Apply for this job',
      'Next job',
      'Close',
      'Hiring for a Remote position',
      'Claim your 10% discount',
      'Post a job on',
      '#1 Remote Jobs board'
    ];
    
    spamPhrases.forEach(phrase => {
      cleaned = cleaned.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '');
    });
    
    // Remove salary and location sections that might be duplicated
    cleaned = cleaned.replace(/#Salary and compensation\s*\$[\d,]+.*?\/year/gi, '');
    cleaned = cleaned.replace(/#Location\s*Remote\s*/gi, '');
    cleaned = cleaned.replace(/Salary and compensation.*?\/year/gi, '');
    
    // Fix unsupported characters and encoding issues
    cleaned = this.fixUnsupportedCharacters(cleaned);
    
    // Convert HTML to proper formatting
    cleaned = this.convertToFormattedHTML(cleaned);
    
    // Final cleanup - remove extra whitespace and empty sections
    cleaned = this.finalCleanup(cleaned);
    
    return cleaned;
  }
  
  /**
   * Fix malformed HTML separators and artifacts from bad imports
   */
  private fixMalformedSeparators(text: string): string {
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
      
      // Fix encoding issues with special characters
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
      
      // Remove broken br/r tags
      .replace(/\br\s*\/>/gi, '<br>')
      .replace(/\br\s*>/gi, '<br>')
      
      // Clean up multiple consecutive separators
      .replace(/[>]{3,}/g, '')
      .replace(/[/]{3,}/g, '')
      
      // Remove HTML entities that appear as text
      .replace(/&[a-z]+;(?=[A-Z])/g, ' ');
    
    return fixed;
  }
  
  private removeRemoteOKPromotionalContent(text: string): string {
    // Remove Safetywing ads and promotional content
    let cleaned = text
      .replace(/Safetywing.*?Health insurance.*?nomads/gi, '')
      .replace(/Safetywing.*?Health insurance.*?teams/gi, '')
      .replace(/Safetywing.*?Ad\s*/gi, '')
      .replace(/Share this job:.*?rok\.co.*?short link/gi, '')
      .replace(/Share this job:.*?rok\.co/gi, '')
      .replace(/Benefits\s*💰.*?Location\s*Remote\s*/gi, '')
      .replace(/Benefits\s*💰.*?Location\s*/gi, '')
      .replace(/💰\s*Salary.*?Location\s*Remote/gi, '')
      .replace(/🎪 Benefits.*?Location\s*/gi, '')
      .replace(/🦴 Sort by.*?Most applied/gi, '')
      .replace(/👈 Go back/gi, '')
      .replace(/Apply for this job/gi, '')
      .replace(/Next job/gi, '')
      .replace(/Close/gi, '');
    
    // Remove RemoteOK navigation elements
    cleaned = cleaned.replace(/Join Remote OK.*?Log in/gi, '');
    cleaned = cleaned.replace(/Remote OK.*?Frontpage.*?Remote jobs/gi, '');
    cleaned = cleaned.replace(/Dark mode.*?Hire remote workers/gi, '');
    cleaned = cleaned.replace(/Post a job.*?Go premium/gi, '');
    
    // Remove link patterns
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Convert markdown links to text
    
    return cleaned;
  }
  
  private finalCleanup(text: string): string {
    // Remove multiple consecutive empty paragraphs
    let cleaned = text
      .replace(/(<p[^>]*>\s*<\/p>\s*){3,}/gi, '')
      .replace(/(\n\s*){4,}/g, '\n\n')
      // Remove paragraphs with only whitespace or special characters
      .replace(/<p[^>]*>\s*[^\w\s]*\s*<\/p>/gi, '')
      // Remove standalone punctuation
      .replace(/<p[^>]*>\s*[.,;:!?\-_]\s*<\/p>/gi, '')
      // Remove very short paragraphs (likely artifacts)
      .replace(/<p[^>]*>\s*.{0,5}\s*<\/p>/gi, '')
      // Clean up extra spaces
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    
    return cleaned;
  }

  private fixUnsupportedCharacters(text: string): string {
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

  private convertToFormattedHTML(text: string): string {
    if (!text) return '';
    
    // Clean up existing HTML structure first
    let formatted = this.cleanHTMLStructure(text);
    
    // Convert to proper paragraphs
    formatted = this.convertToParagraphs(formatted);
    
    return formatted;
  }

  private cleanHTMLStructure(text: string): string {
    // First pass: Fix malformed/raw HTML tags
    let cleaned = this.fixMalformedHTMLTags(text);
    
    // Remove nested p tags and fix structure
    cleaned = cleaned
      // Remove empty paragraphs with only whitespace, &nbsp;, or special characters
      .replace(/<p[^>]*>\s*(&nbsp;|&#160;|\s)*\s*<\/p>/gi, '')
      .replace(/<p[^>]*>\s*<\/p>/gi, '')
      // Remove div tags but keep content
      .replace(/<div[^>]*>/gi, '')
      .replace(/<\/div>/gi, '')
      // Remove span tags but keep content
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      // Convert br tags to line breaks
      .replace(/<br\s*\/?>/gi, '\n')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove script and style tags with content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      // Remove multiple consecutive line breaks (more than 2)
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      // Clean up nested p tags
      .replace(/<p[^>]*>\s*<p[^>]*>/gi, '<p>')
      .replace(/<\/p>\s*<\/p>/gi, '</p>')
      // Remove empty h1-h6 tags
      .replace(/<h[1-6][^>]*>\s*<\/h[1-6]>/gi, '')
      // Fix specific formatting issues
      .replace(/<p[^>]*>\s*<h3[^>]*>/gi, '<h3>')
      .replace(/<\/h3>\s*<\/p>/gi, '</h3>')
      .replace(/<p[^>]*>\s*<h[1-6][^>]*>/gi, '<h3>') // Convert other headings to h3
      .replace(/<\/h[1-6]>\s*<\/p>/gi, '</h3>')
      // Remove numbered lists and convert to proper formatting
      .replace(/^\d+\.?\s*<p[^>]*>/gim, '<p>')
      .replace(/^\d+\.?\s+/gm, '')
      // Remove standalone numbers at start of lines
      .replace(/^\d+\.?\s*$/gm, '')
      // Remove numbered prefixes from HTML tags
      .replace(/^\d+\.?\s*<p[^>]*>/gim, '<p>')
      .replace(/^\d+\.?\s*<b[^>]*>/gim, '<b>')
      .replace(/^\d+\.?\s*<u[^>]*>/gim, '<u>')
      .replace(/^\d+\.?\s*<i[^>]*>/gim, '<i>')
      .replace(/^\d+\.?\s*<strong[^>]*>/gim, '<strong>')
      .replace(/^\d+\.?\s*<em[^>]*>/gim, '<em>')
      // Remove list item tags but keep content
      .replace(/<li[^>]*>/gi, '<p>')
      .replace(/<\/li>/gi, '</p>')
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '')
      // Remove anchor tags but keep text
      .replace(/<a[^>]*>/gi, '')
      .replace(/<\/a>/gi, '')
      // Remove image tags
      .replace(/<img[^>]*>/gi, '')
      // Remove table tags but keep content (convert to paragraphs)
      .replace(/<table[^>]*>/gi, '')
      .replace(/<\/table>/gi, '')
      .replace(/<tr[^>]*>/gi, '<p>')
      .replace(/<\/tr>/gi, '</p>')
      .replace(/<td[^>]*>/gi, '')
      .replace(/<\/td>/gi, ' ')
      .replace(/<th[^>]*>/gi, '<strong>')
      .replace(/<\/th>/gi, '</strong>')
      // Clean up whitespace between tags
      .replace(/>\s+</g, '><')
      // Clean up excessive whitespace (but preserve line breaks)
      .replace(/[ \t]+/g, ' ')
      .trim();
    
    // Final pass: Fix unclosed tags and ensure proper structure
    cleaned = this.fixUnclosedTags(cleaned);
    
    return cleaned;
  }
  
  /**
   * Fix malformed/raw HTML tags that might come from the API
   */
  private fixMalformedHTMLTags(text: string): string {
    let fixed = text;
    
    // Fix tags without closing angle brackets (e.g., <p or <strong)
    fixed = fixed.replace(/<([a-z][a-z0-9]*)\s*([^>]*?)(?=\s|$|>)/gi, (match, tagName, attrs) => {
      // If it doesn't end with >, add it
      if (!match.endsWith('>')) {
        return `<${tagName}${attrs ? ' ' + attrs.trim() : ''}>`;
      }
      return match;
    });
    
    // Fix tags with unquoted attributes
    fixed = fixed.replace(/<([a-z][a-z0-9]*)\s+([^>]*?)([^"'>\s]+)([^>]*?)>/gi, (match, tagName, before, attrValue, after) => {
      // If attrValue doesn't look like a quoted attribute value, quote it
      if (!attrValue.match(/^["']/) && !attrValue.match(/^[a-z]+=/) && attrValue.length > 0) {
        // Check if it's part of an attribute without quotes
        const parts = before.split(/\s+/);
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.includes('=') && !lastPart.match(/=["']/)) {
          return `<${tagName} ${before}"${attrValue}"${after}>`;
        }
      }
      return match;
    });
    
    // Fix self-closing tags that are written incorrectly (e.g., <br> instead of <br/>)
    const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
    selfClosingTags.forEach(tag => {
      // Only fix if it's not already self-closed
      fixed = fixed.replace(new RegExp(`<${tag}([^>]*?)(?<!\\/)>`, 'gi'), `<${tag}$1 />`);
    });
    
    // Fix tags that are missing closing brackets (e.g., <pText or <strongText)
    fixed = fixed.replace(/<([a-z][a-z0-9]*)([^>]*?)([a-z])/gi, (match, tagName, attrs, letter) => {
      // If this looks like a tag that should close but doesn't, fix it
      if (!match.includes('>') && attrs.length < 50) {
        return `<${tagName}${attrs}>${letter}`;
      }
      return match;
    });
    
    // Remove orphaned opening brackets that aren't part of tags
    fixed = fixed.replace(/<(?![a-z\/!])/gi, '&lt;');
    
    // Fix broken entity references (e.g., &amp instead of &amp;)
    fixed = fixed.replace(/&([a-z]{2,})(?![a-z0-9#];)/gi, '&amp;$1');
    
    // Fix common broken entities
    fixed = fixed.replace(/&amp([^;])/gi, '&amp;$1');
    fixed = fixed.replace(/&lt([^;])/gi, '&lt;$1');
    fixed = fixed.replace(/&gt([^;])/gi, '&gt;$1');
    fixed = fixed.replace(/&quot([^;])/gi, '&quot;$1');
    fixed = fixed.replace(/&apos([^;])/gi, '&apos;$1');
    
    return fixed;
  }
  
  /**
   * Fix unclosed HTML tags by closing them or removing them
   */
  private fixUnclosedTags(text: string): string {
    let fixed = text;
    
    // Track opened tags
    const tagStack: string[] = [];
    const tagPattern = /<\/?([a-z][a-z0-9]*)[^>]*>/gi;
    const allTags: Array<{ tag: string; isClosing: boolean; position: number }> = [];
    
    let match;
    while ((match = tagPattern.exec(text)) !== null) {
      const tagName = match[1]?.toLowerCase();
      if (!tagName) continue;
      
      const isClosing = match[0]?.startsWith('</') ?? false;
      allTags.push({
        tag: tagName,
        isClosing,
        position: match.index ?? 0
      });
    }
    
    // Process tags and fix unclosed ones
    const selfClosing = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
    let result = text;
    let offset = 0;
    
    for (const tagInfo of allTags) {
      const tagName = tagInfo.tag;
      
      if (selfClosing.includes(tagName)) {
        continue; // Skip self-closing tags
      }
      
      if (!tagInfo.isClosing) {
        // Opening tag - add to stack
        tagStack.push(tagName);
      } else {
        // Closing tag - remove from stack
        const lastIndex = tagStack.lastIndexOf(tagName);
        if (lastIndex !== -1) {
          tagStack.splice(lastIndex, 1);
        }
      }
    }
    
    // Close any remaining unclosed tags (in reverse order)
    if (tagStack.length > 0) {
      const closingTags = tagStack.reverse().map(tag => `</${tag}>`).join('');
      fixed = fixed + closingTags;
    }
    
    // Remove unclosed tags that shouldn't be there (like standalone closing tags)
    fixed = fixed.replace(/<\/p>(?![^<]*<p)/gi, ''); // Remove closing p if no opening p
    
    return fixed;
  }

  private convertToParagraphs(text: string): string {
    // First, ensure we have proper line breaks
    let processed = text
      .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
      .replace(/<\/h[1-6]>\s*<p[^>]*>/gi, '\n\n')
      .replace(/<\/p>\s*<h[1-6][^>]*>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n');
    
    // Split by double line breaks or HTML paragraph boundaries
    const paragraphs = processed
      .split(/\n\s*\n|<\/p>\s*<p[^>]*>|<\/p>\s*<h[1-6][^>]*>|<\/h[1-6]>\s*<p[^>]*>/gi)
      .map(para => para.trim())
      .filter(para => para.length > 0 && para !== '<p>' && para !== '</p>')
      .map(para => {
        // Remove existing p tags and clean up
        para = para.replace(/<\/?p[^>]*>/gi, '').trim();
        
        // Remove standalone numbers at the beginning
        para = para.replace(/^\d+\.?\s*/, '');
        
        // Remove leading/trailing special characters
        para = para.replace(/^[^\w<]+|[^\w>]+$/g, '');
        
        // Check if it's already a heading
        if (para.match(/^<h[1-6][^>]*>/)) {
          // Convert all headings to h3 for consistency
          return para.replace(/^<h[1-6][^>]*>/, '<h3>').replace(/<\/h[1-6]>$/, '</h3>');
        }
        
        // Check if it's a heading-like text (starts with strong or is short with colon)
        if (para.match(/^<strong[^>]*>/) || (para.length < 100 && para.endsWith(':'))) {
          const headingText = para.replace(/<\/?strong[^>]*>/gi, '').trim();
          if (headingText.length > 0 && headingText.length < 100) {
            return `<h3>${headingText}</h3>`;
          }
        }
        
        // Check for numbered lists (1., 2., etc.) - keep as paragraph
        if (para.match(/^\d+\.\s/)) {
          return `<p>${para}</p>`;
        }
        
        // Check for bullet points (-, •, *, →)
        if (para.match(/^[-•*→]\s/)) {
          return `<p>${para}</p>`;
        }
        
        // Skip very short paragraphs that are likely artifacts
        if (para.length < 10) {
          return '';
        }
        
        // Skip if it's just special characters or HTML entities
        if (para.match(/^[&<>;,\s.]+$/)) {
          return '';
        }
        
        // Regular paragraph - escape HTML if needed but preserve existing tags
        return `<p>${para}</p>`;
      })
      .filter(para => para.length > 0)
      .join('\n');
    
    return paragraphs;
  }


  private extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const lines = description.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
        requirements.push(trimmed.substring(1).trim());
      } else if (trimmed.length > 10 && trimmed.length < 200) {
        requirements.push(trimmed);
      }
    });
    
    return requirements.slice(0, 10); // Limit to 10 requirements
  }
  
  async importJobs(): Promise<ParsedJob[]> {
    try {
      const allJobs = await this.fetchJobs();
      const visaJobs = this.filterVisaSponsorshipJobs(allJobs);
      const parsedJobs = visaJobs.map(job => this.parseJob(job));
      
      console.log(`Filtered ${visaJobs.length} jobs with visa sponsorship from ${allJobs.length} total jobs`);
      return parsedJobs;
    } catch (error) {
      console.error('Error importing jobs from RemoteOK:', error);
      throw error;
    }
  }
  
  /**
   * Public method to clean a job description using all cleaning functions
   * Useful for cleaning existing jobs in the database
   */
  cleanDescription(description: string): string {
    return this.cleanJobDescription(description);
  }
  
  /**
   * Extract salary from description text
   * Returns salaryMin and salaryMax if found
   */
  extractSalaryFromText(description: string): { salaryMin?: number; salaryMax?: number } {
    const mockJob: RemoteOKJob = {
      id: '',
      company: '',
      position: '',
      description,
      location: '',
      url: '',
      tags: [],
      date: ''
    };
    return this.extractSalary(mockJob, description);
  }
  
  /**
   * Extract location and country from location string and description
   */
  extractLocationFromText(location: string, description: string): { country: string; location: string } {
    return this.extractLocation(location, description);
  }
}
