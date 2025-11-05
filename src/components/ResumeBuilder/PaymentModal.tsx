'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { DollarSign, FileText, CheckCircle, Loader2 } from 'lucide-react';
import type { ResumeData, ResumeTemplate } from '~/types/resume';
import { api } from '~/trpc/react';

interface PaymentModalProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  resumeId: string | null;
  atsScore: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({
  resumeData,
  template,
  resumeId,
  atsScore,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!session?.user) {
      setError('Please sign in to download your resume');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // First, ensure resume is saved
      let resumeIdToUse = resumeId;
      if (!resumeIdToUse) {
        const saveResponse = await fetch('/api/resume/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: resumeData, template }),
        });
        if (saveResponse.ok) {
          const saved = await saveResponse.json();
          resumeIdToUse = saved.id;
        }
      }

      // Create payment intent
      const paymentResponse = await fetch('/api/resume/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resumeIdToUse,
          amount: 2.0,
          currency: 'USD',
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment');
      }

      const paymentData = await paymentResponse.json();

      // Redirect to payment URL or handle payment
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else if (paymentData.success) {
        // Payment completed immediately, download PDF
        await downloadPDF(resumeIdToUse);
        onSuccess();
      } else {
        throw new Error(paymentData.error || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      setIsProcessing(false);
    }
  };

  const downloadPDF = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resume/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          template,
          resumeData,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${resumeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('PDF download failed:', err);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Download Resume PDF
          </DialogTitle>
          <DialogDescription>
            Get your ATS-optimized resume as a professional PDF for just $2
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">PDF Download</p>
                  <p className="text-2xl font-bold">$2.00</p>
                </div>
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>ATS-optimized formatting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Professional template</span>
                </div>
                {atsScore !== null && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>ATS Score: {atsScore}/100</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Instant download</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Pay $2.00
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Secure payment processed by our payment provider
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

