"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  Globe, 
  CheckCircle, 
  Zap, 
  Shield, 
  Award, 
  Clock,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Target,
  Sparkles
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function EmployersHirePage() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-blue-900 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">
                Trusted by Leading Tech Companies
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Find Top Talent in
              <span className="block text-emerald-400">East Africa</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Connect with skilled professionals across Technology, Sales, Marketing, Finance, and more 
              from Uganda, Kenya, Rwanda, and Tanzania. <span className="font-semibold text-emerald-400">Quality talent, competitive rates.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowContactForm(true)}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-full"
              >
                <Mail className="w-5 h-5 mr-2" />
                Schedule a Call
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Verified professionals</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Quick candidate matching</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Quality talent pool</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose VizzarJobs?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're not just another job board. We're your strategic partner for building world-class tech teams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "East Africa's Top Talent",
                description: "Access skilled professionals across Technology, Sales, Marketing, Finance, and more from Uganda, Kenya, Rwanda, and Tanzania."
              },
              {
                icon: CheckCircle,
                title: "Verified Professionals",
                description: "All candidates are verified with background checks, skills assessments, and professional references to ensure quality."
              },
              {
                icon: Zap,
                title: "Quick Candidate Matching",
                description: "Our curated talent pool means you meet qualified candidates quickly, saving you time in your hiring process."
              },
              {
                icon: Shield,
                title: "Pre-Vetted & Verified",
                description: "Every candidate undergoes technical assessments, background checks, and English proficiency testing before joining our pool."
              },
              {
                icon: Award,
                title: "Performance Guarantee",
                description: "30-day replacement guarantee if the hire doesn't meet your expectations. Your success is our priority."
              },
              {
                icon: Users,
                title: "Dedicated Support",
                description: "Your account manager guides you through hiring, onboarding, and provides support for the first 90 days."
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
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From search to hire in 3 simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: "1",
                title: "Tell Us Your Needs",
                description: "Share your role requirements, tech stack, and timeline. We'll understand your exact hiring needs and budget."
              },
              {
                number: "2",
                title: "Meet Pre-Vetted Candidates",
                description: "Within 48 hours, we present 3-5 qualified candidates matched to your specific requirements with verified skills."
              },
              {
                number: "3",
                title: "Hire with Confidence",
                description: "Interview, select, and onboard your new team member. We support you through the entire hiring process."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                  <span className="text-white text-3xl font-bold">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transparent, Performance-Based Pricing
            </h2>
            <p className="text-lg text-gray-600">
              No upfront fees. Only pay when you hire.
            </p>
          </motion.div>

          <Card className="border-2 border-gray-200 shadow-xl">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-3">
                  15% of first year salary
                </div>
                <div className="text-xl text-gray-600">One-time placement fee</div>
              </div>

              <div className="pt-8 border-t-2 border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What's Included:</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    "Comprehensive background verification",
                    "Skills assessments & screening",
                    "Candidate matching & shortlisting",
                    "Interview coordination support",
                    "Onboarding assistance",
                    "Dedicated account management"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 text-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-full">
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <p className="text-gray-500 text-sm mt-4">
                  Free consultation • No commitment required
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Tech Team?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join leading companies who trust VizzarJobs for their hiring needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-6 text-lg font-semibold rounded-full">
                  Start Hiring Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowContactForm(true)}
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-full"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a href="mailto:opportunities-kazibweusama@gmail.com" className="text-gray-700 hover:text-blue-600">
                    opportunities-kazibweusama@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <a href="tel:+256704833021" className="text-gray-700 hover:text-blue-600">
                    +256 704 833 021
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">Uganda</span>
                </div>
              </div>
              <Button 
                onClick={() => setShowContactForm(false)}
                className="w-full mt-6"
                variant="outline"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

