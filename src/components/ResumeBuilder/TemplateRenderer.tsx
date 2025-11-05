'use client';

import type { ResumeData, ResumeTemplate } from '~/types/resume';

interface TemplateRendererProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
}

export function TemplateRenderer({ resumeData, template }: TemplateRendererProps) {
  const { personalInfo, workExperience, education, skills, certifications, projects, languages } = resumeData;

  // Modern template (default)
  if (template === 'modern') {
    return (
      <div className="font-sans text-gray-900">
        {/* Header */}
        <div className="border-b-2 border-blue-600 pb-4 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedinUrl && (
              <a href={personalInfo.linkedinUrl} className="text-blue-600 hover:underline">
                LinkedIn
              </a>
            )}
            {personalInfo.githubUrl && (
              <a href={personalInfo.githubUrl} className="text-blue-600 hover:underline">
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 mb-2 border-b border-gray-200 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Work Experience
            </h2>
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {exp.startDate && (
                        <span>
                          {new Date(exp.startDate + '-01').toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {exp.startDate && (exp.endDate || exp.current) && ' - '}
                      {exp.current ? (
                        <span>Present</span>
                      ) : (
                        exp.endDate && (
                          <span>
                            {new Date(exp.endDate + '-01').toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-600">{edu.school}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {edu.startDate && (
                        <span>
                          {new Date(edu.startDate + '-01').toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {edu.startDate && edu.endDate && ' - '}
                      {edu.endDate && (
                        <span>
                          {new Date(edu.endDate + '-01').toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                >
                  {skill.name} {skill.proficiency && `(${skill.proficiency})`}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span className="text-gray-600"> - {cert.issuer}</span>}
                  {cert.date && (
                    <span className="text-sm text-gray-600 ml-2">
                      ({new Date(cert.date + '-01').toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{project.name}</h3>
                  <p className="text-gray-700 text-sm mt-1">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Technologies: {project.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-blue-600 mb-3 border-b border-gray-200 pb-1">
              Languages
            </h2>
            <div className="flex flex-wrap gap-4">
              {languages.map((lang, index) => (
                <span key={index} className="text-gray-700">
                  {lang.name} <span className="text-gray-500">({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Classic template
  if (template === 'classic') {
    return (
      <div className="font-serif text-gray-900">
        <div className="text-center mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="text-sm text-gray-600 space-x-4">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
          </div>
        </div>
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-2">Objective</h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-t pt-3">Professional Experience</h2>
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {exp.endDate || exp.current ? ' - ' : ''}
                      {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-gray-600 italic mb-1">{exp.company}</p>
                  {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold uppercase mb-3 border-t pt-3">Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <span className="font-semibold">{edu.degree} in {edu.field}</span>
                  {edu.endDate && (
                    <span className="text-sm text-gray-600">
                      {new Date(edu.endDate + '-01').toLocaleDateString('en-US', { year: 'numeric' })}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{edu.school}</p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase mb-2 border-t pt-3">Skills</h2>
            <p className="text-gray-700">{skills.map(s => s.name).join(' • ')}</p>
          </section>
        )}
      </div>
    );
  }

  // Creative template
  if (template === 'creative') {
    return (
      <div className="font-sans text-gray-900">
        <div className="flex items-center gap-6 mb-8 pb-6 border-b-4 border-purple-600">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              {personalInfo.email && <div>{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
            </div>
          </div>
          <div className="text-right space-y-1">
            {personalInfo.linkedinUrl && <a href={personalInfo.linkedinUrl} className="text-purple-600 hover:underline text-sm block">LinkedIn</a>}
            {personalInfo.githubUrl && <a href={personalInfo.githubUrl} className="text-purple-600 hover:underline text-sm block">GitHub</a>}
            {personalInfo.portfolioUrl && <a href={personalInfo.portfolioUrl} className="text-purple-600 hover:underline text-sm block">Portfolio</a>}
          </div>
        </div>
        {personalInfo.summary && (
          <section className="mb-8 bg-purple-50 p-4 rounded-lg">
            <h2 className="text-xl font-bold text-purple-600 mb-2">About</h2>
            <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}
        <div className="grid grid-cols-2 gap-8">
          <div>
            {workExperience.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-purple-600 mb-4">Experience</h2>
                <div className="space-y-4">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-purple-300 pl-4">
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-purple-600 text-sm">{exp.company}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        {exp.endDate || exp.current ? ' - ' : ''}
                        {exp.current ? 'Present' : exp.endDate && new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                      {exp.description && <p className="text-gray-700 text-sm mt-2">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div>
            {education.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-bold text-purple-600 mb-4">Education</h2>
                {education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-purple-600 text-sm">{edu.school}</p>
                    <p className="text-gray-600 text-xs">{edu.field}</p>
                  </div>
                ))}
              </section>
            )}
            {skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-purple-600 mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Technical template
  if (template === 'technical') {
    return (
      <div className="font-mono text-gray-900">
        <div className="mb-6 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold mb-2">
            {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
          </h1>
          <div className="text-xs text-gray-600 space-x-4">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>| {personalInfo.phone}</span>}
            {personalInfo.location && <span>| {personalInfo.location}</span>}
          </div>
          <div className="text-xs mt-2 space-x-4">
            {personalInfo.linkedinUrl && <a href={personalInfo.linkedinUrl} className="text-blue-600">linkedin.com/in/...</a>}
            {personalInfo.githubUrl && <a href={personalInfo.githubUrl} className="text-blue-600">github.com/...</a>}
          </div>
        </div>
        {personalInfo.summary && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">SUMMARY</h2>
            <p className="text-xs text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}
        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm font-bold uppercase mb-3 border-b border-gray-300 pb-1">EXPERIENCE</h2>
            {workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold">{exp.position.toUpperCase()} | {exp.company.toUpperCase()}</span>
                  <span className="text-gray-600">
                    {exp.startDate && new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                    {exp.endDate || exp.current ? ' - ' : ''}
                    {exp.current ? 'PRESENT' : exp.endDate && new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                  </span>
                </div>
                {exp.description && <p className="text-xs text-gray-700 ml-4">{exp.description}</p>}
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-6">
          {education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">EDUCATION</h2>
              {education.map((edu, index) => (
                <div key={index} className="mb-2 text-xs">
                  <div className="font-bold">{edu.degree.toUpperCase()}</div>
                  <div className="text-gray-600">{edu.school}</div>
                  <div className="text-gray-500">{edu.field}</div>
                </div>
              ))}
            </section>
          )}
          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase mb-2 border-b border-gray-300 pb-1">TECHNICAL SKILLS</h2>
              <div className="text-xs space-y-1">
                {skills.map((skill, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{skill.name}</span>
                    <span className="text-gray-500">[{skill.proficiency.toUpperCase()}]</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // Fallback to modern template (should not reach here, but just in case)
  return (
    <div className="font-sans text-gray-900">
      <p>Template not found. Please select a valid template.</p>
    </div>
  );
}

