export interface SavedJob {
  id: string;
  savedAt: number;
  collection?: string;
}

const SAVED_JOBS_KEY = 'vizzar_saved_jobs';

export function getSavedJobs(): Record<string, SavedJob> {
  try {
    const savedJobsJson = localStorage.getItem(SAVED_JOBS_KEY);
    if (!savedJobsJson) return {};
    
    return JSON.parse(savedJobsJson);
  } catch (error) {
    console.error('Error retrieving saved jobs:', error);
    return {};
  }
}

export function saveJob(jobId: string, collection?: string): void {
  const savedJobs = getSavedJobs();
  
  savedJobs[jobId] = {
    id: jobId,
    savedAt: Date.now(),
    collection
  };

  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
}

export function removeJob(jobId: string): void {
  const savedJobs = getSavedJobs();
  
  if (savedJobs[jobId]) {
    delete savedJobs[jobId];
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  }
}

export function isJobSaved(jobId: string): boolean {
  const savedJobs = getSavedJobs();
  return !!savedJobs[jobId];
}

export function updateJobCollection(jobId: string, collection: string): void {
  const savedJobs = getSavedJobs();
  
  if (savedJobs[jobId]) {
    savedJobs[jobId].collection = collection;
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
  }
}

export function getSavedJobsArray(): SavedJob[] {
  const savedJobs = getSavedJobs();
  return Object.values(savedJobs).sort((a, b) => b.savedAt - a.savedAt);
}

export function clearSavedJobs(): void {
  localStorage.removeItem(SAVED_JOBS_KEY);
}
