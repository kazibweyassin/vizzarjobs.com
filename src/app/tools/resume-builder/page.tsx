'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ResumeForm } from '~/components/ResumeBuilder/ResumeForm';
import { ResumePreview } from '~/components/ResumeBuilder/ResumePreview';
import { TemplateSelector } from '~/components/ResumeBuilder/TemplateSelector';
import { ATSScoreCard } from '~/components/ResumeBuilder/ATSScoreCard';
import { ExportOptions } from '~/components/ResumeBuilder/ExportOptions';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { FileText, Download, Save, Eye } from 'lucide-react';
import type { ResumeData, ResumeTemplate } from '~/types/resume';
import { calculateATSScore } from '~/lib/ats-scoring';
import { useAutoSave } from '~/components/ResumeBuilder/useAutoSave';

const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  languages: [],
};

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('modern');
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'preview'>('form');
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);

  // Load resume if ID is provided in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const resumeId = searchParams.get('id');
    const download = searchParams.get('download');
    
    if (resumeId && session?.user) {
      loadResume(resumeId);
    }
    
    if (download === 'true' && resumeId) {
      // Trigger download after payment
      handleDownloadAfterPayment(resumeId);
    }
  }, [session]);

  const loadResume = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resume/${resumeId}`);
      if (response.ok) {
        const data = await response.json();
        setResumeData(data.data as ResumeData);
        setSelectedTemplate((data.template as ResumeTemplate) || 'modern');
        setSavedResumeId(data.id);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
    }
  };

  const handleDownloadAfterPayment = async (resumeId: string) => {
    // Check if payment was successful and download
    const checkResponse = await fetch(`/api/resume/${resumeId}/check-payment`);
    if (checkResponse.ok) {
      const { paid } = await checkResponse.json();
      if (paid) {
        window.location.href = `/api/resume/generate-pdf?resumeId=${resumeId}`;
      }
    }
  };

  // Auto-save functionality
  const { autoSave, isSaving } = useAutoSave(resumeData, savedResumeId);

  // Calculate ATS score when data changes
  useEffect(() => {
    const score = calculateATSScore(resumeData);
    setAtsScore(score);
  }, [resumeData]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/tools/resume-builder');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume builder...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ATS Resume Builder</h1>
                <p className="text-gray-600">Create an ATS-optimized resume. Free to build, $2 to download PDF.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'form' ? 'preview' : 'form')}
              >
                <Eye className="w-4 h-4 mr-2" />
                {viewMode === 'form' ? 'Preview' : 'Edit'}
              </Button>
              <ExportOptions
                resumeData={resumeData}
                template={selectedTemplate}
                resumeId={savedResumeId}
                atsScore={atsScore}
                onImport={(importedData) => {
                  setResumeData(importedData);
                }}
              />
            </div>
          </div>

          {/* ATS Score */}
          {atsScore !== null && (
            <div className="mb-4">
              <ATSScoreCard score={atsScore} resumeData={resumeData} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Template Selector */}
          <div className="lg:col-span-1">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {viewMode === 'form' ? (
              <ResumeForm
                resumeData={resumeData}
                onUpdate={setResumeData}
                onSave={(id) => {
                  setSavedResumeId(id);
                  autoSave();
                }}
                isSaving={isSaving}
              />
            ) : (
              <ResumePreview
                resumeData={resumeData}
                template={selectedTemplate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

