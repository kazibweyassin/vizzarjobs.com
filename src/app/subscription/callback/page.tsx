"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CheckCircle, XCircle, Loader2, Crown } from "lucide-react";

export default function SubscriptionCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const verifyPaymentMutation = api.subscriptions.verifyPayment.useMutation({
    onSuccess: () => {
      setStatus('success');
      setMessage('Payment verified successfully! Your premium subscription is now active.');
    },
    onError: (error) => {
      setStatus('error');
      setMessage(error.message || 'Payment verification failed.');
    }
  });

  useEffect(() => {
    const subscriptionId = searchParams.get('subscription_id');
    const transactionId = searchParams.get('transaction_id');
    const status = searchParams.get('status');

    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (!subscriptionId || !transactionId) {
      setStatus('error');
      setMessage('Missing payment information. Please try again.');
      return;
    }

    if (status === 'success' || status === 'completed') {
      // Verify payment
      verifyPaymentMutation.mutate({
        subscriptionId,
        transactionId,
      });
    } else {
      setStatus('error');
      setMessage('Payment was not completed successfully.');
    }
  }, [searchParams, session, router, verifyPaymentMutation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600">Verifying your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Crown className="w-6 h-6 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">Premium Access Activated</span>
                </div>
                <p className="text-sm text-yellow-700">
                  You now have access to all premium job listings and features!
                </p>
              </div>
              <button
                onClick={() => router.push('/jobs')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse Premium Jobs
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Contact Support
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


