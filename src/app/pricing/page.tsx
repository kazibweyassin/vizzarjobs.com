"use client";

import { motion } from "framer-motion";
import { Check, HelpCircle, X } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function PricingPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
      }
    }
  };

  // Pricing data
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "For job seekers looking for visa-sponsored opportunities",
      features: [
        "Browse all available jobs",
        "Create a professional profile",
        "Apply to 3 jobs per month",
        "Basic job matching",
        "Email notifications for new jobs",
      ],
      notIncluded: [
        "Priority application review",
        "Advanced job matching",
        "Featured candidate status",
        "Direct employer connections"
      ],
      buttonText: "Get Started",
      buttonLink: "/auth/signin",
      popular: false
    },
    {
      name: "Premium Candidate",
      price: "$29",
      period: "per month",
      description: "For serious job seekers wanting to maximize their chances",
      features: [
        "All Basic features",
        "Unlimited job applications",
        "Priority application review",
        "Advanced job matching algorithm",
        "Featured candidate status",
        "Resume and interview coaching",
        "Early access to new job listings"
      ],
      notIncluded: [],
      buttonText: "Subscribe",
      buttonLink: "/auth/signin?plan=premium",
      popular: true
    },
    {
      name: "Employer",
      price: "$199",
      period: "per month",
      description: "For companies looking to hire global talent",
      features: [
        "Post up to 5 job listings",
        "Premium company profile",
        "Access to candidate database",
        "Visa sponsorship guidance",
        "Applicant tracking system",
        "Analytics dashboard",
        "Dedicated account manager"
      ],
      notIncluded: [],
      buttonText: "Contact Sales",
      buttonLink: "/contact",
      popular: false
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For larger organizations with specific hiring needs",
      features: [
        "All Employer features",
        "Unlimited job postings",
        "Custom hiring workflow",
        "Integration with your ATS",
        "Talent pool curation",
        "Bulk candidate processing",
        "Priority support",
        "Custom reporting",
      ],
      notIncluded: [],
      buttonText: "Get in Touch",
      buttonLink: "/contact",
      popular: false
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-[#f8faff] to-[#f0f4ff] min-h-screen">
      {/* Hero section */}
      <div className="pt-20 pb-16 text-center">
        <motion.div 
          className="mx-auto max-w-3xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-3 bg-blue-100 text-blue-800 hover:bg-blue-200">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Transparent pricing for global opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your goals, whether you're seeking opportunities abroad or hiring global talent.
          </p>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className={`relative ${plan.popular ? 'transform -translate-y-4 scale-[1.02]' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-5 inset-x-0 flex justify-center">
                <div className="bg-blue-600 text-white text-sm font-bold py-1 px-4 rounded-full">
                  Most Popular
                </div>
              </div>
            )}
            <Card className={`h-full flex flex-col border-2 ${
              plan.popular ? 'border-blue-500 shadow-xl shadow-blue-100' : 'border-gray-100'
            }`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider">
                    What's included
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mt-6">
                        Not included
                      </h4>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="h-5 w-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <X className="h-3 w-3 text-red-600" />
                            </div>
                            <span className="text-gray-500 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-6">
                <Button 
                  asChild
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href={plan.buttonLink}>
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 mb-20">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-4">Find answers to common questions about our pricing plans</p>
        </motion.div>

        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              question: "How does billing work?",
              answer: "For monthly plans, we charge at the beginning of each month. You can cancel your subscription anytime before the next billing cycle."
            },
            {
              question: "Can I upgrade my plan later?",
              answer: "Yes, you can upgrade your plan at any time. The new pricing will be prorated for the remainder of the billing cycle."
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise customers."
            },
            {
              question: "Do you offer discounts for annual billing?",
              answer: "Yes, we offer a 20% discount when you choose annual billing for any of our plans."
            },
            {
              question: "Is there a free trial available?",
              answer: "For employer plans, we offer a 14-day free trial. For job seekers, the Basic plan is always free."
            },
            {
              question: "What happens if I exceed my job application limit?",
              answer: "On the Basic plan, you're limited to 3 job applications per month. You'll need to upgrade to the Premium plan for unlimited applications."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.01,
                boxShadow: "0 10px 30px -12px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  <HelpCircle className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to begin your global career journey?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of professionals who have found visa-sponsored opportunities through VizzarJobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                asChild
              >
                <Link href="/auth/signin">
                  Create Free Account
                </Link>
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-700"
                asChild
              >
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
