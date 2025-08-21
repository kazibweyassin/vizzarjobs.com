"use client";

import { useState } from "react";

interface LeadData {
  name: string;
  email: string;
  interests: string[];
}

interface UseLeadCaptureReturn {
  submitLead: (data: LeadData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function useLeadCapture(): UseLeadCaptureReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitLead = async (data: LeadData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit your information");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitLead,
    isLoading,
    error,
    success,
  };
}
