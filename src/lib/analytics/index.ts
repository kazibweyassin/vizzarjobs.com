/**
 * VizzarJobs Analytics Utility
 * 
 * This module provides functions to track user interactions and events
 * throughout the VizzarJobs platform.
 */

// Measurement ID from Google Analytics
export const GA_MEASUREMENT_ID = 'G-F3WJBPTC6F';

// Track a page view
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track a custom event
type EventParams = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any; // Allow for custom parameters
};

export const trackEvent = ({
  action,
  category = "engagement",
  label,
  value,
  ...customParams
}: EventParams) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customParams,
    });
  }
};

// Common events for VizzarJobs
export const jobEvents = {
  view: (jobId: string, jobTitle: string) => 
    trackEvent({
      action: 'view_job',
      category: 'jobs',
      label: jobTitle,
      job_id: jobId
    }),
  
  apply: (jobId: string, jobTitle: string) =>
    trackEvent({
      action: 'apply_job',
      category: 'jobs',
      label: jobTitle,
      job_id: jobId
    }),

  search: (query: string, resultCount: number) =>
    trackEvent({
      action: 'search_jobs',
      category: 'jobs',
      label: query,
      value: resultCount
    }),
};

export const userEvents = {
  login: (method: string) =>
    trackEvent({
      action: 'login',
      category: 'user',
      label: method
    }),

  signup: (method: string) =>
    trackEvent({
      action: 'signup',
      category: 'user',
      label: method
    }),
    
  updateProfile: () =>
    trackEvent({
      action: 'update_profile',
      category: 'user'
    })
};

export const employerEvents = {
  postJob: (jobId: string, jobTitle: string) =>
    trackEvent({
      action: 'post_job',
      category: 'employer',
      label: jobTitle,
      job_id: jobId
    }),
    
  viewApplications: (jobId: string, jobTitle: string) =>
    trackEvent({
      action: 'view_applications',
      category: 'employer',
      label: jobTitle,
      job_id: jobId
    })
};
