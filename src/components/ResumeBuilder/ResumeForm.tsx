'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import type { ResumeData, WorkExperience, Education, Skill, Certification, Project, Language } from '~/types/resume';
import { SectionEditor } from './SectionEditor';

interface ResumeFormProps {
  resumeData: ResumeData;
  onUpdate: (data: ResumeData) => void;
  onSave: (id: string | null) => void;
  isSaving: boolean;
}

export function ResumeForm({ resumeData, onUpdate, onSave }: ResumeFormProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    onUpdate({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value,
      },
    });
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: [],
    };
    onUpdate({
      ...resumeData,
      workExperience: [...resumeData.workExperience, newExp],
    });
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onUpdate({
      ...resumeData,
      workExperience: resumeData.workExperience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeWorkExperience = (id: string) => {
    onUpdate({
      ...resumeData,
      workExperience: resumeData.workExperience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    onUpdate({
      ...resumeData,
      education: [...resumeData.education, newEdu],
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onUpdate({
      ...resumeData,
      education: resumeData.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onUpdate({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'intermediate',
    };
    onUpdate({
      ...resumeData,
      skills: [...resumeData.skills, newSkill],
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    onUpdate({
      ...resumeData,
      skills: resumeData.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    onUpdate({
      ...resumeData,
      skills: resumeData.skills.filter((skill) => skill.id !== id),
    });
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
    };
    onUpdate({
      ...resumeData,
      certifications: [...resumeData.certifications, newCert],
    });
  };

  const updateCertification = (id: string, field: keyof Certification, value: any) => {
    onUpdate({
      ...resumeData,
      certifications: resumeData.certifications.map((cert) =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    });
  };

  const removeCertification = (id: string) => {
    onUpdate({
      ...resumeData,
      certifications: resumeData.certifications.filter((cert) => cert.id !== id),
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
    };
    onUpdate({
      ...resumeData,
      projects: [...resumeData.projects, newProject],
    });
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    onUpdate({
      ...resumeData,
      projects: resumeData.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    });
  };

  const removeProject = (id: string) => {
    onUpdate({
      ...resumeData,
      projects: resumeData.projects.filter((project) => project.id !== id),
    });
  };

  const addLanguage = () => {
    const newLang: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'fluent',
    };
    onUpdate({
      ...resumeData,
      languages: [...resumeData.languages, newLang],
    });
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    onUpdate({
      ...resumeData,
      languages: resumeData.languages.map((lang) =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    });
  };

  const removeLanguage = (id: string) => {
    onUpdate({
      ...resumeData,
      languages: resumeData.languages.filter((lang) => lang.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <SectionEditor
        title="Personal Information"
        isExpanded={expandedSections.has('personal')}
        onToggle={() => toggleSection('personal')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={resumeData.personalInfo.firstName}
              onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={resumeData.personalInfo.lastName}
              onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="City, Country"
            />
          </div>
          <div>
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              value={resumeData.personalInfo.linkedinUrl || ''}
              onChange={(e) => updatePersonalInfo('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              value={resumeData.personalInfo.githubUrl || ''}
              onChange={(e) => updatePersonalInfo('githubUrl', e.target.value)}
              placeholder="https://github.com/johndoe"
            />
          </div>
          <div>
            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
            <Input
              id="portfolioUrl"
              value={resumeData.personalInfo.portfolioUrl || ''}
              onChange={(e) => updatePersonalInfo('portfolioUrl', e.target.value)}
              placeholder="https://johndoe.com"
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="summary">Professional Summary *</Label>
          <Textarea
            id="summary"
            value={resumeData.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={4}
          />
        </div>
      </SectionEditor>

      {/* Work Experience */}
      <SectionEditor
        title="Work Experience"
        isExpanded={expandedSections.has('experience')}
        onToggle={() => toggleSection('experience')}
      >
        {resumeData.workExperience.map((exp, index) => (
          <Card key={exp.id} className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Experience #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeWorkExperience(exp.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Company *</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Position *</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={exp.location || ''}
                    onChange={(e) => updateWorkExperience(exp.id, 'location', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <Label>Start Date *</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate || ''}
                    onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateWorkExperience(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                    Current Position
                  </Label>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" onClick={addWorkExperience} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Work Experience
        </Button>
      </SectionEditor>

      {/* Education */}
      <SectionEditor
        title="Education"
        isExpanded={expandedSections.has('education')}
        onToggle={() => toggleSection('education')}
      >
        {resumeData.education.map((edu, index) => (
          <Card key={edu.id} className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>School/University *</Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <Label>Degree *</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>
                <div>
                  <Label>Field of Study *</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date / Graduation</Label>
                  <Input
                    type="month"
                    value={edu.endDate || ''}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
                <div>
                  <Label>Honors/Awards</Label>
                  <Input
                    value={edu.honors || ''}
                    onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
                    placeholder="Summa Cum Laude, Dean's List"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" onClick={addEducation} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </SectionEditor>

      {/* Skills */}
      <SectionEditor
        title="Skills"
        isExpanded={expandedSections.has('skills')}
        onToggle={() => toggleSection('skills')}
      >
        <div className="space-y-3">
          {resumeData.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-3">
              <Input
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                placeholder="Skill name"
                className="flex-1"
              />
              <Select
                value={skill.proficiency}
                onValueChange={(value) => updateSkill(skill.id, 'proficiency', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(skill.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addSkill} className="w-full mt-4">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </SectionEditor>

      {/* Certifications */}
      <SectionEditor
        title="Certifications"
        isExpanded={expandedSections.has('certifications')}
        onToggle={() => toggleSection('certifications')}
      >
        {resumeData.certifications.map((cert, index) => (
          <Card key={cert.id} className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Certification #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Certification Name *</Label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <Label>Issuing Organization *</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Issue Date *</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    type="month"
                    value={cert.expiryDate || ''}
                    onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Credential ID</Label>
                  <Input
                    value={cert.credentialId || ''}
                    onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                    placeholder="Credential ID or URL"
                  />
                </div>
                <div>
                  <Label>Verification URL</Label>
                  <Input
                    value={cert.url || ''}
                    onChange={(e) => updateCertification(cert.id, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" onClick={addCertification} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </SectionEditor>

      {/* Projects */}
      <SectionEditor
        title="Projects"
        isExpanded={expandedSections.has('projects')}
        onToggle={() => toggleSection('projects')}
      >
        {resumeData.projects.map((project, index) => (
          <Card key={project.id} className="mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Project #{index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Project Name *</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="Project Name"
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe the project, your role, and key achievements..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Technologies (comma-separated)</Label>
                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) =>
                    updateProject(
                      project.id,
                      'technologies',
                      e.target.value.split(',').map((t) => t.trim())
                    )
                  }
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project URL</Label>
                  <Input
                    value={project.url || ''}
                    onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                    placeholder="https://project.com"
                  />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input
                    value={project.githubUrl || ''}
                    onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                    placeholder="https://github.com/user/project"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        <Button variant="outline" onClick={addProject} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </SectionEditor>

      {/* Languages */}
      <SectionEditor
        title="Languages"
        isExpanded={expandedSections.has('languages')}
        onToggle={() => toggleSection('languages')}
      >
        <div className="space-y-3">
          {resumeData.languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-3">
              <Input
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                placeholder="Language name"
                className="flex-1"
              />
              <Select
                value={lang.proficiency}
                onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(lang.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={addLanguage} className="w-full mt-4">
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </SectionEditor>
    </div>
  );
}

