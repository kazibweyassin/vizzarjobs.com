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
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
  experienceLevel: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
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
    // Extract country from location
    const locationParts = remoteJob.location.split(',');
    const country = locationParts[locationParts.length - 1]?.trim() || 'Remote';
    
    // Determine job type from tags
    const jobType = this.determineJobType(remoteJob.tags);
    
    // Determine experience level from title and description
    const experienceLevel = this.determineExperienceLevel(remoteJob.position, remoteJob.description);
    
    // Clean and format the job description
    const cleanDescription = this.cleanJobDescription(remoteJob.description);
    
    // Extract skills and tech stack from tags and description
    const { skills, techStack } = this.extractSkills(remoteJob.tags, cleanDescription);
    
    // Extract requirements from cleaned description
    const requirements = this.extractRequirements(cleanDescription);
    
    return {
      title: remoteJob.position,
      company: remoteJob.company,
      description: cleanDescription,
      location: remoteJob.location,
      country,
      applicationUrl: remoteJob.url,
      jobType,
      experienceLevel,
      salaryMin: remoteJob.salary_min,
      salaryMax: remoteJob.salary_max,
      visaSponsorship: true, // All filtered jobs have visa sponsorship
      requirements,
      skills,
      techStack,
      remote: true // RemoteOK jobs are all remote
    };
  }
  
  private determineJobType(tags: string[]): 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE' {
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
  
  private determineExperienceLevel(title: string, description: string): 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' {
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
    
    // Convert HTML to proper formatting
    cleaned = this.convertToFormattedHTML(cleaned);
    
    return cleaned;
  }

  private convertToFormattedHTML(text: string): string {
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
}
