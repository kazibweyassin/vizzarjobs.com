import { JobType, ExperienceLevel } from "@prisma/client";
import { env } from "~/env";

interface RapidAPIJob {
  slug: string;
  company_name: string;
  title: string;
  description: string;
  remote: boolean;
  url: string;
  tags: string[];
  job_types: string[];
  location: string;
  created_at: number;
}

interface ParsedJob {
  title: string;
  company: string;
  location: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  remote: boolean;
  visaSponsorship: boolean;
  applicationUrl: string;
  country?: string;
  companyUrl?: string;
}

export class RapidAPIImporter {
  private apiKey: string;
  private baseUrl: string;
  private host: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || env.RAPIDAPI_KEY || '';
    this.baseUrl = 'https://arbeitnow-free-job-board.p.rapidapi.com/api/job-board-api';
    this.host = 'arbeitnow-free-job-board.p.rapidapi.com';
  }

  /**
   * Set a different RapidAPI endpoint
   */
  setEndpoint(endpoint: string, host?: string) {
    this.baseUrl = endpoint;
    if (host) {
      this.host = host;
    }
  }

  /**
   * Fetch jobs from RapidAPI
   */
  async fetchJobs(params: {
    query?: string;
    location?: string;
    page?: number;
    num_pages?: number;
    job_type?: string;
    experience_level?: string;
    remote?: boolean;
    visa_sponsorship?: boolean;
  } = {}): Promise<RapidAPIJob[]> {
    if (!this.apiKey) {
      throw new Error('RapidAPI key is required');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.host
        }
      });

      if (!response.ok) {
        throw new Error(`RapidAPI request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // ArbeitNow API returns data directly, not wrapped in a status object
      if (Array.isArray(data)) {
        return data;
      }
      
      // Handle different response formats
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (data.jobs && Array.isArray(data.jobs)) {
        return data.jobs;
      }
      
      console.warn('Unexpected API response format:', data);
      return [];
      
    } catch (error) {
      console.error('Error fetching from RapidAPI:', error);
      throw error;
    }
  }

  /**
   * Filter jobs that offer visa sponsorship or relocation
   */
  filterVisaSponsorshipJobs(jobs: RapidAPIJob[]): RapidAPIJob[] {
    return jobs.filter(job => {
      const description = job.description?.toLowerCase() || '';
      const title = job.title?.toLowerCase() || '';
      const company = job.company?.toLowerCase() || '';
      
      // Check for explicit visa sponsorship
      if (job.visa_sponsorship === true) return true;
      
      // Check for visa sponsorship keywords
      const visaKeywords = [
        'visa sponsorship',
        'visa support',
        'sponsor visa',
        'work visa',
        'h1b',
        'h-1b',
        'green card',
        'permanent residency',
        'relocation support',
        'relocation assistance',
        'international candidates',
        'global talent',
        'remote work',
        'work from anywhere'
      ];

      const hasVisaKeywords = visaKeywords.some(keyword => 
        description.includes(keyword) || 
        title.includes(keyword) || 
        company.includes(keyword)
      );

      return hasVisaKeywords;
    });
  }

  /**
   * Parse RapidAPI job data into our format
   */
  parseJob(rapidJob: RapidAPIJob): ParsedJob {
    const cleanDescription = this.cleanJobDescription(rapidJob.description);
    
    return {
      title: rapidJob.title || 'Untitled Position',
      company: rapidJob.company_name || 'Unknown Company',
      location: rapidJob.location || 'Remote',
      description: cleanDescription,
      salaryMin: undefined, // ArbeitNow doesn't provide salary info
      salaryMax: undefined,
      jobType: this.mapJobType(rapidJob.job_types?.[0]),
      experienceLevel: this.mapExperienceLevel(rapidJob.job_types?.[0]),
      remote: rapidJob.remote || false,
      visaSponsorship: this.checkVisaSponsorship(rapidJob),
      applicationUrl: rapidJob.url || '#',
      country: this.extractCountry(rapidJob.location),
      companyUrl: undefined
    };
  }

  /**
   * Clean job description
   */
  private cleanJobDescription(description: string): string {
    if (!description) return '';
    
    let cleaned = description;
    
    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Remove common spam phrases
    const spamPhrases = [
      'This is a beta feature to avoid spam applicants',
      'Companies can search these words to find applicants',
      'to show you read the job post completely',
      'mention the word',
      'tag',
      'Please mention'
    ];
    
    spamPhrases.forEach(phrase => {
      cleaned = cleaned.replace(new RegExp(phrase, 'gi'), '');
    });
    
    return cleaned;
  }

  /**
   * Check if job offers visa sponsorship based on content
   */
  private checkVisaSponsorship(job: RapidAPIJob): boolean {
    const description = job.description?.toLowerCase() || '';
    const title = job.title?.toLowerCase() || '';
    const tags = job.tags?.join(' ').toLowerCase() || '';
    
    // Check for visa sponsorship keywords
    const visaKeywords = [
      'visa sponsorship',
      'visa support',
      'sponsor visa',
      'work visa',
      'h1b',
      'h-1b',
      'green card',
      'permanent residency',
      'relocation support',
      'relocation assistance',
      'international candidates',
      'global talent',
      'remote work',
      'work from anywhere',
      'visa',
      'sponsorship',
      'relocation'
    ];

    const hasVisaKeywords = visaKeywords.some(keyword => 
      description.includes(keyword) || 
      title.includes(keyword) || 
      tags.includes(keyword)
    );

    return hasVisaKeywords;
  }

  /**
   * Map job type from RapidAPI to our enum
   */
  private mapJobType(type?: string): JobType {
    if (!type) return 'FULL_TIME';
    
    const typeMap: Record<string, JobType> = {
      // English types
      'full-time': 'FULL_TIME',
      'fulltime': 'FULL_TIME',
      'full time': 'FULL_TIME',
      'contract': 'CONTRACT',
      'contractor': 'CONTRACT',
      'internship': 'INTERNSHIP',
      'intern': 'INTERNSHIP',
      'part-time': 'PART_TIME',
      'parttime': 'PART_TIME',
      'part time': 'PART_TIME',
      'freelance': 'FREELANCE',
      'freelancer': 'FREELANCE',
      // German types (ArbeitNow specific)
      'berufserfahren': 'SENIOR',
      'einsteiger': 'JUNIOR',
      'praktikum': 'INTERNSHIP',
      'werkstudent': 'PART_TIME',
      'vollzeit': 'FULL_TIME',
      'teilzeit': 'PART_TIME'
    };
    
    return typeMap[type.toLowerCase()] || 'FULL_TIME';
  }

  /**
   * Map experience level from RapidAPI to our enum
   */
  private mapExperienceLevel(level?: string): ExperienceLevel {
    if (!level) return 'MID';
    
    const levelMap: Record<string, ExperienceLevel> = {
      // English levels
      'entry': 'JUNIOR',
      'entry-level': 'JUNIOR',
      'junior': 'JUNIOR',
      'mid': 'MID',
      'mid-level': 'MID',
      'middle': 'MID',
      'senior': 'SENIOR',
      'senior-level': 'SENIOR',
      'lead': 'LEAD',
      'lead-level': 'LEAD',
      'principal': 'LEAD',
      'staff': 'LEAD',
      // German levels (ArbeitNow specific)
      'berufserfahren': 'SENIOR',
      'einsteiger': 'JUNIOR',
      'erfahren': 'SENIOR',
      'senior': 'SENIOR',
      'junior': 'JUNIOR',
      'mitte': 'MID',
      'lead': 'LEAD',
      'principal': 'LEAD'
    };
    
    return levelMap[level.toLowerCase()] || 'MID';
  }

  /**
   * Extract country from location string
   */
  private extractCountry(location?: string): string | undefined {
    if (!location) return undefined;
    
    // Common country patterns
    const countries = [
      'United States', 'USA', 'US',
      'United Kingdom', 'UK', 'England', 'Scotland', 'Wales',
      'Canada', 'CA',
      'Australia', 'AU',
      'Germany', 'DE',
      'France', 'FR',
      'Netherlands', 'NL',
      'Sweden', 'SE',
      'Norway', 'NO',
      'Denmark', 'DK',
      'Switzerland', 'CH',
      'Singapore', 'SG',
      'Japan', 'JP',
      'South Korea', 'KR',
      'India', 'IN',
      'Brazil', 'BR',
      'Mexico', 'MX',
      'Argentina', 'AR',
      'Chile', 'CL',
      'Colombia', 'CO',
      'Peru', 'PE',
      'Uruguay', 'UY',
      'Paraguay', 'PY',
      'Bolivia', 'BO',
      'Ecuador', 'EC',
      'Venezuela', 'VE',
      'Guyana', 'GY',
      'Suriname', 'SR',
      'French Guiana', 'GF'
    ];
    
    for (const country of countries) {
      if (location.toLowerCase().includes(country.toLowerCase())) {
        return country;
      }
    }
    
    return undefined;
  }

  /**
   * Import jobs with visa sponsorship focus
   */
  async importJobs(): Promise<ParsedJob[]> {
    try {
      console.log('🚀 Starting RapidAPI (ArbeitNow) job import...');
      
      // Fetch jobs from ArbeitNow API
      const jobs = await this.fetchJobs();
      
      console.log(`📊 Found ${jobs.length} jobs from ArbeitNow`);
      
      // Filter jobs that might offer visa sponsorship or are remote
      const filteredJobs = jobs.filter(job => {
        // Include remote jobs
        if (job.remote) return true;
        
        // Include jobs with visa sponsorship keywords
        return this.checkVisaSponsorship(job);
      });
      
      console.log(`📊 Found ${filteredJobs.length} jobs with visa sponsorship potential`);
      
      // Parse jobs
      const parsedJobs = filteredJobs.map(job => this.parseJob(job));
      
      console.log(`✅ Successfully parsed ${parsedJobs.length} jobs`);
      
      return parsedJobs;
    } catch (error) {
      console.error('❌ Error importing jobs from RapidAPI:', error);
      throw error;
    }
  }
}
