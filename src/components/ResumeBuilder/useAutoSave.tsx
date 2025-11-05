'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { ResumeData } from '~/types/resume';

export function useAutoSave(resumeData: ResumeData, savedResumeId: string | null) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const autoSave = useCallback(async () => {
    if (!session?.user) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: savedResumeId,
          data: resumeData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setLastSaved(new Date());
        return result.id;
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [resumeData, savedResumeId, session]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!session?.user) return;

    const interval = setInterval(() => {
      autoSave();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoSave, session]);

  return {
    autoSave,
    isSaving,
    lastSaved,
  };
}

