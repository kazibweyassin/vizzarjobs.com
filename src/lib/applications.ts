export interface JobApplication {
  jobId: string;
  status: ApplicationStatus;
  notes?: string;
  appliedAt: number;
  updatedAt: number;
}

export type ApplicationStatus = 
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'declined'
  | 'withdrawn';

const JOB_APPLICATIONS_KEY = 'vizzar_job_applications';

export function getApplications(): Record<string, JobApplication> {
  try {
    const applicationsJson = localStorage.getItem(JOB_APPLICATIONS_KEY);
    if (!applicationsJson) return {};
    
    return JSON.parse(applicationsJson);
  } catch (error) {
    console.error('Error retrieving job applications:', error);
    return {};
  }
}

export function trackApplication(
  jobId: string, 
  status: ApplicationStatus = 'applied', 
  notes?: string
): void {
  const applications = getApplications();
  const now = Date.now();
  
  // Check if application already exists
  if (applications[jobId]) {
    // Update existing application
    applications[jobId] = {
      ...applications[jobId],
      status,
      notes: notes ?? applications[jobId].notes,
      updatedAt: now
    };
  } else {
    // Add new application
    applications[jobId] = {
      jobId,
      status,
      notes,
      appliedAt: now,
      updatedAt: now
    };
  }

  localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(applications));
}

export function updateApplicationStatus(
  jobId: string, 
  status: ApplicationStatus
): void {
  const applications = getApplications();
  
  if (applications[jobId]) {
    applications[jobId].status = status;
    applications[jobId].updatedAt = Date.now();
    localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(applications));
  }
}

export function updateApplicationNotes(
  jobId: string, 
  notes: string
): void {
  const applications = getApplications();
  
  if (applications[jobId]) {
    applications[jobId].notes = notes;
    applications[jobId].updatedAt = Date.now();
    localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(applications));
  }
}

export function removeApplication(jobId: string): void {
  const applications = getApplications();
  
  if (applications[jobId]) {
    delete applications[jobId];
    localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(applications));
  }
}

export function getApplicationStatus(jobId: string): ApplicationStatus | null {
  const applications = getApplications();
  return applications[jobId]?.status || null;
}

export function hasApplied(jobId: string): boolean {
  const applications = getApplications();
  return !!applications[jobId];
}

export function getApplicationsArray(): JobApplication[] {
  const applications = getApplications();
  return Object.values(applications).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function clearApplications(): void {
  localStorage.removeItem(JOB_APPLICATIONS_KEY);
}

export function getStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case 'applied':
      return 'Applied';
    case 'interviewing':
      return 'Interviewing';
    case 'offer':
      return 'Offer Received';
    case 'rejected':
      return 'Rejected';
    case 'declined':
      return 'Offer Declined';
    case 'withdrawn':
      return 'Application Withdrawn';
    default:
      return status;
  }
}

export function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case 'applied':
      return 'bg-blue-100 text-blue-800';
    case 'interviewing':
      return 'bg-purple-100 text-purple-800';
    case 'offer':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'declined':
      return 'bg-yellow-100 text-yellow-800';
    case 'withdrawn':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
