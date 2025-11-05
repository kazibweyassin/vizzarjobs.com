'use client';

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '~/components/ui/button';

interface SectionEditorProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function SectionEditor({ title, isExpanded, onToggle, children }: SectionEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-3 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && <CardContent>{children}</CardContent>}
    </Card>
  );
}

