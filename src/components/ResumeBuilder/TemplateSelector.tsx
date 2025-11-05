'use client';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Check } from 'lucide-react';
import type { ResumeTemplate } from '~/types/resume';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onSelectTemplate: (template: ResumeTemplate) => void;
}

const templates: Array<{ id: ResumeTemplate; name: string; description: string }> = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimal design, perfect for tech roles',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional format, ATS-friendly',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'For design and creative positions',
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for developer and engineering roles',
  },
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant={selectedTemplate === template.id ? 'default' : 'outline'}
            className="w-full justify-start h-auto p-4 flex flex-col items-start"
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-semibold">{template.name}</span>
              {selectedTemplate === template.id && (
                <Check className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs text-gray-600 text-left">{template.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

