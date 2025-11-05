import type { ResumeData } from '~/types/resume';

/**
 * Calculate ATS (Applicant Tracking System) compatibility score
 * Returns a score from 0-100
 */
export function calculateATSScore(resumeData: ResumeData): number {
  let score = 0;
  let maxScore = 0;

  // Personal Information (20 points)
  maxScore += 20;
  const personalInfo = resumeData.personalInfo;
  if (personalInfo.firstName && personalInfo.lastName) score += 3;
  if (personalInfo.email) score += 3;
  if (personalInfo.phone) score += 3;
  if (personalInfo.location) score += 3;
  if (personalInfo.summary && personalInfo.summary.length > 50) score += 4;
  if (personalInfo.linkedinUrl) score += 2;
  if (personalInfo.githubUrl || personalInfo.portfolioUrl) score += 2;

  // Work Experience (30 points)
  maxScore += 30;
  if (resumeData.workExperience.length > 0) {
    score += 10; // Has experience
    resumeData.workExperience.forEach((exp) => {
      if (exp.company && exp.position) score += 2;
      if (exp.description && exp.description.length > 50) score += 2;
      if (exp.startDate) score += 1;
      // Check for action verbs and quantifiable achievements
      const description = exp.description.toLowerCase();
      const actionVerbs = [
        'developed', 'implemented', 'created', 'built', 'designed',
        'managed', 'led', 'improved', 'increased', 'reduced', 'achieved',
        'optimized', 'delivered', 'executed', 'collaborated'
      ];
      if (actionVerbs.some(verb => description.includes(verb))) score += 1;
      // Check for numbers (quantifiable achievements)
      if (/\d+%|\d+\s*(users|customers|revenue|\$|percent)/i.test(description)) score += 1;
    });
    // Cap experience score at 30
    score = Math.min(score, maxScore - 10);
  }

  // Education (15 points)
  maxScore += 15;
  if (resumeData.education.length > 0) {
    resumeData.education.forEach((edu) => {
      if (edu.school && edu.degree) score += 5;
      if (edu.field) score += 2;
      if (edu.startDate) score += 1;
      if (edu.gpa) score += 1;
    });
    score = Math.min(score, maxScore - 5);
  }

  // Skills (20 points)
  maxScore += 20;
  if (resumeData.skills.length >= 5) {
    score += 10; // Has adequate number of skills
    resumeData.skills.forEach((skill) => {
      if (skill.name && skill.name.length > 0) score += 1;
      if (skill.proficiency) score += 0.5;
    });
    score = Math.min(score, maxScore - 5);
  }

  // Certifications (5 points)
  maxScore += 5;
  if (resumeData.certifications.length > 0) {
    resumeData.certifications.forEach((cert) => {
      if (cert.name && cert.issuer) score += 2;
      if (cert.date) score += 0.5;
    });
    score = Math.min(score, maxScore - 2);
  }

  // Projects (5 points)
  maxScore += 5;
  if (resumeData.projects.length > 0) {
    resumeData.projects.forEach((project) => {
      if (project.name && project.description) score += 1;
      if (project.technologies && project.technologies.length > 0) score += 0.5;
    });
    score = Math.min(score, maxScore - 2);
  }

  // Languages (5 points)
  maxScore += 5;
  if (resumeData.languages.length > 0) {
    resumeData.languages.forEach((lang) => {
      if (lang.name) score += 1;
      if (lang.proficiency) score += 0.5;
    });
    score = Math.min(score, maxScore - 2);
  }

  // Calculate percentage
  const finalScore = Math.round((score / maxScore) * 100);
  return Math.min(100, Math.max(0, finalScore));
}

/**
 * Get ATS recommendations for improvement
 */
export function getATSRecommendations(resumeData: ResumeData): string[] {
  const recommendations: string[] = [];
  const score = calculateATSScore(resumeData);

  // Personal info recommendations
  if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 50) {
    recommendations.push('Add a professional summary (50+ characters)');
  }
  if (!resumeData.personalInfo.linkedinUrl) {
    recommendations.push('Add your LinkedIn profile URL');
  }

  // Experience recommendations
  if (resumeData.workExperience.length === 0) {
    recommendations.push('Add at least one work experience');
  } else {
    resumeData.workExperience.forEach((exp, index) => {
      if (!exp.description || exp.description.length < 50) {
        recommendations.push(`Add more details to experience #${index + 1}`);
      }
      const description = exp.description.toLowerCase();
      if (!/\d+/.test(description)) {
        recommendations.push(`Add quantifiable achievements to experience #${index + 1}`);
      }
    });
  }

  // Education recommendations
  if (resumeData.education.length === 0) {
    recommendations.push('Add your education background');
  }

  // Skills recommendations
  if (resumeData.skills.length < 5) {
    recommendations.push('Add at least 5-10 relevant skills');
  }

  // General recommendations
  if (score < 70) {
    recommendations.push('Focus on adding more quantifiable achievements');
    recommendations.push('Use action verbs in your descriptions');
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

