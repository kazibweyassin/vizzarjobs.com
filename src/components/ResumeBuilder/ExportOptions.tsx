'use client';

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Download, FileText, Copy, DollarSign } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import type { ResumeData, ResumeTemplate } from '~/types/resume';

interface ExportOptionsProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  resumeId: string | null;
  atsScore: number | null;
  onImport?: (data: ResumeData) => void;
}

export function ExportOptions({ resumeData, template, resumeId, atsScore, onImport }: ExportOptionsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const exportAsJSON = () => {
    const exportData = {
      resumeData,
      template,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            if (imported.resumeData) {
              // Trigger import callback
              if (window.confirm('Import this resume data? Current data will be replaced.')) {
                if (onImport) {
                  onImport(imported.resumeData);
                } else {
                  // Fallback: reload page with data in URL (not ideal but works)
                  alert('Please use the import feature from the resume builder page');
                }
              }
            } else {
              alert('Invalid resume file format');
            }
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const copyAsText = () => {
    const text = formatResumeAsText(resumeData);
    navigator.clipboard.writeText(text);
    alert('Resume copied to clipboard!');
  };

  const formatResumeAsText = (data: ResumeData): string => {
    let text = `${data.personalInfo.firstName} ${data.personalInfo.lastName}\n`;
    text += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}\n\n`;
    text += `PROFESSIONAL SUMMARY\n${data.personalInfo.summary}\n\n`;
    text += `EXPERIENCE\n`;
    data.workExperience.forEach((exp) => {
      text += `${exp.position} at ${exp.company}\n`;
      text += `${exp.description}\n\n`;
    });
    text += `EDUCATION\n`;
    data.education.forEach((edu) => {
      text += `${edu.degree} in ${edu.field} - ${edu.school}\n`;
    });
    text += `\nSKILLS\n${data.skills.map((s) => s.name).join(', ')}\n`;
    return text;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowPaymentModal(true)}>
            <FileText className="w-4 h-4 mr-2" />
            <span>Download PDF ($2)</span>
            <DollarSign className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportAsJSON}>
            <FileText className="w-4 h-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAsText}>
            <Copy className="w-4 h-4 mr-2" />
            Copy as Text
          </DropdownMenuItem>
          <DropdownMenuItem onClick={importFromJSON}>
            <FileText className="w-4 h-4 mr-2" />
            Import from JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showPaymentModal && (
        <PaymentModal
          resumeData={resumeData}
          template={template}
          resumeId={resumeId}
          atsScore={atsScore}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            // PDF download will be triggered automatically
          }}
        />
      )}
    </>
  );
}

