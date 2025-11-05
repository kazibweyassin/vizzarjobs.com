import jsPDF from 'jspdf';
import type { ResumeData, ResumeTemplate } from '~/types/resume';

/**
 * Generate a PDF from resume data
 */
export async function generateResumePDF(
  resumeData: ResumeData,
  template: ResumeTemplate = 'modern'
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;
  const lineHeight = 7;
  const sectionSpacing = 10;

  // Helper to add text with word wrapping
  const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    
    // Check if we need a new page
    if (yPosition + (lines.length * lineHeight) > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight;
  };

  const addSectionHeader = (title: string) => {
    yPosition += sectionSpacing;
    if (yPosition > pageHeight - margin - 20) {
      doc.addPage();
      yPosition = margin;
    }
    addText(title, 14, true, [0, 102, 204]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
    yPosition += 3;
  };

  const { personalInfo, workExperience, education, skills, certifications, projects, languages } = resumeData;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 102, 204);
  doc.text(`${personalInfo.firstName} ${personalInfo.lastName}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Contact Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const contactInfo: string[] = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);
  if (personalInfo.linkedinUrl) contactInfo.push('LinkedIn');
  if (personalInfo.githubUrl) contactInfo.push('GitHub');
  
  doc.text(contactInfo.join(' | '), pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Professional Summary
  if (personalInfo.summary) {
    addSectionHeader('Professional Summary');
    addText(personalInfo.summary, 10, false);
  }

  // Work Experience
  if (workExperience.length > 0) {
    addSectionHeader('Work Experience');
    workExperience.forEach((exp) => {
      // Position and Company
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(exp.position, margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const dateRange = `${exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''} - ${exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}`;
      doc.text(`${exp.company} | ${dateRange}`, margin, yPosition);
      yPosition += 5;
      
      if (exp.description) {
        addText(exp.description, 10, false);
      }
      yPosition += 3;
    });
  }

  // Education
  if (education.length > 0) {
    addSectionHeader('Education');
    education.forEach((edu) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`${edu.degree} in ${edu.field}`, margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const eduDate = edu.endDate ? new Date(edu.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric' }) : '';
      doc.text(`${edu.school}${eduDate ? ` | ${eduDate}` : ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`, margin, yPosition);
      yPosition += 8;
    });
  }

  // Skills
  if (skills.length > 0) {
    addSectionHeader('Skills');
    const skillsText = skills.map((s) => `${s.name}${s.proficiency ? ` (${s.proficiency})` : ''}`).join(', ');
    addText(skillsText, 10, false);
  }

  // Certifications
  if (certifications.length > 0) {
    addSectionHeader('Certifications');
    certifications.forEach((cert) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(cert.name, margin, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const certDate = cert.date ? new Date(cert.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      doc.text(`${cert.issuer}${certDate ? ` | ${certDate}` : ''}`, margin, yPosition);
      yPosition += 8;
    });
  }

  // Projects
  if (projects.length > 0) {
    addSectionHeader('Projects');
    projects.forEach((project) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(project.name, margin, yPosition);
      yPosition += 6;
      
      if (project.description) {
        addText(project.description, 10, false);
      }
      
      if (project.technologies.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Technologies: ${project.technologies.join(', ')}`, margin, yPosition);
        yPosition += 6;
      }
      
      yPosition += 3;
    });
  }

  // Languages
  if (languages.length > 0) {
    addSectionHeader('Languages');
    const languagesText = languages.map((l) => `${l.name} (${l.proficiency})`).join(', ');
    addText(languagesText, 10, false);
  }

  // Convert to buffer
  const pdfBlob = doc.output('arraybuffer');
  return Buffer.from(pdfBlob);
}

