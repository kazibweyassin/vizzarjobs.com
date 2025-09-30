"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Crown, 
  Lock, 
  Star, 
  Check, 
  ArrowRight,
  Eye,
  Users,
  Zap,
  DollarSign
} from "lucide-react";
import Link from "next/link";

interface PremiumPaywallProps {
  jobTitle: string;
  companyName: string;
  onClose?: () => void;
}

export function PremiumPaywall({ jobTitle, companyName, onClose }: PremiumPaywallProps) {
  const { data: session } = useSession();
  const [showPlans, setShowPlans] = useState(false);

  // Check if user has premium access
  const { data: hasPremiumAccess } = api.subscriptions.hasPremiumAccess.useQuery(
    undefined,
    { enabled: !!session?.user }
  );

  // Get subscription plans
  const { data: plans } = api.subscriptions.getPlans.useQuery();

  const premiumFeatures = [
    "View full job details and requirements",
    "Apply to premium job listings",
    "Priority application review",
    "Direct employer contact information",
    "Advanced salary insights",
    "Interview preparation guides"
  ];

  if (hasPremiumAccess) {
    return null; // Don't show paywall if user has premium access
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showPlans ? (
          // Initial paywall screen
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Premium Job Access Required
              </h2>
              
              <p className="text-gray-600 mb-4">
                This is a premium job listing for <strong>{jobTitle}</strong> at <strong>{companyName}</strong>.
              </p>
              
              <p className="text-gray-600">
                Subscribe to VizzarJobs Premium to view full details and apply.
              </p>
            </div>

            {/* Premium Benefits */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                What you get with Premium:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Higher Response Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">3x</div>
                  <div className="text-sm text-gray-600">More Interviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">$15k</div>
                  <div className="text-sm text-gray-600">Higher Salary</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowPlans(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Crown className="w-5 h-5" />
                View Premium Plans
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {!session?.user ? (
                <Link
                  href="/auth/signin?callbackUrl=/pricing"
                  className="block w-full text-center text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Sign in to subscribe
                </Link>
              ) : (
                <Link
                  href="/pricing"
                  className="block w-full text-center text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View all plans
                </Link>
              )}
              
              <button
                onClick={onClose}
                className="block w-full text-center text-gray-500 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        ) : (
          // Plans selection screen
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Premium Plan
              </h2>
              <p className="text-gray-600">
                Unlock access to premium jobs and accelerate your career
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {plans?.filter(plan => plan.id !== "basic").map((plan) => (
                <Card 
                  key={plan.id}
                  className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pt-6">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{plan.billingCycle.toLowerCase()}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/pricing"
                      className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Choose Plan
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowPlans(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to job details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


