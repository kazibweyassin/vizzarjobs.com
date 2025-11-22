import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates and cleans job data to ensure data integrity
 * @param job - The job object to validate
 * @returns true if the job is valid, false otherwise
 */
export function isValidJob(job: any): boolean {
  // Basic existence checks
  if (!job || !job.id) return false;
  
  // Title validation - must exist and be non-empty
  if (!job.title || typeof job.title !== 'string' || job.title.trim().length === 0) {
    return false;
  }
  
  // Company validation - must exist and have valid name
  if (!job.company || !job.company.name || typeof job.company.name !== 'string' || job.company.name.trim().length === 0) {
    return false;
  }
  
  // Location validation - if present, must be valid
  if (job.location && (typeof job.location !== 'string' || job.location.trim().length === 0)) {
    return false;
  }
  
  // Salary validation - if both present, min must be <= max
  if (job.salaryMin !== null && job.salaryMin !== undefined && 
      job.salaryMax !== null && job.salaryMax !== undefined) {
    if (typeof job.salaryMin !== 'number' || typeof job.salaryMax !== 'number' ||
        job.salaryMin < 0 || job.salaryMax < 0 || job.salaryMin > job.salaryMax) {
      return false;
    }
  }
  
  // Ensure salaryMin is valid if present alone
  if (job.salaryMin !== null && job.salaryMin !== undefined && 
      (typeof job.salaryMin !== 'number' || job.salaryMin < 0)) {
    return false;
  }
  
  // Ensure salaryMax is valid if present alone
  if (job.salaryMax !== null && job.salaryMax !== undefined && 
      (typeof job.salaryMax !== 'number' || job.salaryMax < 0)) {
    return false;
  }
  
  // Ensure arrays are properly formatted
  if (job.skills && !Array.isArray(job.skills)) return false;
  if (job.techStack && !Array.isArray(job.techStack)) return false;
  if (job.requirements && !Array.isArray(job.requirements)) return false;
  
  // Filter out jobs with invalid boolean values
  if (typeof job.remote !== 'boolean') return false;
  if (typeof job.visaSponsorship !== 'boolean') return false;
  if (typeof job.featured !== 'boolean') return false;
  
  return true;
}

/**
 * Cleans and filters an array of jobs
 * @param jobs - Array of jobs to clean
 * @returns Array of valid jobs
 */
export function cleanJobs(jobs: any[]): any[] {
  if (!Array.isArray(jobs)) return [];
  return jobs.filter(isValidJob);
}
