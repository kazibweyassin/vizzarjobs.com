"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
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
  ExternalLink,
  Sparkles,
  Brain,
  CheckCircle
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
        console.log('Payment initiated:', data);
      }
    },
    onError: (error) => {
      console.error('Payment error:', error);
    }
  });

  const handlePayment = async (planId: string) => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      await initiatePaymentMutation.mutateAsync({
        planId,
        paymentMethodId: selectedPaymentMethod.id,
        billingCycle,
      });
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: 0, yearly: 0 },
      features: [
        "Browse AI/ML jobs in Canada",
        "Basic profile creation",
        "Apply to 5 jobs per month",
        "Email support"
      ],
      limitations: [
        "Limited job applications",
        "Basic matching algorithm",
        "No priority support"
      ],
      popular: false,
      color: "gray"
    },
    {
      id: "premium",
      name: "Premium",
      description: "For serious AI/ML professionals",
      price: { monthly: 29, yearly: 290 },
      features: [
        "Unlimited job applications",
        "Advanced AI/ML matching",
        "Priority in talent pool",
        "Direct employer access",
        "Portfolio showcase",
        "Priority support",
        "Canada visa guidance"
      ],
      limitations: [],
      popular: true,
      color: "blue"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For companies hiring AI/ML talent",
      price: { monthly: 199, yearly: 1990 },
      features: [
        "Post unlimited AI/ML jobs",
        "Access to premium talent pool",
        "Advanced candidate filtering",
        "Direct candidate contact",
        "Custom job matching",
        "Dedicated account manager",
        "Canada immigration support"
      ],
      limitations: [],
      popular: false,
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              AI/ML Talent • Canada Focus
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
            >
              Simple Pricing.
              <br />
              <span className="text-blue-600">Maximum Value.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Choose the perfect plan for your AI/ML career in Canada.
              <br />
              No hidden fees, no surprises.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center mb-12"
          >
            <div className="flex bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setBillingCycle("MONTHLY")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  billingCycle === "MONTHLY"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Monthly
            </button>
              <button
                onClick={() => setBillingCycle("YEARLY")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  billingCycle === "YEARLY"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600"
                }`}
              >
              Yearly
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  Save 20%
            </span>
              </button>
          </div>
          </motion.div>

        {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? "border-blue-600 scale-105" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.color === "blue" ? "bg-blue-100" : 
                    plan.color === "purple" ? "bg-purple-100" : "bg-gray-100"
                  }`}>
                    {plan.color === "blue" ? (
                      <Brain className="w-8 h-8 text-blue-600" />
                    ) : plan.color === "purple" ? (
                      <Building2 className="w-8 h-8 text-purple-600" />
                    ) : (
                      <Users className="w-8 h-8 text-gray-600" />
                    )}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-gray-900">
                      ${billingCycle === "YEARLY" ? plan.price.yearly : plan.price.monthly}
                    </div>
                    <div className="text-gray-600">
                      {billingCycle === "YEARLY" ? "per year" : "per month"}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-0">
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    </div>

                    <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {plan.price.monthly === 0 ? "Get Started" : "Choose Plan"}
                    </button>
                </CardContent>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
          </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All plans include access to Canada's premier AI/ML job market
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI/ML Focus",
                description: "Specialized matching for artificial intelligence and machine learning roles"
              },
              {
                icon: CheckCircle,
                title: "Canada Visa Support",
                description: "Guidance and support for Canadian work visa applications"
              },
              {
                icon: Star,
                title: "Premium Companies",
                description: "Access to Canada's most innovative AI/ML companies"
              },
              {
                icon: Zap,
                title: "Fast Matching",
                description: "Advanced algorithms to match you with the perfect role"
              },
              {
                icon: Shield,
                title: "Secure Platform",
                description: "Enterprise-grade security for your personal information"
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "Dedicated support team with AI/ML industry expertise"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
            </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

        {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of AI/ML professionals who've found their dream jobs in Canada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Journey
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}