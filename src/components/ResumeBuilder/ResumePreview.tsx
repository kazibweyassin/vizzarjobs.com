'use client';

import { Card, CardContent } from '~/components/ui/card';
import type { ResumeData, ResumeTemplate } from '~/types/resume';
import { TemplateRenderer } from './TemplateRenderer';

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
}

export function ResumePreview({ resumeData, template }: ResumePreviewProps) {
  return (
    <Card>
      <CardContent className="p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <TemplateRenderer resumeData={resumeData} template={template} />
        </div>
      </CardContent>
    </Card>
  );
}

