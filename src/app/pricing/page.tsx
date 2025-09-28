"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { 
  Check, 
  Crown, 
  Star, 
  Zap, 
  Users, 
  Eye, 
  Briefcase,
  DollarSign,
  Calendar,
  Loader2,
  CreditCard,
  Smartphone,
  Building2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">("MONTHLY");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  // Fetch subscription plans
  const { data: plans, isLoading: plansLoading } = api.subscriptions.getPlans.useQuery();
  
  // Fetch payment methods for Uganda
  const { data: paymentMethods } = api.subscriptions.getPaymentMethods.useQuery({ region: 'UG' });
  
  // Check current subscription
  const { data: currentSubscription } = api.subscriptions.getCurrentSubscription.useQuery(
    undefined,
    { enabled: !!session?.user }
  );

  // Initiate payment mutation
  const initiatePaymentMutation = api.subscriptions.initiatePayment.useMutation({
    onSuccess: (data) => {
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
      } else {
        alert("Payment initiated successfully! Please check your email for further instructions.");
      }
    },
    onError: (error) => {
      alert(`Error initiating payment: ${error.message}`);
    }
  });

  // Create subscription mutation (for testing)
  const createSubscriptionMutation = api.subscriptions.createSubscription.useMutation({
    onSuccess: () => {
      alert("Subscription created successfully! You now have premium access.");
      window.location.reload();
    },
    onError: (error) => {
      alert(`Error creating subscription: ${error.message}`);
    }
  });

  const handleSubscribe = (planId: string, planName: string, price: number) => {
    if (!session?.user) {
      alert("Please sign in to subscribe");
      return;
    }

    if (currentSubscription) {
      alert("You already have an active subscription");
      return;
    }

    // Show payment method selection
    setSelectedPlan(planId);
    setShowPaymentMethods(true);
  };

  const handlePaymentMethodSelect = (paymentMethod: any) => {
    setSelectedPaymentMethod(paymentMethod);
    setShowPaymentMethods(false);
    
    // Initiate payment
    const plan = plans?.find(p => p.id === selectedPlan);
    if (plan) {
      initiatePaymentMutation.mutate({
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        billingCycle,
        paymentProvider: paymentMethod.provider,
        paymentMethod: paymentMethod.method,
        currency: 'USD', // You might want to detect user's currency
      });
    }
  };

  const filteredPlans = plans?.filter(plan => 
    billingCycle === "MONTHLY" ? plan.billingCycle === "MONTHLY" : plan.billingCycle === "YEARLY"
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock premium job opportunities and accelerate your career
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === "MONTHLY" ? "text-gray-900" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "MONTHLY" ? "YEARLY" : "MONTHLY")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === "YEARLY" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === "YEARLY" ? "text-gray-900" : "text-gray-500"}`}>
              Yearly
            </span>
            {billingCycle === "YEARLY" && (
              <Badge variant="outline" className="ml-2 bg-green-100 border-green-300 text-green-800">
                Save 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-900">Active Subscription</h3>
                      <p className="text-sm text-green-700">
                        {currentSubscription.planName} - ${currentSubscription.price}/{currentSubscription.billingCycle.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Cards */}
        {plansLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {filteredPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    <Star className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                )}
                
                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                  <div className="flex justify-center mb-4">
                    {plan.id === "basic" ? (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-gray-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{plan.billingCycle.toLowerCase()}
                    </span>
                  </div>
                  
                  {plan.id !== "basic" && billingCycle === "YEARLY" && (
                    <p className="text-sm text-green-600 mt-2">
                      Save ${(plan.price * 12) - 199.99} per year
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {currentSubscription ? (
                    <div className="text-center">
                      <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        Current Plan
                      </Badge>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id, plan.name, plan.price)}
                      disabled={createSubscriptionMutation.isPending}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                        plan.id === "basic"
                          ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                          : plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {createSubscriptionMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : plan.id === "basic" ? (
                        "Current Plan"
                      ) : (
                        "Subscribe Now"
                      )}
                    </button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Features Comparison */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Premium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Job Access</h3>
              <p className="text-gray-600">
                Access to exclusive premium job listings with higher salaries and better benefits.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priority Applications</h3>
              <p className="text-gray-600">
                Your applications get reviewed first by employers, increasing your chances of landing interviews.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Contact</h3>
              <p className="text-gray-600">
                Connect directly with hiring managers and skip the traditional application process.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have premium access until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's the difference between monthly and yearly plans?
              </h3>
              <p className="text-gray-600">
                Yearly plans offer a 17% discount compared to monthly billing. You get the same features but save money by paying annually.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I get a refund if I'm not satisfied?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied with your premium experience, contact us for a full refund.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have found their dream jobs through VizzarJobs Premium.
            </p>
            {!session?.user ? (
              <Link
                href="/auth/signin?callbackUrl=/pricing"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Sign Up for Premium
              </Link>
            ) : (
              <button
                onClick={() => setSelectedPlan("premium")}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <Crown className="w-5 h-5 mr-2" />
                Start Premium Trial
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment Method Selection Modal */}
      {showPaymentMethods && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Choose Payment Method
              </h3>
              <p className="text-gray-600">
                Select your preferred payment method for Uganda
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {paymentMethods?.map((method, index) => (
                <button
                  key={index}
                  onClick={() => handlePaymentMethodSelect(method)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">
                        {method.provider === 'FLUTTERWAVE' && 'Secure payment processing'}
                        {method.provider === 'PAYPAL' && 'International payment'}
                        {method.provider === 'MANUAL' && 'Bank transfer or manual payment'}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowPaymentMethods(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}