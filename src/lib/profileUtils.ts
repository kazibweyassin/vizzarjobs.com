import { User } from "@prisma/client";

// Check if a string field is filled
const isFieldFilled = (field: string | null | undefined): boolean => {
  return !!field && field.trim().length > 0;
};

// Check if an array field has items
const isArrayFilled = (field: any[] | null | undefined): boolean => {
  return !!field && field.length > 0;
};

// Calculate the completion percentage of a job seeker profile
export function calculateProfileCompletion(user: User | null | undefined): number {
  if (!user) return 0;

  // If user profile is explicitly marked as complete, return 100%
  if (user.profileComplete) return 100;
  
  // Get the job seeker profile if it exists
  const profile = user.jobSeekerProfile;
  
  // Define total sections to check
  const totalSections = 7;
  let completedSections = 0;
  
  // 1. Basic personal info
  if (isFieldFilled(user.name) && isFieldFilled(user.email)) {
    completedSections += 1;
  }
  
  // If no profile exists yet, return based on basic info only
  if (!profile) {
    return Math.round((completedSections / 1) * 100) / 7; // Only 1/7 can be completed without a profile
  }
  
  // 2. Professional info
  if (isFieldFilled(profile.title) && isFieldFilled(profile.location)) {
    completedSections += 1;
  }
  
  // 3. Skills & Experience
  if (
    isFieldFilled(profile.skills) || 
    isArrayFilled(profile.technicalSkills)
  ) {
    completedSections += 1;
  }
  
  // 4. Career preferences
  if (
    isArrayFilled(profile.preferredJobTypes) &&
    isFieldFilled(profile.desiredSalary)
  ) {
    completedSections += 1;
  }
  
  // 5. Education
  if (isArrayFilled(profile.education)) {
    completedSections += 1;
  }
  
  // 6. Work Experience
  if (isArrayFilled(profile.workExperience)) {
    completedSections += 1;
  }
  
  // 7. Online presence/portfolio
  if (
    isFieldFilled(profile.linkedInProfile) || 
    isFieldFilled(profile.portfolioUrl) ||
    isFieldFilled(profile.githubUrl) ||
    isFieldFilled(profile.personalWebsite)
  ) {
    completedSections += 1;
  }
  
  // Calculate and return percentage
  return Math.round((completedSections / totalSections) * 100);
}